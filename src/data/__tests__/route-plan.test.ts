import {
  DEFAULT_ROUTE_INPUTS,
  ROUTE_DURATIONS,
  ROUTE_MOODS,
  ROUTE_STOP_MAX,
  ROUTE_STOP_MIN,
  ROUTE_TRANSPORTS,
  clampStopCount,
  generateRoute,
  getStopAlternatives,
  stopFromAlternative,
} from "@/data/route-plan";
import type { RoutePlannerInputs } from "@/data/route-plan";

function inputs(overrides: Partial<RoutePlannerInputs> = {}): RoutePlannerInputs {
  return { ...DEFAULT_ROUTE_INPUTS, ...overrides };
}

describe("route plan option data", () => {
  it("exposes the planning.md moods, durations, and transports", () => {
    expect(ROUTE_MOODS.map((mood) => mood.label)).toEqual([
      "Aesthetic",
      "Work",
      "Date",
      "Outdoor",
      "Specialty Coffee",
    ]);
    expect(ROUTE_DURATIONS.map((duration) => duration.label)).toEqual([
      "1 hour",
      "2 hours",
      "Half day",
    ]);
    expect(ROUTE_TRANSPORTS.map((transport) => transport.label)).toEqual([
      "Walk",
      "Drive",
      "Transit",
    ]);
  });
});

describe("clampStopCount", () => {
  it("keeps the count within the min/max and rounds", () => {
    expect(clampStopCount(1)).toBe(ROUTE_STOP_MIN);
    expect(clampStopCount(9)).toBe(ROUTE_STOP_MAX);
    expect(clampStopCount(2.6)).toBe(3);
    expect(clampStopCount(Number.NaN)).toBe(DEFAULT_ROUTE_INPUTS.stopCount);
  });
});

describe("generateRoute", () => {
  it("builds the curated arc sized to the stop count", () => {
    const route = generateRoute(inputs({ stopCount: 3 }));

    expect(route.title).toBe("Saturday Café Route");
    expect(route.stops).toHaveLength(3);
    expect(route.stops.map((stop) => stop.role)).toEqual([
      "Morning latte",
      "Dessert café",
      "Sunset chill spot",
    ]);
    expect(route.stopsLabel).toBe("3 stops");
  });

  it("drops the dessert middle at two stops and adds a focus break at four", () => {
    expect(generateRoute(inputs({ stopCount: 2 })).stops.map((s) => s.role)).toEqual([
      "Morning latte",
      "Dessert café",
    ]);

    const four = generateRoute(inputs({ stopCount: 4 }));
    expect(four.stops).toHaveLength(4);
    expect(four.stops[3].role).toBe("Focus break");
  });

  it("reflects the selected mood, duration, and transport in the copy", () => {
    const route = generateRoute(
      inputs({ moodId: "date", durationId: "half", transportId: "drive", stopCount: 3 }),
    );

    expect(route.subtitle).toBe(
      "half-day date-night café hopping route near you",
    );
    expect(route.durationLabel).toBe("~4 hrs");
    expect(route.distanceLabel).toContain("drive");
  });
});

describe("stop alternatives", () => {
  it("offers reasoned nearby alternatives", () => {
    const alternatives = getStopAlternatives();

    expect(alternatives).toHaveLength(3);
    expect(alternatives.map((alt) => alt.reason)).toEqual([
      "Better parking",
      "More aesthetic",
      "Quieter",
    ]);
    alternatives.forEach((alt) => expect(alt.detour).toMatch(/^\+\d+ min$/));
  });

  it("preserves the original stop role when swapping in an alternative", () => {
    const [alt] = getStopAlternatives();
    const swapped = stopFromAlternative(alt, "Sunset chill spot");

    expect(swapped.role).toBe("Sunset chill spot");
    expect(swapped.cafeId).toBe(alt.cafeId);
    expect(swapped.note).toContain(alt.reason.toLowerCase());
  });
});
