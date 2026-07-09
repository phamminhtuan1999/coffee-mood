import "expo-sqlite/localStorage/install";

import {
  DEFAULT_COLLECTIONS,
  toneForIndex,
} from "@/data/collections";
import type { CollectionTone } from "@/data/collections";

const SAVED_KEY = "cafemood.saved.v1";

export type CollectionPrivacy = "private" | "public";

export type Collection = {
  id: string;
  name: string;
  description: string;
  privacy: CollectionPrivacy;
  tone: CollectionTone;
  seeded: boolean;
  // Explicit cafe order for the collection detail screen (US-024). Cafes
  // missing from this list fall back to save-insertion order.
  cafeOrder: string[];
};

export type CafeSave = {
  collectionIds: string[];
  note: string;
};

export type SavedState = {
  collections: Collection[];
  saves: Record<string, CafeSave>;
};

let cached: SavedState | null = null;
const listeners = new Set<() => void>();

function seededCollections(): Collection[] {
  return DEFAULT_COLLECTIONS.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: "",
    privacy: "private",
    tone: collection.tone,
    seeded: true,
    cafeOrder: [],
  }));
}

function defaultState(): SavedState {
  return { collections: seededCollections(), saves: {} };
}

export function getSavedState(): SavedState {
  if (!cached) {
    cached = loadState();
  }

  return cached;
}

