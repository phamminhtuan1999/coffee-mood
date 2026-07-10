import {
  fetchLiveCafes,
  getLiveCafeDetail,
  getLiveCafePin,
  isLiveCafeId,
  resetLiveCafesForTests,
} from "@/utils/live-cafes";

const CENTER = { latitude: 32.7466, longitude: -117.1297 };

const fullNode = {
  type: "node",
  id: 111,
  lat: 32.7492,
  lon: -117.1299,
  tags: {
    amenity: "cafe",
    name: "Caffè Calabria",
    cuisine: "coffee_shop;italian",
    internet_access: "wlan",
    outdoor_seating: "yes",
    "addr:street": "30th Street",
    "addr:housenumber": "3933",
    opening_hours: "Mo-Su 07:00-15:00",
  },
};

const bareWay = {
  type: "way",
  id: 222,
  center: { lat: 32.7551, lon: -117.131 },
  tags: { amenity: "cafe", name: "Coffee & Tea Collective" },
};

const unnamedNode = {
  type: "node",
  id: 333,
  lat: 32.75,
  lon: -117.13,
  tags: { amenity: "cafe" },
};

function mockOverpass(elements: unknown[], ok = true) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok,
    json: async () => ({ elements }),
  });
}

beforeEach(() => {
  resetLiveCafesForTests();
  global.fetch = jest.fn();
});

describe("fetchLiveCafes", () => {
  it("maps named OSM cafes (node coords and way centers) into CafeMapPin shape", async () => {
    mockOverpass([fullNode, bareWay, unnamedNode]);

    const pins = await fetchLiveCafes(CENTER);

    expect(pins).toHaveLength(2);
    const calabria = pins!.find((pin) => pin.name === "Caffè Calabria")!;

    expect(calabria.id).toBe("osm-node-111");
    expect(calabria.latitude).toBeCloseTo(32.7492);
    expect(calabria.longitude).toBeCloseTo(-117.1299);
    expect(calabria.meta).toMatch(/30th Street · 0\.\d mi/);
    expect(calabria.tags).toEqual(
      expect.arrayContaining(["Specialty Coffee", "Wi-Fi", "Outdoor"]),
    );
    expect(calabria.needs).toEqual(
      expect.arrayContaining(["Wi-Fi", "Outdoor seating"]),
    );
    expect(calabria.treats).toContain("Specialty coffee");

    const collective = pins!.find(
      (pin) => pin.name === "Coffee & Tea Collective",
    )!;

    expect(collective.id).toBe("osm-way-222");
    expect(collective.latitude).toBeCloseTo(32.7551);
    expect(collective.meta).toMatch(/^Nearby · /);
  });

  it("derives deterministic estimate scores across refetches", async () => {
    mockOverpass([fullNode]);
    const first = await fetchLiveCafes(CENTER);

    mockOverpass([fullNode]);
    const second = await fetchLiveCafes(CENTER);

    expect(first![0].scores).toEqual(second![0].scores);
    expect(first![0].moodScores).toEqual(second![0].moodScores);
    const aesthetic = Number.parseFloat(first![0].score);

    expect(aesthetic).toBeGreaterThanOrEqual(6.8);
    expect(aesthetic).toBeLessThanOrEqual(9.2);
  });

  it("caps results at 20 nearest cafes", async () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      type: "node",
      id: 1000 + index,
      lat: 32.74 + index * 0.001,
      lon: -117.13,
      tags: { amenity: "cafe", name: `Cafe ${index}` },
    }));

    mockOverpass(many);
    const pins = await fetchLiveCafes(CENTER);

    expect(pins).toHaveLength(20);
  });

  it("returns null on non-200, malformed payload, empty result, and network error", async () => {
    mockOverpass([], false);
    expect(await fetchLiveCafes(CENTER)).toBeNull();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    expect(await fetchLiveCafes(CENTER)).toBeNull();

    mockOverpass([unnamedNode]);
    expect(await fetchLiveCafes(CENTER)).toBeNull();

    (global.fetch as jest.Mock).mockRejectedValue(new Error("offline"));
    expect(await fetchLiveCafes(CENTER)).toBeNull();
  });
});

describe("live cafe lookups", () => {
  it("resolves cached pins and synthesizes a limited detail with real facts", async () => {
    mockOverpass([fullNode]);
    await fetchLiveCafes(CENTER);

    expect(isLiveCafeId("osm-node-111")).toBe(true);
    expect(isLiveCafeId("mostra")).toBe(false);
    expect(getLiveCafePin("osm-node-111")?.name).toBe("Caffè Calabria");

    const detail = getLiveCafeDetail("osm-node-111")!;

    expect(detail.limited).toBe(true);
    expect(detail.facts).toEqual(
      expect.arrayContaining([
        { label: "Address", value: "3933 30th Street" },
        { label: "Hours", value: "Mo-Su 07:00-15:00" },
        { label: "Wi-Fi", value: "Reported" },
        { label: "Outdoor seating", value: "Reported" },
      ]),
    );
    expect(detail.photoTotal).toBe(1);
    expect(detail.statusMeta).toBe("Community data");

    expect(getLiveCafePin("osm-node-999")).toBeUndefined();
    expect(getLiveCafeDetail("osm-node-999")).toBeUndefined();
  });
});
