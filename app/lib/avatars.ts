export interface DirectoryEntry {
  id: string;
  name: string;
  summary: string;
  interests: string[];
  conversation_boundaries: string;
}

export type ConversationMessageAuthor = "visitor" | "avatar";

export interface ConversationMessage {
  id: string;
  author: ConversationMessageAuthor;
  text: string;
}

export const directory: DirectoryEntry[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    summary:
      "Product designer at a Berlin fintech studio. Priya's avatar can talk through her design work and what she is looking for in collaborations.",
    interests: ["design systems", "typography", "climate tech", "bouldering"],
    conversation_boundaries:
      "Happy to discuss design practice, portfolios, and collaboration ideas. Please keep messages respectful and on topic.",
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    summary:
      "Founder of a small logistics startup. Marcus's avatar can share what the company is building and how he likes to meet new people.",
    interests: ["supply chains", "running", "angel investing", "street food"],
    conversation_boundaries:
      "Open to conversations about the startup, hiring, and partnerships. Not available for sales pitches or financial advice requests.",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    summary:
      "Machine learning engineer and community mentor. Amara's avatar can introduce her mentoring program and answer common questions about it.",
    interests: ["machine learning", "mentoring", "open source", "afrobeats"],
    conversation_boundaries:
      "Best for mentoring inquiries and community questions. She reviews conversations personally before responding to anyone.",
  },
  {
    id: "diego-ramirez",
    name: "Diego Ramirez",
    summary:
      "Jazz guitarist and music teacher in Mexico City. Diego's avatar can talk about his classes, gigs, and how lessons work.",
    interests: ["jazz guitar", "music theory", "vinyl collecting", "cycling"],
    conversation_boundaries:
      "Welcomes questions about lessons and performances. Please avoid automated bulk messages and spam.",
  },
];

export function getDirectoryEntry(id: string): DirectoryEntry | undefined {
  return directory.find((entry) => entry.id === id);
}
