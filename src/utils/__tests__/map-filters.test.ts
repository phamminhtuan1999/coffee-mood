import { cafeMapPins } from "@/data/map-pins";
import {
  activeMapFilterCount,
  applyMapFilters,
  defaultMapFilters,
  distanceLabel,
  noiseHint,
  scoreHint,
} from "@/utils/map-filters";
import type { MapFilters } from "@/utils/map-filters";

function filtersWith(overrides: Partial<MapFilters>): MapFilters {
  return { ...defaultMapFilters(), ...overrides };
}

function matchedIds(filters: MapFilters): string[] {
  return applyMapFilters(cafeMapPins, filters).map((cafe) => cafe.id);
}

describe("applyMapFilters", () => {
  it("keeps every cafe on default filters", () => {
    expect(matchedIds(defaultMapFilters())).toEqual([
      "mostra",
      "marigold",
      "terrace",
      "hearth",
    ]);
  });

  it("filters by walk distance", () => {
    expect(matchedIds(filtersWith({ distance: 12 }))).toEqual([
      "mostra",
      "marigold",
    ]);
  });

  it("requires every selected need", () => {
    expect(matchedIds(filtersWith({ needs: ["Wi-Fi"] }))).toEqual([
      "marigold",
      "hearth",
    ]);
    expect(matchedIds(filtersWith({ needs: ["Wi-Fi", "Late night"] }))).toEqual([
      "hearth",
    ]);
    expect(matchedIds(filtersWith({ needs: ["Outdoor seating"] }))).toEqual([
      "terrace",
    ]);
  });

  it("filters by minimum aesthetic and work scores", () => {
    expect(matchedIds(filtersWith({ aesthetic: 8 }))).toEqual([
      "mostra",
      "terrace",
    ]);
    expect(matchedIds(filtersWith({ work: 8 }))).toEqual(["marigold"]);
  });

  it("filters by maximum noise level", () => {
    expect(matchedIds(filtersWith({ noise: 3 }))).toEqual(["marigold"]);
  });

  it("filters by price when one is selected", () => {
    expect(matchedIds(filtersWith({ price: "$" }))).toEqual(["hearth"]);
    expect(matchedIds(filtersWith({ price: null }))).toHaveLength(4);
  });

  it("treats High rating as a score threshold and other treats as facets", () => {
    expect(matchedIds(filtersWith({ treats: ["High rating"] }))).toEqual([
      "mostra",
      "marigold",
    ]);
    expect(matchedIds(filtersWith({ treats: ["Matcha"] }))).toEqual(["terrace"]);
    expect(matchedIds(filtersWith({ treats: ["Specialty coffee"] }))).toEqual([
      "mostra",
    ]);
  });

  it("combines facets and can produce an empty result", () => {
    expect(
      matchedIds(filtersWith({ needs: ["Wi-Fi"], work: 8 })),
    ).toEqual(["marigold"]);
    expect(
      matchedIds(filtersWith({ needs: ["Outdoor seating"], price: "$" })),
    ).toEqual([]);
  });
});

describe("filter labels", () => {
  it("labels distance as Anywhere at the max", () => {
    expect(distanceLabel(30)).toBe("Anywhere");
    expect(distanceLabel(12)).toBe("Within 12 min");
  });

  it("labels score minimums", () => {
    expect(scoreHint(0)).toBe("any");
    expect(scoreHint(8)).toBe("8.0+");
    expect(scoreHint(7.5)).toBe("7.5+");
  });

  it("labels noise tolerance", () => {
    expect(noiseHint(3)).toBe("quiet-ish");
    expect(noiseHint(6)).toBe("moderate");
    expect(noiseHint(10)).toBe("any");
  });
});

describe("activeMapFilterCount", () => {
  it("is zero on defaults", () => {
    expect(activeMapFilterCount(defaultMapFilters())).toBe(0);
  });

  it("counts each tuned facet once", () => {
    expect(
      activeMapFilterCount(
        filtersWith({
          distance: 12,
          needs: ["Wi-Fi", "Parking"],
          aesthetic: 8,
          price: "$$",
          treats: ["Matcha"],
        }),
      ),
    ).toBe(6);
  });
});
