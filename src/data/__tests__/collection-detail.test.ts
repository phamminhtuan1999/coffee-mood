import {
  COLLECTION_EMPTY_COPY,
  getCollectionDetail,
} from "@/data/collection-detail";
import { demoSavedState } from "@/data/saved-library";
import {
  getSavedState,
  resetSavedStore,
  saveCafe,
  updateCollection,
} from "@/utils/saved-store";

beforeEach(() => {
  localStorage.clear();
  resetSavedStore();
});

describe("getCollectionDetail", () => {
  it("returns undefined for unknown collections", () => {
    expect(getCollectionDetail(getSavedState(), "ghost")).toBeUndefined();
  });

  it("composes the curated guide from ordered member cafes", () => {
    saveCafe("marigold", {
      collectionIds: ["work-spots"],
      note: "Corner table by the window.",
    });
    saveCafe("hearth", { collectionIds: ["work-spots"], note: "" });
    updateCollection("work-spots", { cafeOrder: ["hearth", "marigold"] });

    const detail = getCollectionDetail(getSavedState(), "work-spots");

    expect(detail?.count).toBe(2);
    expect(detail?.countLabel).toBe("2 cafés · curated by you");
    expect(detail?.cafes.map((cafe) => cafe.cafeId)).toEqual([
      "hearth",
      "marigold",
    ]);
    expect(detail?.cafes[1].note).toBe("Corner table by the window.");
    expect(detail?.cafes[1].score).toBe("8.9");
  });

  it("pads cover tones for sparse collections", () => {
    const detail = getCollectionDetail(getSavedState(), "want-to-try");

    expect(detail?.count).toBe(0);
    expect(detail?.countLabel).toBe("0 cafés · curated by you");
    expect(detail?.coverTones).toHaveLength(3);
    expect(COLLECTION_EMPTY_COPY).toContain("No cafés in this collection yet");
  });

  it("reads the demo library for QA smoke", () => {
    const detail = getCollectionDetail(
      demoSavedState(getSavedState()),
      "want-to-try",
    );

    expect(detail?.count).toBe(2);
    expect(detail?.cafes.map((cafe) => cafe.name).sort()).toEqual([
      "Mostra Coffee",
      "Terrace & Thistle",
    ]);
  });
});
