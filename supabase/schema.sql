-- Line Two — v1 Supabase schema
--
-- Auth model:
--   * User accounts live in supabase.auth.users (managed by Supabase Auth).
--     Sign-in is email-only: 6-digit OTP codes and magic links, both sent via
--     auth.signInWithOtp({ email }). No passwords are stored anywhere.
--   * Every new auth.users row gets a matching public.profiles row via the
--     on_auth_user_created trigger below.
--   * Visitors are anonymous by default; they never need an account to talk
--     to an avatar. Identity (email) is only captured when they want to be
--     reached, or if they sign in themselves.
--
-- Apply in order in the Supabase SQL editor (or `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one per authenticated owner
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision a profile whenever a user signs up (OTP or magic link).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- onboarding_responses — questionnaire answers, one set per owner
-- (the source data an avatar profile is later derived from)
-- ---------------------------------------------------------------------------

create table public.onboarding_responses (
  owner_id uuid primary key references public.profiles (id) on delete cascade,
  display_name text not null default '',
  background text not null default '',
  work text not null default '',
  interests text not null default '',
  worldview text not null default '',
  preferred_conversations text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger onboarding_responses_set_updated_at
  before update on public.onboarding_responses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- avatars — the public-facing persona, one per owner in v1
-- ---------------------------------------------------------------------------

create table public.avatars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles (id) on delete cascade,
  name text not null,
  summary text not null default '',
  interests text[] not null default '{}',
  conversation_boundaries text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger avatars_set_updated_at
  before update on public.avatars
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- conversations — a visitor (or signed-in user) talking to one avatar
-- ---------------------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  avatar_id uuid not null references public.avatars (id) on delete cascade,
  visitor_id uuid references public.profiles (id) on delete set null,
  visitor_email text,
  status text not null default 'open' check (status in ('open', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create index conversations_avatar_id_idx on public.conversations (avatar_id);
create index conversations_visitor_id_idx on public.conversations (visitor_id);

-- ---------------------------------------------------------------------------
-- messages — individual turns within a conversation
-- ---------------------------------------------------------------------------

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  author text not null check (author in ('visitor', 'avatar')),
  body text not null check (length(btrim(body)) > 0),
  created_at timestamptz not null default now()
);

create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.avatars enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- profiles: owners see and edit only themselves
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- onboarding_responses: strictly owner-private
create policy "onboarding_responses_all_own" on public.onboarding_responses
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- avatars: published ones are public; owners manage their own
create policy "avatars_select_published" on public.avatars
  for select using (status = 'published');

create policy "avatars_select_own" on public.avatars
  for select using (owner_id = auth.uid());

create policy "avatars_insert_own" on public.avatars
  for insert with check (owner_id = auth.uid());

create policy "avatars_update_own" on public.avatars
  for update using (owner_id = auth.uid());

create policy "avatars_delete_own" on public.avatars
  for delete using (owner_id = auth.uid());

-- conversations: anyone may start one; owners review conversations with
-- their avatars; signed-in visitors can read their own
create policy "conversations_insert_anyone" on public.conversations
  for insert with check (true);

create policy "conversations_select_avatar_owner" on public.conversations
  for select using (
    exists (
      select 1 from public.avatars a
      where a.id = avatar_id and a.owner_id = auth.uid()
    )
  );

create policy "conversations_select_visitor" on public.conversations
  for select using (visitor_id = auth.uid());

-- messages: visitor turns may be posted by anyone into an open conversation;
-- avatar turns are written by the server with the service-role key, which
-- bypasses RLS. Reads are limited to the avatar owner and the signed-in
-- conversation visitor.
create policy "messages_insert_visitor_open" on public.messages
  for insert with check (
    author = 'visitor'
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.status = 'open'
    )
  );

create policy "messages_select_avatar_owner" on public.messages
  for select using (
    exists (
      select 1
      from public.conversations c
      join public.avatars a on a.id = c.avatar_id
      where c.id = conversation_id and a.owner_id = auth.uid()
    )
  );

create policy "messages_select_conversation_visitor" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.visitor_id = auth.uid()
    )
  );
