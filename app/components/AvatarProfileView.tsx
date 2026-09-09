import Link from "next/link";
import type { DirectoryEntry } from "@/lib/avatars";

export default function AvatarProfileView({
  avatar,
}: {
  avatar: DirectoryEntry;
}) {
  const firstName = avatar.name.split(" ")[0];
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8">
        <Link
          href="/"
          className="w-fit text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          &larr; Back to Directory
        </Link>

        <section className="flex flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
              {avatar.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
                {avatar.name}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                You are talking to {firstName}&rsquo;s avatar, not {firstName}{" "}
                directly.
              </p>
            </div>
          </div>

          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
            {avatar.summary}
          </p>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Interests
            </h2>
            <ul className="flex flex-wrap gap-2">
              {avatar.interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full bg-black/[.06] px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Conversation boundaries
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {avatar.conversation_boundaries}
            </p>
          </div>

          <Link
            href={`/avatars/${avatar.id}/conversation`}
            className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Start a conversation
          </Link>
        </section>
      </main>
    </div>
  );
}
