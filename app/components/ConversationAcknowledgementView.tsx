import Link from "next/link";
import type { DirectoryEntry } from "@/lib/avatars";

export default function ConversationAcknowledgementView({
  avatar,
}: {
  avatar: DirectoryEntry;
}) {
  const firstName = avatar.name.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-2xl font-semibold text-background">
          &#10003;
        </span>

        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Thanks for the conversation
          </h1>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Your conversation with {firstName}&rsquo;s avatar has ended.{" "}
            {avatar.name} may review this conversation and decide whether to
            continue it with you directly. Nothing has been sent yet beyond this
            mock.
          </p>
        </section>

        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Back to Directory
        </Link>
      </main>
    </div>
  );
}
