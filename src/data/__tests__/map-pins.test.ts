import {
  cafeMapPins,
  CLUSTER_PIN_COORDINATE,
  MAP_HOME_REGION,
} from "@/data/map-pins";

const allCoordinates = [
  ...cafeMapPins.map((cafe) => ({
    id: cafe.id,
    latitude: cafe.latitude,
    longitude: cafe.longitude,
  })),
  { id: "cluster", ...CLUSTER_PIN_COORDINATE },
];

describe("cafe map pin coordinates", () => {
  it("gives every cafe a finite geographic coordinate", () => {
    for (const cafe of cafeMapPins) {
      expect(Number.isFinite(cafe.latitude)).toBe(true);
      expect(Number.isFinite(cafe.longitude)).toBe(true);
      expect(Math.abs(cafe.latitude)).toBeLessThanOrEqual(90);
      expect(Math.abs(cafe.longitude)).toBeLessThanOrEqual(180);
    }
  });

  it("keeps all pins in one neighborhood-scale cluster (San Diego fixtures)", () => {
    const latitudes = allCoordinates.map((pin) => pin.latitude);
    const longitudes = allCoordinates.map((pin) => pin.longitude);

    // North Park / South Park / University Heights span well under ~5km.
    expect(Math.max(...latitudes) - Math.min(...latitudes)).toBeLessThan(0.05);
    expect(Math.max(...longitudes) - Math.min(...longitudes)).toBeLessThan(
      0.05,
    );
    // Sanity-pin the fixture city so a bad edit can't silently move the map.
    expect(MAP_HOME_REGION.latitude).toBeCloseTo(32.75, 1);
    expect(MAP_HOME_REGION.longitude).toBeCloseTo(-117.13, 1);
  });

  it("derives a home region that contains every pin with padding", () => {
    const north = MAP_HOME_REGION.latitude + MAP_HOME_REGION.latitudeDelta / 2;
    const south = MAP_HOME_REGION.latitude - MAP_HOME_REGION.latitudeDelta / 2;
    const east = MAP_HOME_REGION.longitude + MAP_HOME_REGION.longitudeDelta / 2;
    const west = MAP_HOME_REGION.longitude - MAP_HOME_REGION.longitudeDelta / 2;

    for (const pin of allCoordinates) {
      expect(pin.latitude).toBeGreaterThan(south);
      expect(pin.latitude).toBeLessThan(north);
      expect(pin.longitude).toBeGreaterThan(west);
      expect(pin.longitude).toBeLessThan(east);
    }

    expect(MAP_HOME_REGION.latitudeDelta).toBeGreaterThanOrEqual(0.015);
    expect(MAP_HOME_REGION.longitudeDelta).toBeGreaterThanOrEqual(0.015);
  });

  it("no longer carries screen-pixel offsets on pins", () => {
    for (const cafe of cafeMapPins) {
      expect(cafe).not.toHaveProperty("top");
      expect(cafe).not.toHaveProperty("left");
      expect(cafe).not.toHaveProperty("right");
      expect(cafe).not.toHaveProperty("bottom");
    }
  });
});
