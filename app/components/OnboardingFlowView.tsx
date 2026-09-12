"use client";

import { useState } from "react";
import OnboardingEntryView from "@/components/OnboardingEntryView";
import OnboardingQuestionnaireView from "@/components/OnboardingQuestionnaireView";
import ProfilePreviewView from "@/components/ProfilePreviewView";
import {
  createEmptyResponseSet,
  onboardingSections,
  type OnboardingResponseSet,
} from "@/lib/onboarding";

type OnboardingPhase =
  | { kind: "entry" }
  | { kind: "questionnaire"; sectionIndex: number }
  | { kind: "preview"; sectionIndex: number };

export default function OnboardingFlowView() {
  const [phase, setPhase] = useState<OnboardingPhase>({ kind: "entry" });
  const [responses, setResponses] = useState<OnboardingResponseSet>(
    createEmptyResponseSet(),
  );

  function handleResponseChange(
    field: keyof OnboardingResponseSet,
    value: string,
  ) {
    setResponses((current) => ({ ...current, [field]: value }));
  }

  if (phase.kind === "entry") {
    return (
      <OnboardingEntryView
        onStart={() => setPhase({ kind: "questionnaire", sectionIndex: 0 })}
      />
    );
  }

  if (phase.kind === "preview") {
    return (
      <ProfilePreviewView
        responses={responses}
        onBackToQuestionnaire={() =>
          setPhase({
            kind: "questionnaire",
            sectionIndex: phase.sectionIndex,
          })
        }
      />
    );
  }

  return (
    <OnboardingQuestionnaireView
      sections={onboardingSections}
      sectionIndex={phase.sectionIndex}
      responses={responses}
      onResponseChange={handleResponseChange}
      onPrevious={() =>
        setPhase((current) =>
          current.kind === "questionnaire" && current.sectionIndex > 0
            ? { kind: "questionnaire", sectionIndex: current.sectionIndex - 1 }
            : current,
        )
      }
      onNext={() =>
        setPhase((current) =>
          current.kind === "questionnaire" &&
          current.sectionIndex < onboardingSections.length - 1
            ? { kind: "questionnaire", sectionIndex: current.sectionIndex + 1 }
            : current,
        )
      }
      onOpenPreview={() =>
        setPhase((current) =>
          current.kind === "questionnaire"
            ? { kind: "preview", sectionIndex: current.sectionIndex }
            : current,
        )
      }
    />
  );
}
