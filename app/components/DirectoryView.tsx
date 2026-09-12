import Link from "next/link";
import { directory } from "@/lib/avatars";

export default function DirectoryView() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Line Two
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Reach the people behind the profiles
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Choose a person below and start a conversation with their avatar.
            The avatar passes your intent along, and the person decides whether
            to continue it.
          </p>
          <Link
            href="/onboarding"
            className="w-fit self-center rounded-full border border-solid border-black/[.08] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06] sm:self-start"
          >
            Create your avatar
          </Link>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {directory.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/avatars/${entry.id}`}
                className="flex h-full flex-col gap-3 rounded-2xl border border-black/[.08] bg-white p-6 transition-colors hover:border-transparent hover:bg-black/[.03] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-base font-semibold text-background">
                    {entry.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                      {entry.name}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Avatar available
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {entry.summary}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {entry.interests.map((interest) => (
                    <li
                      key={interest}
                      className="rounded-full bg-black/[.06] px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
