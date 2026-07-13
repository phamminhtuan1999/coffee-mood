import { searchCafes } from "@/utils/cafe-search";
import { fetchLiveCafes, resetLiveCafesForTests } from "@/utils/live-cafes";

const originalFetch = global.fetch;

const FIXTURE_IDS = ["mostra", "marigold", "terrace", "hearth"];

afterEach(() => {
  global.fetch = originalFetch;
  resetLiveCafesForTests();
});

// Warm the US-031 live-cafe cache with two real-shaped OSM cafes so search
// ranks live candidates instead of the fixtures (US-035). Calabria is nearer
// the center, so it sorts first.
async function warmLiveCache() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      elements: [
        {
          type: "node",
          id: 701,
          lat: 32.7492,
          lon: -117.1299,
          tags: {
            amenity: "cafe",
            name: "Caffè Calabria",
            cuisine: "coffee_shop",
            internet_access: "wlan",
            outdoor_seating: "yes",
            "addr:street": "30th Street",
          },
        },
        {
          type: "node",
          id: 702,
          lat: 32.751,
          lon: -117.132,
          tags: {
            amenity: "cafe",
            name: "Santos Coffee",
            "addr:street": "University Ave",
          },
        },
      ],
    }),
  }) as unknown as typeof fetch;

  await fetchLiveCafes({ latitude: 32.7466, longitude: -117.1297 });
}

describe("searchCafes", () => {
  it("falls back to the curated fixtures on a cold cache", () => {
    const results = searchCafes("work");

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => FIXTURE_IDS.includes(result.id))).toBe(
      true,
    );
  });

  it("ranks the map's real live cafes when the cache is warm", async () => {
    await warmLiveCache();

    const results = searchCafes("work");

    expect(results.every((result) => result.id.startsWith("osm-"))).toBe(true);
    expect(results.map((result) => result.id)).toContain("osm-node-701");

    const calabria = results.find((result) => result.id === "osm-node-701");
    expect(calabria?.name).toBe("Caffè Calabria");
  });

  it("carries real coordinates on live results for the mini-map", async () => {
    await warmLiveCache();

    // Empty query returns the two nearest cafes (the screen's nearby default).
    const results = searchCafes("");

    expect(results.map((result) => result.id)).toEqual([
      "osm-node-701",
      "osm-node-702",
    ]);
    for (const result of results) {
      expect(typeof result.latitude).toBe("number");
      expect(typeof result.longitude).toBe("number");
      expect(result.latitude).toBeGreaterThan(0);
      expect(result.longitude).toBeLessThan(0);
    }
  });
});
