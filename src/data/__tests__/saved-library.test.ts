import {
  SAVED_EMPTY_CTA,
  SAVED_EMPTY_TITLE,
  SAVED_VIEW_MODES,
  VISITED_TAB_ID,
  demoSavedState,
  libraryEntries,
  libraryTabs,
  totalSavedCount,
} from "@/data/saved-library";
import { getSavedState, resetSavedStore } from "@/utils/saved-store";

beforeEach(() => {
  localStorage.clear();
  resetSavedStore();
});

describe("library tabs", () => {
  it("exposes the D2 contract tabs from the live collections plus Visited", () => {
    const tabs = libraryTabs(getSavedState());
    const names = tabs.map((tab) => tab.name);

    for (const required of [
      "Want to Try",
      "Work Spots",
      "Date Spots",
      "Aesthetic",
      "Visited",
    ]) {
      expect(names).toContain(required);
    }

    expect(tabs[tabs.length - 1].id).toBe(VISITED_TAB_ID);
  });

  it("exposes the three view modes and the empty-state contract copy", () => {
    expect(SAVED_VIEW_MODES).toEqual(["Map", "Grid", "List"]);
    expect(SAVED_EMPTY_TITLE).toBe("Your coffee map is empty.");
    expect(SAVED_EMPTY_CTA).toBe("Explore Cafés");
  });
});

describe("library entries", () => {
  it("joins demo saves against the pin fixtures per collection", () => {
    const state = demoSavedState(getSavedState());

    const wantToTry = libraryEntries(state, "want-to-try");
    expect(wantToTry.map((entry) => entry.cafeId).sort()).toEqual([
      "mostra",
      "terrace",
    ]);

    const mostra = wantToTry.find((entry) => entry.cafeId === "mostra");
    expect(mostra?.name).toBe("Mostra Coffee");
    expect(mostra?.meta).toBe("North Park · 0.3 mi");
    expect(mostra?.score).toBe("9.1");
    expect(mostra?.tags).toContain("Aesthetic");
    expect(mostra?.collectionLabel).toBe("Want to Try");
    expect(mostra?.note).toBe("Try the horchata latte.");

    const workSpots = libraryEntries(state, "work-spots");
    expect(workSpots.map((entry) => entry.cafeId).sort()).toEqual([
      "hearth",
      "marigold",
    ]);
  });

  it("keeps the visited tab empty until visit history exists", () => {
    const state = demoSavedState(getSavedState());

    expect(libraryEntries(state, VISITED_TAB_ID)).toEqual([]);
  });

  it("counts saves across the whole library", () => {
    expect(totalSavedCount(getSavedState())).toBe(0);
    expect(totalSavedCount(demoSavedState(getSavedState()))).toBe(4);
  });

  it("skips saves whose cafe has no pin fixture", () => {
    const state = demoSavedState(getSavedState());
    state.saves["ghost-cafe"] = { collectionIds: ["want-to-try"], note: "" };

    const entries = libraryEntries(state, "want-to-try");
    expect(entries.map((entry) => entry.cafeId)).not.toContain("ghost-cafe");
  });
});
