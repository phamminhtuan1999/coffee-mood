import { DEFAULT_DATE_INPUTS } from "@/data/date-plan";
import { DEFAULT_ROUTE_INPUTS } from "@/data/route-plan";
import { DEFAULT_WORK_INPUTS } from "@/data/work-planner";
import { fetchLiveCafes, resetLiveCafesForTests } from "@/utils/live-cafes";
import {
  nearestNeighborOrder,
  planDate,
  planRoute,
  planStopAlternatives,
  planWorkSpots,
  totalRouteMiles,
} from "@/utils/planner-cafes";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  resetLiveCafesForTests();
});

function cafe(
  id: number,
  name: string,
  lat: number,
  lon: number,
  tags: Record<string, string> = {},
) {
  return {
    type: "node",
    id,
    lat,
    lon,
    tags: { amenity: "cafe", name, ...tags },
  };
}

// Five real-shaped OSM cafes around the center so the planners have enough
// candidates for a 4-stop route plus swap alternatives.
async function warmLiveCache() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      elements: [
        cafe(701, "Caffè Calabria", 32.7492, -117.1299, {
          cuisine: "coffee_shop",
          internet_access: "wlan",
          outdoor_seating: "yes",
          "addr:street": "30th Street",
        }),
        cafe(702, "Santos Coffee", 32.751, -117.132, {
          "addr:street": "University Ave",
        }),
        cafe(703, "Ray Street Roasters", 32.748, -117.129, {
          internet_access: "wlan",
          "addr:street": "Ray Street",
        }),
        cafe(704, "Juniper Bakes", 32.753, -117.14, {
          outdoor_seating: "yes",
          "addr:street": "Juniper Street",
        }),
        cafe(705, "Fern Hollow", 32.746, -117.128, {
          cuisine: "coffee_shop",
          "addr:street": "Fern Street",
        }),
      ],
    }),
  }) as unknown as typeof fetch;

  await fetchLiveCafes({ latitude: 32.7466, longitude: -117.1297 });
}

describe("planWorkSpots", () => {
  it("falls back to the curated fixtures on a cold cache", () => {
    const plan = planWorkSpots(DEFAULT_WORK_INPUTS);

    expect(plan.results.every((r) => !r.cafeId.startsWith("osm-"))).toBe(true);
    expect(plan.bestReason).toMatch(/^Best overall: /);
  });

  it("ranks the real live cafes when the cache is warm", async () => {
    await warmLiveCache();

    const plan = planWorkSpots(DEFAULT_WORK_INPUTS);

    expect(plan.results.length).toBeGreaterThan(0);
    expect(plan.results.every((r) => r.cafeId.startsWith("osm-"))).toBe(true);
    expect(plan.bestReason).toContain("estimated work score");
  });

  it("reports only what OSM knows — outlets are never invented", async () => {
    await warmLiveCache();

    const plan = planWorkSpots(DEFAULT_WORK_INPUTS);

    for (const result of plan.results) {
      const outlets = result.stats.find((s) => s.label === "Outlets");
      expect(outlets?.value).toBe("Not reported");

      const wifi = result.stats.find((s) => s.label === "Wi-Fi");
      expect(["Reported", "Not reported"]).toContain(wifi?.value);

      // Noise is a US-031 estimate and is labelled as one.
      expect(result.stats.find((s) => s.label === "Noise")?.value).toMatch(
        /\(est\.\)$/,
      );
      expect(result.tip).toContain("fill in as people check in");
    }
  });
});

describe("planDate", () => {
  it("falls back to the curated plan on a cold cache", () => {
    const plan = planDate(DEFAULT_DATE_INPUTS);

    expect(plan.cafeId.startsWith("osm-")).toBe(false);
    expect(plan.steps).toHaveLength(3);
  });

  it("builds the plan around a real cafe when the cache is warm", async () => {
    await warmLiveCache();

    const plan = planDate(DEFAULT_DATE_INPUTS);

    expect(plan.cafeId.startsWith("osm-")).toBe(true);
    expect(plan.steps).toHaveLength(3);
    expect(plan.steps[0].title).toBe(`Meet at ${plan.name}`);
    expect(plan.tip).toContain("is a real spot");
  });

  it("prefers a cafe with reported outdoor seating for an Outdoor date", async () => {
    await warmLiveCache();

    // DEFAULT_DATE_INPUTS.mood is "Outdoor"; Calabria and Juniper report it.
    const plan = planDate({ ...DEFAULT_DATE_INPUTS, mood: "Outdoor" });

    expect(["osm-node-701", "osm-node-704"]).toContain(plan.cafeId);
  });

  it("rotates to a different real cafe when shuffled", async () => {
    await warmLiveCache();

    const first = planDate(DEFAULT_DATE_INPUTS, 0);
    const second = planDate(DEFAULT_DATE_INPUTS, 1);

    expect(second.cafeId).not.toBe(first.cafeId);
  });
});

