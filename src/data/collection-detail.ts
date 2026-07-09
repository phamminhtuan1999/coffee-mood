import { cafeMapPins } from "@/data/map-pins";
import type { CafeMapPinTone } from "@/data/map-pins";
import { orderedCollectionCafeIds } from "@/utils/saved-store";
import type { Collection, SavedState } from "@/utils/saved-store";

// Collection detail data layer (frames D3 + D5). Composes the curated-guide
// view from the live saved store (decision 0014) joined against the pin
// fixtures, honoring the collection's explicit cafe order.

export type CollectionCafe = {
  cafeId: string;
  name: string;
  meta: string;
  score: string;
  tone: CafeMapPinTone;
  note: string;
};

export type CollectionDetail = {
  collection: Collection;
  count: number;
  countLabel: string;
  cafes: CollectionCafe[];
  coverTones: CafeMapPinTone[];
};

export function getCollectionDetail(
  state: SavedState,
  collectionId: string,
): CollectionDetail | undefined {
  const collection = state.collections.find(
    (candidate) => candidate.id === collectionId,
  );

  if (!collection) {
    return undefined;
  }

  const cafes = orderedCollectionCafeIds(state, collectionId).flatMap(
    (cafeId) => {
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
          tone: pin.tone,
          note: state.saves[cafeId]?.note ?? "",
        },
      ];
    },
  );

  return {
    collection,
    count: cafes.length,
    countLabel: `${cafes.length} ${cafes.length === 1 ? "café" : "cafés"} · curated by you`,
    cafes,
    // D3 cover collage: up to three tones from the member cafes; pad from the
    // collection's own tone so an empty collection still gets a cover.
    coverTones: [
      cafes[0]?.tone ?? "latte",
      cafes[1]?.tone ?? "olive",
      cafes[2]?.tone ?? "terracotta",
    ],
  };
}

export const COLLECTION_EMPTY_COPY =
  "No cafés in this collection yet. Save one from the map to start the guide.";
export const EDIT_REORDER_EYEBROW = "Cafés · reorder or remove";
