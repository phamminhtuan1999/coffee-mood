import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";
import type { SavedState } from "@/utils/saved-store";

// Saved cafes library data layer (frame D2). The library is a live view over
// the persisted saved store (decision 0014) joined against the pin fixtures,
// so saves made anywhere in the app show up here immediately.

export type SavedViewMode = "Map" | "Grid" | "List";

export const SAVED_VIEW_MODES: SavedViewMode[] = ["Map", "Grid", "List"];

// Visit history is future data-model work (see library-profile.md), so the
// Visited tab exists per the product contract but always resolves empty.
export const VISITED_TAB_ID = "visited";

export type LibraryTab = {
  id: string;
  name: string;
};

export function libraryTabs(state: SavedState): LibraryTab[] {
  return [
    ...state.collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
    })),
    { id: VISITED_TAB_ID, name: "Visited" },
  ];
}

export type LibraryEntry = {
  cafeId: string;
  name: string;
  meta: string;
  score: string;
  tags: string[];
  tone: CafeMapPinTone;
  collectionId: string;
  collectionLabel: string;
  note: string;
};

export function libraryEntries(
  state: SavedState,
  tabId: string,
): LibraryEntry[] {
  if (tabId === VISITED_TAB_ID) {
    return [];
  }

  const collectionName =
    state.collections.find((collection) => collection.id === tabId)?.name ??
    "Saved";

  return Object.entries(state.saves)
    .filter(([, save]) => save.collectionIds.includes(tabId))
    .flatMap(([cafeId, save]) => {
      const pin = cafeMapPins.find((cafe) => cafe.id === cafeId);

      if (!pin) {
        return [];
      }

      return [
        {
          cafeId: pin.id,
          name: pin.name,
          meta: pin.meta,
          score: pin.score,
          tags: pin.tags,
          tone: pin.tone,
          collectionId: tabId,
          collectionLabel: collectionName,
          note: save.note,
        },
      ];
    });
}

export function totalSavedCount(state: SavedState): number {
  return Object.keys(state.saves).length;
}

export const SAVED_EMPTY_TITLE = "Your coffee map is empty.";
export const SAVED_EMPTY_COPY =
  "Save a café you like and it shows up here — your personal coffee map.";
export const SAVED_EMPTY_CTA = "Explore Cafés";
export const SAVED_TAB_EMPTY_COPY = "Nothing in this collection yet.";
export const VISITED_EMPTY_COPY =
  "Check in at a café and it lands here. Visit history is on its way.";

// Fixed pin spots for the D2 map view, cycled per entry so any number of
// saves lays out without a real map provider (decision 0010).
export const SAVED_MAP_PIN_SPOTS = [
  { top: 70, left: 60 },
  { top: 180, left: 200 },
  { top: 300, left: 100 },
  { top: 120, left: 280 },
  { top: 250, left: 250 },
  { top: 350, left: 190 },
] as const;

// Demo library used by the ?state=demo QA override and tests: a populated
// in-memory snapshot that never touches the persisted store.
export function demoSavedState(base: SavedState): SavedState {
  return {
    collections: base.collections,
    saves: {
      mostra: {
        collectionIds: ["want-to-try", "aesthetic"],
        note: "Try the horchata latte.",
      },
      marigold: {
        collectionIds: ["work-spots"],
        note: "Corner table by the window.",
      },
      terrace: {
        collectionIds: ["date-spots", "want-to-try"],
        note: "",
      },
      hearth: {
        collectionIds: ["work-spots"],
        note: "Best after 3pm on weekdays.",
      },
    },
  };
}
