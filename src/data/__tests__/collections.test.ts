import {
  collectionSwatch,
  DEFAULT_COLLECTIONS,
  SAVE_NOTE_PLACEHOLDER,
  SUGGESTED_COLLECTION_NAMES,
  toneForIndex,
} from "@/data/collections";

describe("collections data", () => {
  it("carries the six default collections from cafe-detail.md", () => {
    expect(DEFAULT_COLLECTIONS.map((collection) => collection.name)).toEqual([
      "Want to Try",
      "Work Spots",
      "Date Spots",
      "Aesthetic",
      "Best Latte",
      "Hidden Gems",
    ]);
  });

  it("keeps default collection ids unique and slug-shaped", () => {
    const ids = DEFAULT_COLLECTIONS.map((collection) => collection.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("exposes the D4 suggested names and the private-note placeholder", () => {
    expect(SUGGESTED_COLLECTION_NAMES).toEqual([
      "Cute Date Cafes",
      "Work Spots",
      "Matcha Places",
      "Weekend Finds",
    ]);
    expect(SAVE_NOTE_PLACEHOLDER).toBe("Try on a weekday morning.");
  });

  it("maps every default tone to a swatch color", () => {
    for (const collection of DEFAULT_COLLECTIONS) {
      expect(collectionSwatch[collection.tone]).toBeTruthy();
    }
  });

  it("rotates tones deterministically for created collections", () => {
    expect(toneForIndex(0)).toBe("terracotta");
    expect(toneForIndex(6)).toBe(toneForIndex(2));
  });
});
