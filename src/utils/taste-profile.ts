import "expo-sqlite/localStorage/install";

const TASTE_PROFILE_KEY = "cafemood.taste-profile.v1";

export type CafeType =
  | "Work / Study"
  | "Aesthetic"
  | "Date Spot"
  | "Quiet"
  | "Outdoor"
  | "Specialty Coffee";

export type TastePriority =
  | "Wi-Fi"
  | "Outlets"
  | "Parking"
  | "Low noise"
  | "Good latte"
  | "Photo spots";

export type DistancePreference = "5 min" | "10 min" | "20 min" | "Anywhere";

export type PricePreference = "$" | "$$" | "$$$";

export type TasteProfile = {
  cafeTypes: CafeType[];
  priorities: TastePriority[];
  distance: DistancePreference;
  price: PricePreference;
  skipped: boolean;
  updatedAt: string;
};

export function loadTasteProfile(): TasteProfile | null {
  const stored = localStorage.getItem(TASTE_PROFILE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<TasteProfile>;

    if (!isDistancePreference(parsed.distance) || !isPricePreference(parsed.price)) {
      clearTasteProfile();
      return null;
    }

    return {
      cafeTypes: Array.isArray(parsed.cafeTypes)
        ? parsed.cafeTypes.filter(isCafeType)
        : [],
      priorities: Array.isArray(parsed.priorities)
        ? parsed.priorities.filter(isTastePriority)
        : [],
      distance: parsed.distance,
      price: parsed.price,
      skipped: parsed.skipped === true,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    clearTasteProfile();
    return null;
  }
}

export function saveTasteProfile(profile: TasteProfile): void {
  localStorage.setItem(TASTE_PROFILE_KEY, JSON.stringify(profile));
}

export function clearTasteProfile(): void {
  localStorage.removeItem(TASTE_PROFILE_KEY);
}

function isCafeType(value: unknown): value is CafeType {
  return (
    value === "Work / Study" ||
    value === "Aesthetic" ||
    value === "Date Spot" ||
    value === "Quiet" ||
    value === "Outdoor" ||
    value === "Specialty Coffee"
  );
}

function isTastePriority(value: unknown): value is TastePriority {
  return (
    value === "Wi-Fi" ||
    value === "Outlets" ||
    value === "Parking" ||
    value === "Low noise" ||
    value === "Good latte" ||
    value === "Photo spots"
  );
}

function isDistancePreference(value: unknown): value is DistancePreference {
  return (
    value === "5 min" ||
    value === "10 min" ||
    value === "20 min" ||
    value === "Anywhere"
  );
}

function isPricePreference(value: unknown): value is PricePreference {
  return value === "$" || value === "$$" || value === "$$$";
}
