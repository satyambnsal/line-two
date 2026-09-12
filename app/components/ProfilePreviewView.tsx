import type { OnboardingResponseSet } from "@/lib/onboarding";

function responseLine(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export default function ProfilePreviewView({
  responses,
  onBackToQuestionnaire,
}: {
  responses: OnboardingResponseSet;
  onBackToQuestionnaire: () => void;
}) {
  const displayName = responseLine(responses.display_name, "Your name");

  const details: { title: string; value: string }[] = [
    {
      title: "Background",
      value: responseLine(responses.background, "Not provided yet."),
    },
    { title: "Work", value: responseLine(responses.work, "Not provided yet.") },
    {
      title: "Interests",
      value: responseLine(responses.interests, "Not provided yet."),
    },
    {
      title: "Worldview",
      value: responseLine(responses.worldview, "Not provided yet."),
    },
    {
      title: "Preferred conversations",
      value: responseLine(
        responses.preferred_conversations,
        "Not provided yet.",
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <p className="rounded-2xl border border-dashed border-black/[.2] bg-white px-5 py-4 text-sm leading-6 text-zinc-600 dark:border-white/[.25] dark:bg-zinc-950 dark:text-zinc-300">
          <strong className="font-semibold text-black dark:text-zinc-50">
            Mock preview.
          </strong>{" "}
          This is a local preview built from your answers in this session. It
          is not a published avatar, and nothing here is visible to visitors.
        </p>

        <section className="flex flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
          <header className="flex flex-col gap-2 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
              {displayName
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {displayName}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              How your avatar may introduce you to visitors
            </p>
          </header>

          <dl className="flex flex-col gap-5">
            {details.map((detail) => (
              <div key={detail.title} className="flex flex-col gap-1">
                <dt className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {detail.title}
                </dt>
                <dd className="whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <button
          type="button"
          onClick={onBackToQuestionnaire}
          className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
        >
          &larr; Back to the questionnaire
        </button>
      </main>
    </div>
  );
}
