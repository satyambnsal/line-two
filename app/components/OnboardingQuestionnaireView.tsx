import type {
  OnboardingResponseSet,
  OnboardingSection,
} from "@/lib/onboarding";

export default function OnboardingQuestionnaireView({
  sections,
  sectionIndex,
  responses,
  onResponseChange,
  onPrevious,
  onNext,
  onOpenPreview,
}: {
  sections: OnboardingSection[];
  sectionIndex: number;
  responses: OnboardingResponseSet;
  onResponseChange: (field: keyof OnboardingResponseSet, value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onOpenPreview: () => void;
}) {
  const section = sections[sectionIndex];
  const isLastSection = sectionIndex === sections.length - 1;
  const progressPercent = ((sectionIndex + 1) / sections.length) * 100;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Section {sectionIndex + 1} of {sections.length} &middot;{" "}
            {section.title}
          </p>
          <div
            role="progressbar"
            aria-valuenow={sectionIndex + 1}
            aria-valuemin={1}
            aria-valuemax={sections.length}
            aria-label={`Onboarding progress: section ${sectionIndex + 1} of ${sections.length}`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-black/[.08] dark:bg-white/[.145]"
          >
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <ol className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {sections.map((item, index) => (
              <li
                key={item.id}
                className={
                  index === sectionIndex
                    ? "font-semibold text-black dark:text-zinc-50"
                    : index < sectionIndex
                      ? "text-zinc-500 dark:text-zinc-400"
                      : "text-zinc-400 dark:text-zinc-600"
                }
              >
                {index + 1}. {item.title}
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {section.title}
            </h1>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {section.description}
            </p>
          </header>

          <div className="flex flex-col gap-5">
            {section.prompts.map((prompt) => (
              <div key={prompt.id} className="flex flex-col gap-2">
                <label
                  htmlFor={prompt.id}
                  className="text-sm font-medium text-black dark:text-zinc-50"
                >
                  {prompt.label}
                </label>
                {prompt.multiline ? (
                  <textarea
                    id={prompt.id}
                    rows={4}
                    value={responses[prompt.field]}
                    onChange={(event) =>
                      onResponseChange(prompt.field, event.target.value)
                    }
                    className="w-full resize-y rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm leading-6 text-black outline-none placeholder:text-zinc-400 focus:border-black/[.25] dark:border-white/[.145] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.4]"
                  />
                ) : (
                  <input
                    id={prompt.id}
                    type="text"
                    value={responses[prompt.field]}
                    onChange={(event) =>
                      onResponseChange(prompt.field, event.target.value)
                    }
                    className="h-11 w-full rounded-full border border-black/[.08] bg-transparent px-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black/[.25] dark:border-white/[.145] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.4]"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          {sectionIndex > 0 ? (
            <button
              type="button"
              onClick={onPrevious}
              className="flex h-11 items-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
            >
              &larr; Previous
            </button>
          ) : (
            <span />
          )}
          {isLastSection ? (
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Open profile preview
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Next section &rarr;
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
