import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPin, CafeMapPinTone } from "@/data/map-pins";

// Work session planner data layer (frame E3). Ranking is deterministic from
// the pin fixtures plus work-specific confidence data - no live AI or
// availability service (AI is deferred per decision 0013) - but it visibly
// responds to the selected needs so Find Work Spots feels real.

export type WorkNeed = "Wi-Fi" | "Outlets" | "Very quiet" | "Parking";

export const WORK_NEEDS: WorkNeed[] = [
  "Wi-Fi",
  "Outlets",
  "Very quiet",
  "Parking",
];

export const WORK_START_TIMES = ["8:00 AM", "9:00 AM", "10:00 AM"] as const;
export const WORK_END_TIMES = ["12:00 PM", "1:00 PM", "3:00 PM"] as const;

export type WorkSessionInputs = {
  start: string;
  end: string;
  needs: WorkNeed[];
};

export const DEFAULT_WORK_INPUTS: WorkSessionInputs = {
  start: "9:00 AM",
  end: "12:00 PM",
  needs: ["Wi-Fi", "Outlets", "Parking"],
};

// "9:00 AM" -> "9 AM" for the spoken session sentence.
function spokenTime(time: string): string {
  return time.replace(":00", "");
}

export function sessionSentence(inputs: WorkSessionInputs): string {
  return `"I need to work from ${spokenTime(inputs.start)} to ${spokenTime(inputs.end)}."`;
}

type WorkStatLevel = "positive" | "caution";

export type WorkSpotStat = {
  label: string;
  value: string;
  level: WorkStatLevel;
};

export type WorkSpotResult = {
  cafeId: string;
  name: string;
  meta: string;
  workScore: string;
  tone: CafeMapPinTone;
  stats: WorkSpotStat[];
  tip: string;
};

// Work-specific fixture data keyed by pin id: confidence stats and the
// arrival/parking tip line the planner surfaces on each card.
const WORK_PROFILES: Record<
  string,
  { stats: WorkSpotStat[]; tip: string; reason: string }
> = {
  marigold: {
    stats: [
      { label: "Wi-Fi", value: "Reliable", level: "positive" },
      { label: "Outlets", value: "Many", level: "positive" },
      { label: "Noise", value: "Low", level: "positive" },
    ],
    tip: "Arrive before 10 AM for a long table · street parking two blocks over.",
    reason: "strong work score, reliable outlets, low noise",
  },
  hearth: {
    stats: [
      { label: "Wi-Fi", value: "Good", level: "positive" },
      { label: "Outlets", value: "Many", level: "positive" },
      { label: "Noise", value: "Calm", level: "positive" },
    ],
    tip: "Easy street parking on Madison · calm until the lunch rush.",
    reason: "easiest parking, big tables, steady Wi-Fi",
  },
  mostra: {
    stats: [
      { label: "Wi-Fi", value: "Good", level: "positive" },
      { label: "Outlets", value: "Few", level: "caution" },
      { label: "Noise", value: "Lively", level: "caution" },
    ],
    tip: "Best for a short focused block · gets busy after 10 AM.",
    reason: "good coffee, but outlets run out",
  },
};

// Pin needs that satisfy each selectable work need. "Very quiet" is judged from
// the pin's noise mood score instead of a need tag.
const NEED_TAGS: Record<Exclude<WorkNeed, "Very quiet">, string> = {
  "Wi-Fi": "Wi-Fi",
  Outlets: "Outlets",
  Parking: "Parking",
};

const QUIET_NOISE_CEILING = 4;
// Met needs push a spot up, unmet needs push it down, so the ranking visibly
// answers the selected constraints (e.g. dropping Parking promotes Marigold
// over Hearth).
const NEED_WEIGHT = 0.6;

// Pin-based so the fixture ranking and the live-cafe ranking (US-036,
// utils/planner-cafes) score candidates identically.
export function meetsNeed(pin: CafeMapPin, need: WorkNeed): boolean {
  if (need === "Very quiet") {
    return pin.moodScores.noise <= QUIET_NOISE_CEILING;
  }

  return pin.needs.includes(NEED_TAGS[need] as (typeof pin.needs)[number]);
}

// Shared ranking: work score adjusted by how many selected needs the pin meets.
export function workRank(pin: CafeMapPin, needs: WorkNeed[]): number {
  const needAdjust = needs.reduce(
    (total, need) => total + (meetsNeed(pin, need) ? NEED_WEIGHT : -NEED_WEIGHT),
    0,
  );

  return pin.moodScores.work + needAdjust;
}

export type WorkSpotsPlan = {
  bestReason: string;
  results: WorkSpotResult[];
};

export function findWorkSpots(inputs: WorkSessionInputs): WorkSpotsPlan {
  const ranked = Object.keys(WORK_PROFILES)
    .map((cafeId) => {
      const pin = cafeMapPins.find((candidate) => candidate.id === cafeId);

      if (!pin) {
        return null;
      }

      return {
        pin,
        profile: WORK_PROFILES[cafeId],
        rank: workRank(pin, inputs.needs),
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.rank - a.rank);

  const results = ranked.map(({ pin, profile }) => ({
    cafeId: pin.id,
    name: pin.name,
    meta: pin.meta,
    workScore: pin.moodScores.work.toFixed(1),
    tone: pin.tone,
    stats: profile.stats,
    tip: profile.tip,
  }));

  const best = ranked[0];

  return {
    bestReason: `Best overall: ${best.pin.name} — ${best.profile.reason}.`,
    results,
  };
}
