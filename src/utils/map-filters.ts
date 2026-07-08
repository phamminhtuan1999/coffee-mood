import type { PricePreference } from "@/utils/taste-profile";

export const filterNeeds = [
  "Open now",
  "Parking",
  "Wi-Fi",
  "Outlets",
  "Outdoor seating",
  "Late night",
  "Good for groups",
] as const;

export type FilterNeed = (typeof filterNeeds)[number];

export const filterTreats = [
  "Specialty coffee",
  "Matcha",
  "Dessert",
  "Good for dates",
  "High rating",
] as const;

export type FilterTreat = (typeof filterTreats)[number];

export const DISTANCE_MIN = 5;
export const DISTANCE_MAX = 30;

const SCORE_MAX = 10;
const HIGH_RATING_THRESHOLD = 8.5;

export type MapFilters = {
  // Max walk minutes; DISTANCE_MAX means anywhere.
  distance: number;
  needs: FilterNeed[];
  // Minimum mood scores on a 0-10 scale; 0 means any.
  aesthetic: number;
  work: number;
  // Max tolerated noise on a 0-10 scale; 10 means any.
  noise: number;
  price: PricePreference | null;
  treats: FilterTreat[];
};

export type FilterableCafe = {
  score: string;
  walkMinutes: number;
  needs: FilterNeed[];
  moodScores: { aesthetic: number; work: number; noise: number };
  price: PricePreference;
  treats: FilterTreat[];
};

export function defaultMapFilters(): MapFilters {
  return {
    distance: DISTANCE_MAX,
    needs: [],
    aesthetic: 0,
    work: 0,
    noise: SCORE_MAX,
    price: null,
    treats: [],
  };
}

export function distanceLabel(distance: number): string {
  return distance >= DISTANCE_MAX ? "Anywhere" : `Within ${distance} min`;
}

export function scoreHint(minScore: number): string {
  return minScore <= 0 ? "any" : `${minScore.toFixed(1)}+`;
}

export function noiseHint(maxNoise: number): string {
  if (maxNoise >= SCORE_MAX) {
    return "any";
  }

  return maxNoise <= 3.5 ? "quiet-ish" : "moderate";
}

export function activeMapFilterCount(filters: MapFilters): number {
  return (
    filters.needs.length +
    filters.treats.length +
    (filters.price ? 1 : 0) +
    (filters.aesthetic > 0 ? 1 : 0) +
    (filters.work > 0 ? 1 : 0) +
    (filters.noise < SCORE_MAX ? 1 : 0) +
    (filters.distance < DISTANCE_MAX ? 1 : 0)
  );
}

function matchesTreat(cafe: FilterableCafe, treat: FilterTreat): boolean {
  if (treat === "High rating") {
    return Number.parseFloat(cafe.score) >= HIGH_RATING_THRESHOLD;
  }

  return cafe.treats.includes(treat);
}

export function applyMapFilters<T extends FilterableCafe>(
  cafes: T[],
  filters: MapFilters,
): T[] {
  return cafes.filter(
    (cafe) =>
      cafe.walkMinutes <= filters.distance &&
      filters.needs.every((need) => cafe.needs.includes(need)) &&
      cafe.moodScores.aesthetic >= filters.aesthetic &&
      cafe.moodScores.work >= filters.work &&
      cafe.moodScores.noise <= filters.noise &&
      (!filters.price || cafe.price === filters.price) &&
      filters.treats.every((treat) => matchesTreat(cafe, treat)),
  );
}

export function isFilterNeed(value: unknown): value is FilterNeed {
  return filterNeeds.includes(value as FilterNeed);
}

export function isFilterTreat(value: unknown): value is FilterTreat {
  return filterTreats.includes(value as FilterTreat);
}
