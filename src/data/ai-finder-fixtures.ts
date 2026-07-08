import type { TasteProfile } from "@/utils/taste-profile";

export type AiTone = "terracotta" | "latte" | "olive";

export type AiAlternative = {
  name: string;
  betterFor: string;
  tone: AiTone;
};

export type AiCafe = {
  id: string;
  name: string;
  meta: string;
  tone: AiTone;
  whyItMatches: string[];
  alternatives: AiAlternative[];
  keywords: string[];
  baseScore: number;
};

export type AiFinderResult =
  | { status: "match"; match: AiCafe }
  | { status: "unavailable" };

export const aiChips = [
  "Quiet work spot",
  "Cute date cafe",
  "Aesthetic photos",
  "Good latte",
  "Open late",
  "Outdoor chill",
] as const;

export const aiConfidenceLine =
  "Based on reviews, photos, hours, and your taste profile.";

export const aiUnavailableTitle = "CafeMood AI is taking a coffee break.";

// Reserved demo prompt: a real provider failure maps to the same
// unavailable state (decision 0013).
const UNAVAILABLE_TRIGGER = "coffee break";

export const AI_THINKING_MS = 450;

export const aiCafes: AiCafe[] = [
  {
    id: "mostra",
    name: "Mostra Coffee",
    meta: "North Park · 0.3 mi · Open now",
    tone: "terracotta",
    whyItMatches: [
      "Latte quality is the most praised note in recent reviews.",
      "Warm light and cozy corners match your aesthetic leanings.",
      "Open now and an easy 0.3 mi from you.",
    ],
    alternatives: [
      { name: "Communal Coffee", betterFor: "Better for work", tone: "latte" },
      { name: "Garden Cafe", betterFor: "Better for photos", tone: "olive" },
      {
        name: "Better Buzz",
        betterFor: "Better for parking",
        tone: "terracotta",
      },
    ],
    keywords: [
      "cute",
      "aesthetic",
      "latte",
      "coffee",
      "photos",
      "photo",
      "specialty",
      "good latte",
      "north park",
    ],
    baseScore: 9.1,
  },
  {
    id: "marigold",
    name: "Marigold & Oak",
    meta: "North Park · 0.5 mi · Quiet after 2pm",
    tone: "latte",
    whyItMatches: [
      "Quiet after 2pm with tables next to outlets.",
      "Easy street parking on 30th for longer sessions.",
      "Steady wifi keeps work stretches uninterrupted.",
    ],
    alternatives: [
      {
        name: "Hearth Supply Co.",
        betterFor: "Better for late nights",
        tone: "latte",
      },
      { name: "Mostra Coffee", betterFor: "Better for latte", tone: "terracotta" },
      { name: "Better Buzz", betterFor: "Better for parking", tone: "olive" },
    ],
    keywords: [
      "quiet",
      "work",
      "study",
      "parking",
      "outlets",
      "wifi",
      "spot",
      "north park",
    ],
    baseScore: 8.9,
  },
  {
    id: "terrace",
    name: "Terrace & Thistle",
    meta: "South Park · 0.7 mi · Patio seating",
    tone: "olive",
    whyItMatches: [
      "Plant-filled patio with softer crowd energy.",
      "Golden-hour light makes the garden tables photogenic.",
      "Date-friendly pacing without long lines.",
    ],
    alternatives: [
      { name: "Garden Cafe", betterFor: "Better for photos", tone: "olive" },
      { name: "Mostra Coffee", betterFor: "Better for latte", tone: "terracotta" },
      {
        name: "Communal Coffee",
        betterFor: "Better for groups",
        tone: "latte",
      },
    ],
    keywords: [
      "date",
      "outdoor",
      "patio",
      "chill",
      "aesthetic",
      "cute",
      "photos",
      "garden",
    ],
    baseScore: 8.4,
  },
  {
    id: "hearth",
    name: "Hearth Supply Co.",
    meta: "University Heights · 0.8 mi · Open late",
    tone: "latte",
    whyItMatches: [
      "Open late with a calmer back room.",
      "Dedicated parking lot behind the building.",
      "Corner tables suit long study sessions.",
    ],
    alternatives: [
      {
        name: "Marigold & Oak",
        betterFor: "Better for daytime quiet",
        tone: "latte",
      },
      { name: "Better Buzz", betterFor: "Better for parking", tone: "olive" },
      { name: "Mostra Coffee", betterFor: "Better for latte", tone: "terracotta" },
    ],
    keywords: [
      "open late",
      "late",
      "night",
      "work",
      "study",
      "parking",
      "outlets",
      "quiet",
    ],
    baseScore: 7.8,
  },
];

function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9]/g, ""))
    .filter((token) => token.length > 1);
}

export function runAiFinder(
  prompt: string,
  profile?: TasteProfile | null,
): AiFinderResult {
  const normalized = prompt.trim().toLowerCase();

  if (normalized.includes(UNAVAILABLE_TRIGGER)) {
    return { status: "unavailable" };
  }

  const promptTokens = tokenize(normalized);
  const profileTokens = profile
    ? tokenize(
        [...profile.cafeTypes, ...profile.priorities].join(" ").toLowerCase(),
      )
    : [];

  let best = aiCafes[0];
  let bestScore = -1;

  for (const cafe of aiCafes) {
    const searchable = cafe.keywords.join(" ");
    let score = cafe.baseScore / 100;

    for (const token of promptTokens) {
      if (searchable.includes(token)) {
        score += 2;
      }
    }

    for (const token of profileTokens) {
      if (searchable.includes(token)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = cafe;
    }
  }

  return { status: "match", match: best };
}
