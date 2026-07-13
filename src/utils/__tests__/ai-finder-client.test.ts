import {
  isLiveFinderConfigured,
  runLiveAiFinder,
} from "@/utils/ai-finder-client";
import { fetchLiveCafes, resetLiveCafesForTests } from "@/utils/live-cafes";

const originalFetch = global.fetch;

function configureEnv() {
  process.env.EXPO_PUBLIC_SUPABASE_URL = "https://demo.supabase.co/";
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
}

function clearEnv() {
  delete process.env.EXPO_PUBLIC_SUPABASE_URL;
  delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
}

afterEach(() => {
  clearEnv();
  global.fetch = originalFetch;
  resetLiveCafesForTests();
  jest.restoreAllMocks();
});

// Warm the US-031 live-cafe cache with two real-shaped OSM cafes so the
// finder ranks live candidates instead of the fixtures (US-033).
async function warmLiveCache() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      elements: [
        {
          type: "node",
          id: 501,
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
          id: 502,
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

describe("live finder configuration gate", () => {
  it("is unconfigured without the Supabase env values", async () => {
    expect(isLiveFinderConfigured()).toBe(false);
    expect(await runLiveAiFinder("quiet work spot", null)).toBeNull();
  });

  it("requires both URL and anon key", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "https://demo.supabase.co";
    expect(isLiveFinderConfigured()).toBe(false);

    configureEnv();
    expect(isLiveFinderConfigured()).toBe(true);
  });
});

describe("live finder request and mapping", () => {
  it("posts prompt, profile, and candidates and maps the result onto fixtures", async () => {
    configureEnv();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        bestMatchId: "marigold",
        why: ["Quiet after 2pm.", "Outlets at every table.", "Steady wifi."],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await runLiveAiFinder("quiet work spot", {
      cafeTypes: ["Work / Study"],
      priorities: ["Wi-Fi"],
      distance: "10 min",
      price: "$$",
      skipped: false,
      updatedAt: "2026-07-09T00:00:00.000Z",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://demo.supabase.co/functions/v1/ai-finder");
    expect(init.headers.Authorization).toBe("Bearer anon-key");
    expect(init.headers.apikey).toBe("anon-key");

    const body = JSON.parse(init.body);
    expect(body.prompt).toBe("quiet work spot");
    expect(body.profile.cafeTypes).toEqual(["Work / Study"]);
    expect(body.candidates.map((cafe: { id: string }) => cafe.id)).toEqual([
      "mostra",
      "marigold",
      "terrace",
      "hearth",
    ]);

    expect(result?.status).toBe("match");
    if (result?.status === "match") {
      expect(result.match.name).toBe("Marigold & Oak");
      expect(result.match.whyItMatches).toEqual([
        "Quiet after 2pm.",
        "Outlets at every table.",
        "Steady wifi.",
      ]);
      // Fixture surface data survives the merge.
      expect(result.match.alternatives.length).toBeGreaterThan(0);
    }
  });

  it("ranks the map's live cafes when the cache is warm (US-033)", async () => {
    configureEnv();
    await warmLiveCache();

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        bestMatchId: "osm-node-501",
        why: ["Wi-Fi reported.", "Outdoor seating.", "On 30th Street."],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await runLiveAiFinder("quiet work spot with wifi", null);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    // Real OSM ids travel as candidates, not the fixtures.
    expect(body.candidates.map((cafe: { id: string }) => cafe.id)).toEqual([
      "osm-node-501",
      "osm-node-502",
    ]);
    expect(body.candidates[0].name).toBe("Caffè Calabria");

    expect(result?.status).toBe("match");
    if (result?.status === "match") {
      // Winner is the real cafe, with the model's bullets.
      expect(result.match.name).toBe("Caffè Calabria");
      expect(result.match.id).toBe("osm-node-501");
      expect(result.match.whyItMatches).toEqual([
        "Wi-Fi reported.",
        "Outdoor seating.",
        "On 30th Street.",
      ]);
      // Alternatives come from the other nearby live cafe.
      expect(result.match.alternatives[0].name).toBe("Santos Coffee");
    }
  });

  it("falls back to fixtures for an unknown live id", async () => {
    configureEnv();
    await warmLiveCache();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bestMatchId: "osm-node-999", why: ["x"] }),
    }) as unknown as typeof fetch;

    expect(await runLiveAiFinder("anything", null)).toEqual({
      status: "unavailable",
    });
  });

  it("maps provider failures to the unavailable state", async () => {
    configureEnv();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 502 }) as unknown as typeof fetch;

    expect(await runLiveAiFinder("anything", null)).toEqual({
      status: "unavailable",
    });
  });

  it("treats unknown ids, empty bullets, and network errors as unavailable", async () => {
    configureEnv();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bestMatchId: "ghost-cafe", why: ["x"] }),
    }) as unknown as typeof fetch;
    expect(await runLiveAiFinder("anything", null)).toEqual({
      status: "unavailable",
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bestMatchId: "mostra", why: [] }),
    }) as unknown as typeof fetch;
    expect(await runLiveAiFinder("anything", null)).toEqual({
      status: "unavailable",
    });

    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("network down")) as unknown as typeof fetch;
    expect(await runLiveAiFinder("anything", null)).toEqual({
      status: "unavailable",
    });
  });
});
