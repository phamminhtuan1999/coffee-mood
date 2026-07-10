import {
  isLiveFinderConfigured,
  runLiveAiFinder,
} from "@/utils/ai-finder-client";

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
  jest.restoreAllMocks();
});

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
