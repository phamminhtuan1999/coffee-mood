import { cafeMapPins } from "@/data/map-pins";
import {
  getShareCardContent,
  SHARE_BRAND,
  shareActions,
} from "@/data/share-card";

describe("share card content", () => {
  it("matches the D6 reference for Mostra", () => {
    const content = getShareCardContent("mostra");

    expect(content).toEqual({
      cafeId: "mostra",
      name: "Mostra Coffee",
      location: "North Park · San Diego",
      vibeTag: "Aesthetic",
      score: "9.1",
      tagline: "Warm light, strong lattes — made for slow photo mornings.",
      tone: "terracotta",
    });
  });

  it("derives shareable content for every cafe pin", () => {
    for (const pin of cafeMapPins) {
      const content = getShareCardContent(pin.id);

      expect(content).toBeTruthy();
      expect(content?.cafeId).toBe(pin.id);
      expect(content?.name).toBe(pin.name);
      expect(content?.score).toBe(pin.score);
      expect(content?.location.endsWith("· San Diego")).toBe(true);
      expect(content?.vibeTag.length).toBeGreaterThan(0);
      expect(content?.tagline.length).toBeGreaterThan(0);
    }
  });

  it("falls back to the pin vibe for cafes without a dedicated tagline", () => {
    // Hearth has no share tagline, so it reuses its pin vibe.
    const hearth = getShareCardContent("hearth");
    const pin = cafeMapPins.find((cafe) => cafe.id === "hearth");

    expect(hearth?.tagline).toBe(pin?.vibe);
  });

  it("returns undefined for unknown cafes", () => {
    expect(getShareCardContent("nowhere")).toBeUndefined();
  });

  it("exposes the three share actions and the brand", () => {
    expect(shareActions.map((action) => action.label)).toEqual([
      "Copy Link",
      "Share Image",
      "Send to Friend",
    ]);
    expect(SHARE_BRAND).toBe("CafeMood Map");
  });
});
