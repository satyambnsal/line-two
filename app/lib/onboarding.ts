export type OnboardingResponseField =
  | "display_name"
  | "background"
  | "work"
  | "interests"
  | "worldview"
  | "preferred_conversations";

export interface OnboardingPrompt {
  id: string;
  label: string;
  field: OnboardingResponseField;
  multiline: boolean;
}

export interface OnboardingSection {
  id: string;
  title: string;
  description: string;
  prompts: OnboardingPrompt[];
}

export type OnboardingResponseSet = Record<OnboardingResponseField, string>;

export const onboardingSections: OnboardingSection[] = [
  {
    id: "background",
    title: "Background",
    description:
      "Start with the basics. This helps your avatar introduce you and ground every conversation it holds on your behalf.",
    prompts: [
      {
        id: "p-display-name",
        label: "What name should your avatar use to introduce you?",
        field: "display_name",
        multiline: false,
      },
      {
        id: "p-background",
        label:
          "Where are you based, and what is the short story of how you got here?",
        field: "background",
        multiline: true,
      },
    ],
  },
  {
    id: "work",
    title: "Work",
    description:
      "Describe what you spend your working hours on, so your avatar can speak about it in your words.",
    prompts: [
      {
        id: "p-work",
        label: "What do you do for work, and what do you enjoy about it?",
        field: "work",
        multiline: true,
      },
    ],
  },
  {
    id: "interests",
    title: "Interests",
    description:
      "Share the things you care about outside of work. They make your avatar feel like you.",
    prompts: [
      {
        id: "p-interests",
        label:
          "What topics, hobbies, or passions would you happily talk about for hours?",
        field: "interests",
        multiline: true,
      },
    ],
  },
  {
    id: "worldview",
    title: "Worldview",
    description:
      "Optional but powerful. The values and perspectives your avatar should carry into conversations.",
    prompts: [
      {
        id: "p-worldview",
        label:
          "What beliefs, values, or perspectives should your avatar reflect?",
        field: "worldview",
        multiline: true,
      },
    ],
  },
  {
    id: "preferred_conversations",
    title: "Preferred conversations",
    description:
      "Set expectations for visitors, so the conversations that reach you are the ones you actually want.",
    prompts: [
      {
        id: "p-preferred-conversations",
        label:
          "Which conversations do you welcome, and which should your avatar politely decline?",
        field: "preferred_conversations",
        multiline: true,
      },
    ],
  },
];

export function createEmptyResponseSet(): OnboardingResponseSet {
  return {
    display_name: "",
    background: "",
    work: "",
    interests: "",
    worldview: "",
    preferred_conversations: "",
  };
}
