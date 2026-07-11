import { Linking, Platform } from "react-native";

import type { MapCoordinate } from "@/data/map-pins";

// Directions open the OS maps app at the cafe's real coordinates (US-032,
// decision 0025) — no provider, key, or account involved. This supersedes
// decision 0010's directions deferral now that pins carry real geography.

export function directionsUrl(
  target: MapCoordinate & { name: string },
  platform: typeof Platform.OS = Platform.OS,
): string {
  const coords = `${target.latitude},${target.longitude}`;
  const label = encodeURIComponent(target.name);

  if (platform === "ios") {
    // Apple Maps: destination address pinned to the cafe's coordinates.
    return `maps://?daddr=${coords}&q=${label}`;
  }

  if (platform === "android") {
    return `geo:${coords}?q=${coords}(${label})`;
  }

  return `https://maps.apple.com/?daddr=${coords}&q=${label}`;
}

export function googleMapsUrl(target: MapCoordinate): string {
  return `https://www.google.com/maps/search/?api=1&query=${target.latitude},${target.longitude}`;
}

export function openDirections(
  target: MapCoordinate & { name: string },
): void {
  Linking.openURL(directionsUrl(target)).catch(() => {
    // The maps app is unavailable (rare); leave the screen untouched.
  });
}

export function openGoogleMaps(target: MapCoordinate): void {
  Linking.openURL(googleMapsUrl(target)).catch(() => {
    // Browser unavailable; leave the screen untouched.
  });
}