export function subscribeSaved(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function commit(next: SavedState): void {
  cached = next;
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

// Selectors are pure functions of a snapshot so callers can subscribe once via
// useSyncExternalStore and derive everything they render.
export function isCafeSaved(state: SavedState, cafeId: string): boolean {
  const save = state.saves[cafeId];

  return save !== undefined && save.collectionIds.length > 0;
}

export function getCafeSave(
  state: SavedState,
  cafeId: string,
): CafeSave | undefined {
  return state.saves[cafeId];
}

export function collectionSaveCount(
  state: SavedState,
  collectionId: string,
): number {
  return Object.values(state.saves).filter((save) =>
    save.collectionIds.includes(collectionId),
  ).length;
}

// Persists a cafe's collection membership and private note. Selecting no
// collections removes the save entirely, so the sheet can both save and unsave.
export function saveCafe(cafeId: string, save: CafeSave): void {
  const state = getSavedState();
  const collectionIds = save.collectionIds.filter((id) =>
    state.collections.some((collection) => collection.id === id),
  );

  if (collectionIds.length === 0) {
    removeCafeSave(cafeId);
    return;
  }

  const nextSaves = { ...state.saves };
  nextSaves[cafeId] = { collectionIds, note: save.note.trim() };

  commit({ ...state, saves: nextSaves });
}

// One-tap save used by the map preview heart: drops the cafe into the first
// default collection without opening the full sheet.
export function quickToggleSave(cafeId: string): void {
  const state = getSavedState();

  if (isCafeSaved(state, cafeId)) {
    removeCafeSave(cafeId);
    return;
  }

  saveCafe(cafeId, {
    collectionIds: [state.collections[0]?.id ?? DEFAULT_COLLECTIONS[0].id],
    note: "",
  });
}

export function removeCafeSave(cafeId: string): void {
  const state = getSavedState();

  if (!state.saves[cafeId]) {
    return;
  }

  const nextSaves = { ...state.saves };
  delete nextSaves[cafeId];

  commit({ ...state, saves: nextSaves });
}

export function createCollection(input: {
  name: string;
  description?: string;
  privacy?: CollectionPrivacy;
}): Collection {
  const state = getSavedState();
  const collection: Collection = {
    id: nextCollectionId(input.name, state.collections),
    name: input.name.trim(),
    description: (input.description ?? "").trim(),
    privacy: input.privacy ?? "private",
    tone: toneForIndex(state.collections.length),
    seeded: false,
    cafeOrder: [],
  };

  commit({ ...state, collections: [...state.collections, collection] });

  return collection;
}

export type CollectionPatch = Partial<
  Pick<Collection, "name" | "description" | "privacy" | "tone" | "cafeOrder">
>;

// Collection editing for the US-024 edit screen. Ignores empty names so a
// cleared field can never wipe a collection's identity.
export function updateCollection(
  collectionId: string,
  patch: CollectionPatch,
): void {
  const state = getSavedState();

  if (!state.collections.some((collection) => collection.id === collectionId)) {
    return;
  }

  const collections = state.collections.map((collection) => {
    if (collection.id !== collectionId) {
      return collection;
    }

    const name = patch.name?.trim();

    return {
      ...collection,
      name: name ? name : collection.name,
      description: patch.description?.trim() ?? collection.description,
      privacy: patch.privacy ?? collection.privacy,
      tone: patch.tone ?? collection.tone,
      cafeOrder: patch.cafeOrder ?? collection.cafeOrder,
    };
  });

  commit({ ...state, collections });
}

// Drops a cafe from one collection only; removing its last membership removes
// the save entirely (same semantics as the D1 sheet deselecting everything).
export function removeCafeFromCollection(
  collectionId: string,
  cafeId: string,
): void {
  const state = getSavedState();
  const save = state.saves[cafeId];

  if (!save || !save.collectionIds.includes(collectionId)) {
    return;
  }

  const collectionIds = save.collectionIds.filter((id) => id !== collectionId);
  const nextSaves = { ...state.saves };

  if (collectionIds.length === 0) {
    delete nextSaves[cafeId];
  } else {
    nextSaves[cafeId] = { ...save, collectionIds };
  }

  const collections = state.collections.map((collection) =>
    collection.id === collectionId
      ? {
          ...collection,
          cafeOrder: collection.cafeOrder.filter((id) => id !== cafeId),
        }
      : collection,
  );

  commit({ ...state, collections, saves: nextSaves });
}

// Ordered member ids for a collection: explicit cafeOrder entries that are
// still members first, then remaining members in save-insertion order.
export function orderedCollectionCafeIds(
  state: SavedState,
  collectionId: string,
): string[] {
  const members = Object.entries(state.saves)
    .filter(([, save]) => save.collectionIds.includes(collectionId))
    .map(([cafeId]) => cafeId);
  const order =
    state.collections.find((collection) => collection.id === collectionId)
      ?.cafeOrder ?? [];
  const ordered = order.filter((cafeId) => members.includes(cafeId));

  return [
    ...ordered,
    ...members.filter((cafeId) => !ordered.includes(cafeId)),
  ];
}

// Test-only reset so specs start from a clean seeded state.
export function resetSavedStore(): void {
  cached = null;
  localStorage.removeItem(SAVED_KEY);
}

// Test-only: drops the in-memory cache without touching persisted state so
// specs can simulate an app relaunch.
export function reloadSavedStore(): void {
  cached = null;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "collection"
  );
}

function nextCollectionId(name: string, existing: Collection[]): string {
  const base = slugify(name);
  const taken = new Set(existing.map((collection) => collection.id));

  if (!taken.has(base)) {
    return base;
  }

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}

function isPrivacy(value: unknown): value is CollectionPrivacy {
  return value === "private" || value === "public";
}

function parseCollections(value: unknown): Collection[] {
  const seeded = seededCollections();

  if (!Array.isArray(value)) {
    return seeded;
  }

  const byId = new Map(seeded.map((collection) => [collection.id, collection]));

  for (const raw of value) {
    if (typeof raw !== "object" || raw === null) {
      continue;
    }

    const candidate = raw as Partial<Collection>;

    if (typeof candidate.id !== "string" || typeof candidate.name !== "string") {
      continue;
    }

    const existing = byId.get(candidate.id);
    byId.set(candidate.id, {
      id: candidate.id,
      name: candidate.name,
      description:
        typeof candidate.description === "string" ? candidate.description : "",
      privacy: isPrivacy(candidate.privacy) ? candidate.privacy : "private",
      tone: (typeof candidate.tone === "string"
        ? (candidate.tone as CollectionTone)
        : (existing?.tone ?? "terracotta")) as CollectionTone,
      seeded: existing !== undefined,
      // Pre-US-024 state has no cafeOrder; default keeps legacy data valid.
      cafeOrder: Array.isArray(candidate.cafeOrder)
        ? candidate.cafeOrder.filter((id): id is string => typeof id === "string")
        : [],
    });
  }

  return Array.from(byId.values());
}

function parseSaves(
  value: unknown,
  collections: Collection[],
): Record<string, CafeSave> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const validIds = new Set(collections.map((collection) => collection.id));
  const result: Record<string, CafeSave> = {};

  for (const [cafeId, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw !== "object" || raw === null) {
      continue;
    }

    const candidate = raw as Partial<CafeSave>;
    const collectionIds = Array.isArray(candidate.collectionIds)
      ? candidate.collectionIds.filter(
          (id): id is string => typeof id === "string" && validIds.has(id),
        )
      : [];

    if (collectionIds.length === 0) {
      continue;
    }

    result[cafeId] = {
      collectionIds,
      note: typeof candidate.note === "string" ? candidate.note : "",
    };
  }

  return result;
}

function loadState(): SavedState {
  const stored = localStorage.getItem(SAVED_KEY);

  if (!stored) {
    return defaultState();
  }

  try {
    const parsed = JSON.parse(stored) as Partial<SavedState>;
    const collections = parseCollections(parsed.collections);

    return {
      collections,
      saves: parseSaves(parsed.saves, collections),
    };
  } catch {
    localStorage.removeItem(SAVED_KEY);
    return defaultState();
  }
}
