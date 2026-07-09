import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";
import type { SavedState } from "@/utils/saved-store";
import type { TasteProfile } from "@/utils/taste-profile";

// Taste profile view data (frame G1). Derived stats, visit history, and
// recommendation persistence are future data-model work (library-profile.md),
// so the stat bar keeps the product-doc example set while everything that can
// be derived locally (save counts, neighborhoods, onboarding answers) is live.

export type TasteStatTone = CafeMapPinTone | "roasted";

export type TasteStat = {
  pct: number;
  label: string;
  tone: TasteStatTone;
};

// Product-doc example set: 42% Work-friendly, 28% Aesthetic, 18% Specialty
// Coffee, 12% Outdoor.
export const TASTE_STATS: TasteStat[] = [
  { pct: 42, label: "Work-friendly", tone: "roasted" },
  { pct: 28, label: "Aesthetic", tone: "terracotta" },
  { pct: 18, label: "Specialty Coffee", tone: "latte" },
  { pct: 12, label: "Outdoor", tone: "olive" },
];

export function tasteSubtitle(savedCount: number): string {
  if (savedCount === 0) {
    return "Built from your taste answers — save cafés to sharpen it";
  }

  return `Built from ${savedCount} ${savedCount === 1 ? "save" : "saves"} and your taste answers`;
}

// G1 default chips, shown until onboarding answers exist.
export const DEFAULT_FAVORITE_VIBES = [
  "Quiet mornings",
  "Window light",
  "Oak tables",
  "Patios",
  "Good latte",
];

const CAFE_TYPE_VIBES: Record<string, string> = {
  "Work / Study": "Oak tables",
  Aesthetic: "Window light",
  "Date Spot": "Golden hour",
  Quiet: "Quiet mornings",
  Outdoor: "Patios",
  "Specialty Coffee": "Single origin pours",
};

const PRIORITY_VIBES: Record<string, string> = {
  "Wi-Fi": "Reliable Wi-Fi",
  Outlets: "Outlets everywhere",
  Parking: "Easy parking",
  "Low noise": "Quiet mornings",
  "Good latte": "Good latte",
  "Photo spots": "Window light",
};

// Onboarding answers (US-007) translate into vibe chips; without answers the
// G1 defaults render so the screen never looks empty.
export function favoriteVibes(profile: TasteProfile | null): string[] {
  if (!profile || profile.skipped) {
    return DEFAULT_FAVORITE_VIBES;
  }

  const derived = [
    ...profile.cafeTypes.map((type) => CAFE_TYPE_VIBES[type]),
    ...profile.priorities.map((priority) => PRIORITY_VIBES[priority]),
  ].filter((vibe): vibe is string => typeof vibe === "string");
  const unique = [...new Set(derived)];

  return unique.length > 0 ? unique.slice(0, 6) : DEFAULT_FAVORITE_VIBES;
}

export type FavoriteNeighborhood = {
  name: string;
  meta: string;
};

export const NEIGHBORHOODS_EMPTY_COPY =
  "Save cafés to see your neighborhoods here.";

// Live derivation from the saved store: neighborhood = pin meta prefix.
export function favoriteNeighborhoods(
  state: SavedState,
): FavoriteNeighborhood[] {
  const counts = new Map<string, number>();

  for (const cafeId of Object.keys(state.saves)) {
    const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);

    if (!pin) {
      continue;
    }

    const neighborhood = pin.meta.split(" · ")[0];
    counts.set(neighborhood, (counts.get(neighborhood) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      meta: `${count} ${count === 1 ? "café" : "cafés"} saved`,
    }));
}

export type RecentVisit = {
  cafeId: string;
  name: string;
  tone: CafeMapPinTone;
};

// Visit history is future data-model work; these are the G1 demo thumbs.
export const RECENT_VISITS: RecentVisit[] = [
  { cafeId: "mostra", name: "Mostra Coffee", tone: "terracotta" },
  { cafeId: "marigold", name: "Marigold & Oak", tone: "latte" },
  { cafeId: "terrace", name: "Terrace & Thistle", tone: "olive" },
];

// Static recommendation per decision 0013 (no client-side AI).
export const TASTE_RECOMMENDATION =
  "Based on your taste: you'd probably love Golden Hour Coffee in La Jolla — work-friendly with a strong aesthetic score.";
