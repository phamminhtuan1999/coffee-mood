import type { CafeMapPinTone } from "@/data/map-pins";

// Date plan data layer (frame E4). The plan is chosen deterministically by
// mood over pin-backed date profiles - no live AI (deferred per decision 0013)
// - and Shuffle rotates through the other profiles so the plan stays fresh
// without randomness. Copy keeps the "subtle romantic energy, no cheesy
// hearts" contract from planning.md.

export type DateMood = "Cozy" | "Aesthetic" | "Quiet" | "Fun" | "Outdoor";

export const DATE_MOODS: DateMood[] = [
  "Cozy",
  "Aesthetic",
  "Quiet",
  "Fun",
  "Outdoor",
];

export const DATE_AREAS = ["South Park", "North Park", "La Jolla"] as const;
export const DATE_TIMES = ["Golden hour", "Morning", "Afternoon"] as const;
export const DATE_BUDGETS = ["$$", "$", "$$$"] as const;

export type DatePlanInputs = {
  area: string;
  time: string;
  budget: string;
  mood: DateMood;
};

export const DEFAULT_DATE_INPUTS: DatePlanInputs = {
  area: "South Park",
  time: "Golden hour",
  budget: "$$",
  mood: "Outdoor",
};

export type DatePlanStep = {
  title: string;
  detail: string;
};

export type DatePlan = {
  cafeId: string;
  name: string;
  meta: string;
  tone: CafeMapPinTone;
  steps: DatePlanStep[];
  tip: string;
};

// Each profile is a full evening arc: the cafe, three steps (always including
// a dessert or walking stop per planning.md), and a best-time vibe tip.
const DATE_PROFILES: Record<string, DatePlan> = {
  terrace: {
    cafeId: "terrace",
    name: "Terrace & Thistle",
    meta: "Patio café · South Park · $$$",
    tone: "olive",
    steps: [
      {
        title: "Meet at Terrace & Thistle",
        detail: "Corner patio table under the plants — order at the counter.",
      },
      {
        title: "Split a dessert",
        detail: "The olive-oil cake pairs with the matcha.",
      },
      {
        title: "Golden-hour walk",
        detail: "Loop the block to Juniper Street as the light goes soft.",
      },
    ],
    tip: "Golden hour hits the patio at 4:40. Order the lavender latte — it photographs well and tastes better.",
  },
  mostra: {
    cafeId: "mostra",
    name: "Mostra Coffee",
    meta: "Cozy corner café · North Park · $$",
    tone: "terracotta",
    steps: [
      {
        title: "Meet at Mostra Coffee",
        detail: "Front window seats catch the morning light.",
      },
      {
        title: "Horchata lattes for two",
        detail: "The signature pour — sweet without trying too hard.",
      },
      {
        title: "Photo stroll",
        detail: "Two blocks of murals on Ray Street to keep it easy.",
      },
    ],
    tip: "Soft window light until 10 AM. The front-window seats are the best in the room — arrive before the rush.",
  },
  marigold: {
    cafeId: "marigold",
    name: "Marigold & Oak",
    meta: "Quiet café · North Park · $$",
    tone: "latte",
    steps: [
      {
        title: "Meet at Marigold & Oak",
        detail: "Back corner table — low music, no rush.",
      },
      {
        title: "Slow pour-over flight",
        detail: "One to share, poured in courses.",
      },
      {
        title: "Bookstore next door",
        detail: "Browse the stacks while the conversation settles.",
      },
    ],
    tip: "Quiet from open to noon. The pour-over flight is made for long conversations.",
  },
};

// The mood decides which profile leads; Shuffle rotates through the rest.
const MOOD_PRIMARY: Record<DateMood, string> = {
  Cozy: "mostra",
  Aesthetic: "mostra",
  Quiet: "marigold",
  Fun: "terrace",
  Outdoor: "terrace",
};

const ROTATION = ["terrace", "mostra", "marigold"];

export function createDatePlan(inputs: DatePlanInputs, variant = 0): DatePlan {
  const primary = MOOD_PRIMARY[inputs.mood];
  const start = ROTATION.indexOf(primary);
  const cafeId = ROTATION[(start + variant) % ROTATION.length];

  return DATE_PROFILES[cafeId];
}
