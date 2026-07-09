import { theme } from "@/constants/theme";

export type CollectionTone = "terracotta" | "olive" | "latte" | "roasted";

export type DefaultCollection = {
  id: string;
  name: string;
  tone: CollectionTone;
};

// Default collections per cafe-detail.md / frame D1. Ids are stable slugs so
// persisted saves survive across sessions.
export const DEFAULT_COLLECTIONS: DefaultCollection[] = [
  { id: "want-to-try", name: "Want to Try", tone: "terracotta" },
  { id: "work-spots", name: "Work Spots", tone: "olive" },
  { id: "date-spots", name: "Date Spots", tone: "roasted" },
  { id: "aesthetic", name: "Aesthetic", tone: "latte" },
  { id: "best-latte", name: "Best Latte", tone: "terracotta" },
  { id: "hidden-gems", name: "Hidden Gems", tone: "olive" },
];

// D4 create-collection suggested names (from the missing-screens handoff).
export const SUGGESTED_COLLECTION_NAMES = [
  "Cute Date Cafes",
  "Work Spots",
  "Matcha Places",
  "Weekend Finds",
] as const;

export const SAVE_NOTE_PLACEHOLDER = "Try on a weekday morning.";
export const CREATE_NAME_PLACEHOLDER = "Name this collection";
export const CREATE_DESCRIPTION_PLACEHOLDER =
  "Patios, window light, shareable desserts…";

export const collectionSwatch: Record<CollectionTone, string> = {
  terracotta: theme.colors.brand.terracotta,
  olive: theme.colors.brand.oliveMatcha,
  latte: theme.colors.brand.latteBeige,
  roasted: theme.colors.brand.roastedBrown,
};

const collectionTones: CollectionTone[] = [
  "terracotta",
  "olive",
  "roasted",
  "latte",
];

// Rotates through the tone palette so user-created collections get a swatch
// without asking the user to pick a color.
export function toneForIndex(index: number): CollectionTone {
  return collectionTones[index % collectionTones.length];
}
