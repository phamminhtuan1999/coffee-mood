import { cafeMapPins } from "@/data/map-pins";
import { getReviewInsight } from "@/data/review-insights";

describe("review insights", () => {
  it("matches the C3 design reference for Mostra", () => {
    const insight = getReviewInsight("mostra");

    expect(insight?.reviewCount).toBe(480);
    expect(insight?.updatedNote).toBe("updated this week");
    expect(insight?.love).toEqual([
      { label: "Latte quality", pct: 92 },
      { label: "Interior design", pct: 88 },
      { label: "Friendly staff", pct: 81 },
    ]);
    expect(insight?.complaints).toEqual([
      { label: "Parking", pct: 46 },
      { label: "Crowded weekends", pct: 38 },
      { label: "Limited outlets", pct: 24 },
    ]);
    expect(insight?.bestFor).toEqual([
      "Quick coffee",
      "Casual meetup",
      "Photos",
    ]);
    expect(insight?.notIdealFor).toEqual([
      "Long work sessions",
      "Large groups",
    ]);
    expect(insight?.shortVersion).toContain("Park a block east on Ray St.");
  });

  it("keeps every insight well-formed and tied to a real cafe pin", () => {
    const pinIds = new Set(cafeMapPins.map((pin) => pin.id));

    for (const pin of cafeMapPins) {
      const insight = getReviewInsight(pin.id);

      if (!insight) {
        continue;
      }

      expect(pinIds.has(insight.cafeId)).toBe(true);
      expect(insight.cafeId).toBe(pin.id);
      expect(insight.reviewCount).toBeGreaterThan(0);
      expect(insight.love.length).toBeGreaterThan(0);
      expect(insight.complaints.length).toBeGreaterThan(0);
      expect(insight.bestFor.length).toBeGreaterThan(0);
      expect(insight.notIdealFor.length).toBeGreaterThan(0);
      expect(insight.shortVersion.length).toBeGreaterThan(0);

      for (const item of [...insight.love, ...insight.complaints]) {
        expect(item.pct).toBeGreaterThan(0);
        expect(item.pct).toBeLessThanOrEqual(100);
        expect(item.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("sorts love and complaint items by percentage descending", () => {
    for (const pin of cafeMapPins) {
      const insight = getReviewInsight(pin.id);

      for (const items of [insight?.love ?? [], insight?.complaints ?? []]) {
        const pcts = items.map((item) => item.pct);
        const sorted = [...pcts].sort((a, b) => b - a);

        expect(pcts).toEqual(sorted);
      }
    }
  });

  it("keeps the limited-data cafe without a review summary", () => {
    expect(getReviewInsight("hearth")).toBeUndefined();
  });

  it("returns undefined for unknown cafes", () => {
    expect(getReviewInsight("nowhere")).toBeUndefined();
  });
});
