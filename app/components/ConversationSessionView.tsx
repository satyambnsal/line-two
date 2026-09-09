"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  ConversationMessage,
  DirectoryEntry,
} from "@/lib/avatars";

const simulatedReplies = [
  "Thanks for sharing that. Everything you write here can be reviewed by {firstName}, so feel free to add any detail that would help.",
  "Got it. Is there anything else you would like {firstName} to know before this conversation is handed over?",
  "That gives a clear picture. You can add more context, or finish here and {firstName} may pick the conversation up from there.",
  "Understood. Once you finish, this conversation may be reviewed by {firstName}. Would you like to say anything else?",
];

function deterministicReply(text: string, firstName: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return simulatedReplies[hash % simulatedReplies.length].replaceAll(
    "{firstName}",
    firstName,
  );
}

export default function ConversationSessionView({
  avatar,
}: {
  avatar: DirectoryEntry;
}) {
  const firstName = avatar.name.split(" ")[0];
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: "m-0",
      author: "avatar",
      text: `Hi, I'm ${firstName}'s avatar. What brings you here today? Please share why you'd like to connect with ${firstName}.`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [nextMessageNumber, setNextMessageNumber] = useState(1);

  const hasVisitorMessage = messages.some(
    (message) => message.author === "visitor",
  );
  const canSend = draft.trim().length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0) {
      return;
    }

    const number = nextMessageNumber;
    setNextMessageNumber(number + 2);
    setMessages((current) => [
      ...current,
      { id: `m-${number}`, author: "visitor", text },
      {
        id: `m-${number + 1}`,
        author: "avatar",
        text: deterministicReply(text, firstName),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <Link
          href={`/avatars/${avatar.id}`}
          className="w-fit text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          &larr; Back to profile
        </Link>

        <section className="flex flex-col overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950">
          <header className="flex items-center gap-3 border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
              {avatar.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <h1 className="text-base font-semibold text-black dark:text-zinc-50">
                Conversation with {firstName}&rsquo;s avatar
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Simulated conversation. {avatar.name} may review it afterwards.
              </p>
            </div>
          </header>

          <ul className="flex flex-col gap-3 px-6 py-6">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`flex ${message.author === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    message.author === "visitor"
                      ? "rounded-br-sm bg-foreground text-background"
                      : "rounded-bl-sm bg-black/[.06] text-zinc-800 dark:bg-white/[.08] dark:text-zinc-200"
                  }`}
                >
                  {message.text}
                </p>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-black/[.08] px-6 py-4 dark:border-white/[.145]"
          >
            <label htmlFor="visitor-message" className="sr-only">
              Your message
            </label>
            <input
              id="visitor-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Share why you'd like to connect…"
              className="h-11 flex-1 rounded-full border border-black/[.08] bg-transparent px-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black/[.25] dark:border-white/[.145] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.4]"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
            >
              Send
            </button>
          </form>
        </section>

        {hasVisitorMessage ? (
          <Link
            href={`/avatars/${avatar.id}/acknowledgement`}
            className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
          >
            Finish conversation
          </Link>
        ) : (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Send a message to finish this conversation.
          </p>
        )}
      </main>
    </div>
  );
}
