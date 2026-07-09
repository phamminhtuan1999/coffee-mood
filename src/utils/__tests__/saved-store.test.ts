// localStorage is an in-memory shim from jest-setup.ts; the expo-sqlite
// install polyfill is stubbed via jest.moduleNameMapper.
import { DEFAULT_COLLECTIONS } from "@/data/collections";
import {
  collectionSaveCount,
  createCollection,
  getCafeSave,
  getSavedState,
  isCafeSaved,
  quickToggleSave,
  removeCafeSave,
  resetSavedStore,
  saveCafe,
} from "@/utils/saved-store";

beforeEach(() => {
  localStorage.clear();
  resetSavedStore();
});

describe("saved store seeding", () => {
  it("seeds the six default collections", () => {
    const state = getSavedState();

    expect(state.collections).toHaveLength(DEFAULT_COLLECTIONS.length);
    expect(state.collections.map((collection) => collection.name)).toEqual([
      "Want to Try",
      "Work Spots",
      "Date Spots",
      "Aesthetic",
      "Best Latte",
      "Hidden Gems",
    ]);
    expect(state.collections.every((collection) => collection.seeded)).toBe(
      true,
    );
    expect(state.saves).toEqual({});
  });
});

describe("saving cafes", () => {
  it("saves a cafe to collections with a trimmed private note", () => {
    saveCafe("mostra", {
      collectionIds: ["want-to-try", "best-latte"],
      note: "  Weekday mornings  ",
    });

    const state = getSavedState();

    expect(isCafeSaved(state, "mostra")).toBe(true);
    expect(getCafeSave(state, "mostra")).toEqual({
      collectionIds: ["want-to-try", "best-latte"],
      note: "Weekday mornings",
    });
    expect(collectionSaveCount(state, "want-to-try")).toBe(1);
    expect(collectionSaveCount(state, "best-latte")).toBe(1);
    expect(collectionSaveCount(state, "work-spots")).toBe(0);
  });

  it("returns a stable snapshot reference between reads", () => {
    expect(getSavedState()).toBe(getSavedState());

    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });

    const afterSave = getSavedState();

    expect(getSavedState()).toBe(afterSave);
  });

  it("drops unknown collection ids and unsaves when none remain", () => {
    saveCafe("mostra", {
      collectionIds: ["not-real", "want-to-try"],
      note: "",
    });

    expect(getCafeSave(getSavedState(), "mostra")?.collectionIds).toEqual([
      "want-to-try",
    ]);

    saveCafe("mostra", { collectionIds: ["not-real"], note: "" });

    expect(isCafeSaved(getSavedState(), "mostra")).toBe(false);
  });

  it("removes a save", () => {
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });
    removeCafeSave("mostra");

    expect(isCafeSaved(getSavedState(), "mostra")).toBe(false);
  });

  it("quick-toggles into the first default collection and back", () => {
    quickToggleSave("terrace");

    expect(getCafeSave(getSavedState(), "terrace")?.collectionIds).toEqual([
      "want-to-try",
    ]);

    quickToggleSave("terrace");

    expect(isCafeSaved(getSavedState(), "terrace")).toBe(false);
  });
});

describe("creating collections", () => {
  it("creates a collection with a slug id and appends it", () => {
    const created = createCollection({
      name: "Cute Date Cafes",
      description: "  Patios and light  ",
      privacy: "public",
    });

    expect(created.id).toBe("cute-date-cafes");
    expect(created.name).toBe("Cute Date Cafes");
    expect(created.description).toBe("Patios and light");
    expect(created.privacy).toBe("public");
    expect(created.seeded).toBe(false);

    const state = getSavedState();

    expect(state.collections).toHaveLength(DEFAULT_COLLECTIONS.length + 1);
    expect(state.collections.at(-1)?.id).toBe("cute-date-cafes");
  });

  it("disambiguates colliding slugs", () => {
    const first = createCollection({ name: "Work Spots" });
    const second = createCollection({ name: "Work Spots" });

    // "work-spots" is already a seeded id, so both creations get suffixes.
    expect(first.id).toBe("work-spots-2");
    expect(second.id).toBe("work-spots-3");
  });

  it("defaults privacy to private and description to empty", () => {
    const created = createCollection({ name: "Weekend Finds" });

    expect(created.privacy).toBe("private");
    expect(created.description).toBe("");
  });
});

describe("persistence", () => {
  it("round-trips saved cafes and created collections across a reload", () => {
    createCollection({ name: "Matcha Places" });
    saveCafe("mostra", {
      collectionIds: ["matcha-places", "aesthetic"],
      note: "Order the spritz",
    });

    // Simulate a fresh app launch: keep what was persisted, drop the module
    // cache, and let the next read reparse localStorage.
    const persisted = localStorage.getItem("cafemood.saved.v1");
    resetSavedStore();
    localStorage.setItem("cafemood.saved.v1", persisted ?? "");

    const reloaded = getSavedState();

    expect(
      reloaded.collections.some(
        (collection) => collection.id === "matcha-places",
      ),
    ).toBe(true);
    expect(getCafeSave(reloaded, "mostra")).toEqual({
      collectionIds: ["matcha-places", "aesthetic"],
      note: "Order the spritz",
    });
  });

  it("recovers from corrupt stored data by reseeding", () => {
    localStorage.setItem("cafemood.saved.v1", "{not json");
    resetSavedStore();

    const state = getSavedState();

    expect(state.collections).toHaveLength(DEFAULT_COLLECTIONS.length);
    expect(state.saves).toEqual({});
  });

  it("discards saves that reference deleted collections on load", () => {
    localStorage.setItem(
      "cafemood.saved.v1",
      JSON.stringify({
        collections: [],
        saves: { mostra: { collectionIds: ["ghost"], note: "x" } },
      }),
    );
    resetSavedStore();

    expect(isCafeSaved(getSavedState(), "mostra")).toBe(false);
  });
});