describe("planRoute", () => {
  it("falls back to the curated arc on a cold cache", () => {
    const route = planRoute(DEFAULT_ROUTE_INPUTS);

    expect(route.title).toBe("Saturday Café Route");
    expect(route.stops.every((s) => !s.cafeId.startsWith("osm-"))).toBe(true);
  });

  it("sequences real cafes with a real measured distance", async () => {
    await warmLiveCache();

    const route = planRoute({ ...DEFAULT_ROUTE_INPUTS, stopCount: 3 });

    expect(route.stops).toHaveLength(3);
    expect(route.stops.every((s) => s.cafeId.startsWith("osm-"))).toBe(true);
    expect(route.stopsLabel).toBe("3 stops");

    // The fixture arc would report a flat 0.4 mi/stop => "1.2 mi walk".
    // A real route measures the actual hop distance instead.
    expect(route.distanceLabel).not.toBe("1.2 mi walk");
    expect(route.distanceLabel).toMatch(/^\d+\.\d mi walk$/);
    expect(route.vibeSummary).toContain("real cafes near you");
  });

  it("honours the requested stop count", async () => {
    await warmLiveCache();

    expect(planRoute({ ...DEFAULT_ROUTE_INPUTS, stopCount: 2 }).stops).toHaveLength(2);
    expect(planRoute({ ...DEFAULT_ROUTE_INPUTS, stopCount: 4 }).stops).toHaveLength(4);
  });
});

describe("planStopAlternatives", () => {
  it("falls back to the curated pool on a cold cache", () => {
    const alternatives = planStopAlternatives([]);

    expect(alternatives.every((a) => !a.cafeId.startsWith("osm-"))).toBe(true);
  });

  it("offers real nearby cafes that are not already on the route", async () => {
    await warmLiveCache();

    const route = planRoute({ ...DEFAULT_ROUTE_INPUTS, stopCount: 2 });
    const onRoute = route.stops.map((stop) => stop.cafeId);
    const alternatives = planStopAlternatives(onRoute, onRoute[1]);

    expect(alternatives.length).toBeGreaterThan(0);
    for (const alternative of alternatives) {
      expect(alternative.cafeId.startsWith("osm-")).toBe(true);
      expect(onRoute).not.toContain(alternative.cafeId);
      expect(alternative.detour).toMatch(/^\+\d+ min$/);
      expect([
        "Better coffee",
        "More outdoor",
        "Quieter",
        "More aesthetic",
        "Wi-Fi reported",
        "Also nearby",
      ]).toContain(alternative.reason);
    }
  });

  it("gives each alternative its own headline advantage where it has one", async () => {
    await warmLiveCache();

    // Anchor on a plain cafe (no wifi/outdoor/specialty) so several candidates
    // beat it on more than one signal and the reasons must be spread out.
    const alternatives = planStopAlternatives(["osm-node-702"], "osm-node-702");
    const reasons = alternatives.map((alternative) => alternative.reason);

    expect(reasons.length).toBeGreaterThan(1);
    // No duplicate labels: the swap list has to read as a real choice.
    expect(new Set(reasons).size).toBe(reasons.length);
  });
});

describe("route geometry helpers", () => {
  const pin = (id: string, latitude: number, longitude: number) =>
    ({ id, latitude, longitude }) as never;

  it("orders stops by nearest neighbour from the best-fit start", () => {
    // Start at A; C is nearer to A than B, and B is nearer to C than to A.
    const a = pin("a", 32.74, -117.13);
    const b = pin("b", 32.76, -117.13);
    const c = pin("c", 32.745, -117.13);

    expect(nearestNeighborOrder([a, b, c]).map((p) => p.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("sums the real distance between consecutive stops", () => {
    const a = pin("a", 32.74, -117.13);
    const b = pin("b", 32.75, -117.13);
    const c = pin("c", 32.76, -117.13);

    // ~0.69 mi per 0.01 degree of latitude, twice.
    const total = totalRouteMiles([a, b, c]);

    expect(total).toBeGreaterThan(1.2);
    expect(total).toBeLessThan(1.6);
    expect(totalRouteMiles([a])).toBe(0);
  });
});
