export default function OnboardingEntryView({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <section className="flex flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Line Two for owners
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Create your avatar
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Answer five short sections about your background, work,
            interests, worldview, and the conversations you welcome. Your
            avatar will use them to introduce you to visitors.
          </p>
        </section>

        <ul className="grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {[
            "Five guided sections",
            "Answers kept while you review",
            "A profile preview at the end",
            "Nothing is published",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-black/[.08] bg-white px-5 py-4 text-sm text-zinc-700 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-300"
            >
              <span
                aria-hidden
                className="text-base font-semibold text-zinc-400 dark:text-zinc-500"
              >
                &#10003;
              </span>
              {item}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onStart}
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Start the questionnaire
        </button>
      </main>
    </div>
  );
}
