import { Linking } from "react-native";

import {
  directionsUrl,
  googleMapsUrl,
  openDirections,
  openGoogleMaps,
} from "@/utils/directions";

const target = { name: "Mostra Coffee", latitude: 32.75, longitude: -117.13 };

describe("directions URLs", () => {
  it("builds the Apple Maps deep link on iOS", () => {
    expect(directionsUrl(target, "ios")).toBe(
      "maps://?daddr=32.75,-117.13&q=Mostra%20Coffee",
    );
  });

  it("builds a geo: URI on Android and a web link elsewhere", () => {
    expect(directionsUrl(target, "android")).toBe(
      "geo:32.75,-117.13?q=32.75,-117.13(Mostra%20Coffee)",
    );
    expect(directionsUrl(target, "web")).toBe(
      "https://maps.apple.com/?daddr=32.75,-117.13&q=Mostra%20Coffee",
    );
  });

  it("builds the Google Maps search URL", () => {
    expect(googleMapsUrl(target)).toBe(
      "https://www.google.com/maps/search/?api=1&query=32.75,-117.13",
    );
  });

  it("opens the URLs via Linking and swallows failures", async () => {
    const openUrl = jest
      .spyOn(Linking, "openURL")
      .mockRejectedValue(new Error("no handler"));

    expect(() => openDirections(target)).not.toThrow();
    expect(() => openGoogleMaps(target)).not.toThrow();
    expect(openUrl).toHaveBeenCalledTimes(2);
    expect(openUrl.mock.calls[0][0]).toContain("daddr=32.75,-117.13");
    expect(openUrl.mock.calls[1][0]).toContain("query=32.75,-117.13");

    openUrl.mockRestore();
  });
});
