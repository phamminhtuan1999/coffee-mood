import { demoSavedState } from "@/data/saved-library";
import {
  DEFAULT_FAVORITE_VIBES,
  RECENT_VISITS,
  TASTE_RECOMMENDATION,
  TASTE_STATS,
  favoriteNeighborhoods,
  favoriteVibes,
  tasteSubtitle,
} from "@/data/taste-profile-view";
import { getSavedState, resetSavedStore, saveCafe } from "@/utils/saved-store";
import type { TasteProfile } from "@/utils/taste-profile";

function profile(overrides: Partial<TasteProfile> = {}): TasteProfile {
  return {
    cafeTypes: [],
    priorities: [],
    distance: "10 min",
    price: "$$",
    skipped: false,
    updatedAt: "2026-07-09T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  resetSavedStore();
});

describe("taste stats contract", () => {
  it("keeps the product-doc example set", () => {
    expect(TASTE_STATS.map((stat) => [stat.pct, stat.label])).toEqual([
      [42, "Work-friendly"],
      [28, "Aesthetic"],
      [18, "Specialty Coffee"],
      [12, "Outdoor"],
    ]);
    expect(TASTE_STATS.reduce((total, stat) => total + stat.pct, 0)).toBe(100);
  });

  it("speaks the save count in the subtitle", () => {
    expect(tasteSubtitle(0)).toBe(
      "Built from your taste answers — save cafés to sharpen it",
    );
    expect(tasteSubtitle(1)).toBe("Built from 1 save and your taste answers");
    expect(tasteSubtitle(26)).toBe(
      "Built from 26 saves and your taste answers",
    );
  });
});

describe("favorite vibes", () => {
  it("falls back to the G1 defaults without onboarding answers", () => {
    expect(favoriteVibes(null)).toEqual(DEFAULT_FAVORITE_VIBES);
    expect(favoriteVibes(profile({ skipped: true }))).toEqual(
      DEFAULT_FAVORITE_VIBES,
    );
    expect(favoriteVibes(profile())).toEqual(DEFAULT_FAVORITE_VIBES);
  });

  it("derives deduped chips from onboarding answers", () => {
    const vibes = favoriteVibes(
      profile({
        cafeTypes: ["Quiet", "Outdoor"],
        priorities: ["Low noise", "Wi-Fi", "Good latte"],
      }),
    );

    expect(vibes).toEqual([
      "Quiet mornings",
      "Patios",
      "Reliable Wi-Fi",
      "Good latte",
    ]);
  });
});

describe("favorite neighborhoods", () => {
  it("derives ranked neighborhoods from live saves", () => {
    saveCafe("mostra", { collectionIds: ["want-to-try"], note: "" });
    saveCafe("marigold", { collectionIds: ["want-to-try"], note: "" });
    saveCafe("terrace", { collectionIds: ["date-spots"], note: "" });

    expect(favoriteNeighborhoods(getSavedState())).toEqual([
      { name: "North Park", meta: "2 cafés saved" },
      { name: "South Park", meta: "1 café saved" },
    ]);
  });

  it("returns nothing without saves and reads the demo library", () => {
    expect(favoriteNeighborhoods(getSavedState())).toEqual([]);

    const demo = favoriteNeighborhoods(demoSavedState(getSavedState()));
    expect(demo[0]).toEqual({ name: "North Park", meta: "2 cafés saved" });
    expect(demo).toHaveLength(3);
  });
});

describe("fixture sections", () => {
  it("keeps the G1 recent visits and static recommendation", () => {
    expect(RECENT_VISITS.map((visit) => visit.name)).toEqual([
      "Mostra Coffee",
      "Marigold & Oak",
      "Terrace & Thistle",
    ]);
    expect(TASTE_RECOMMENDATION).toContain("Golden Hour Coffee");
  });
});
