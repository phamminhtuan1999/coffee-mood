import type { CafeDetail } from "@/data/cafe-details";
import type {
  CafeMapPin,
  CafeMapPinTone,
  MapCoordinate,
} from "@/data/map-pins";
import type { FilterNeed, FilterTreat } from "@/utils/map-filters";

// Live cafe data for the map home (US-031, decision 0024): real cafes from
// the keyless OpenStreetMap Overpass API, mapped into the existing
// CafeMapPin shape so chips, filters, markers, and the sheet work unchanged.
// Any failure returns null and callers fall back to the curated fixtures.

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_METERS = 1500;
const MAX_LIVE_CAFES = 20;
export const LIVE_CAFES_TIMEOUT_MS = 12000;

const TONES: CafeMapPinTone[] = ["terracotta", "latte", "olive"];

type OverpassElement = {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

export type LiveCafeExtras = {
  address?: string;
  hours?: string;
  wifi: boolean;
  outdoor: boolean;
};

let lastLivePins: CafeMapPin[] = [];
const liveExtras = new Map<string, LiveCafeExtras>();

// Small stable string hash so a live cafe's estimated vibe scores are
// identical across renders, refetches, and sessions.
function stableHash(input: string): number {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 1000003;
  }

  return hash;
}

// Deterministic score in [min, max] with one decimal, seeded by id + salt.
function estimatedScore(
  id: string,
  salt: string,
  min: number,
  max: number,
): number {
  const span = Math.round((max - min) * 10);
  const value = min + (stableHash(`${id}:${salt}`) % (span + 1)) / 10;

  return Math.round(value * 10) / 10;
}

function distanceMiles(a: MapCoordinate, b: MapCoordinate): number {
  const earthRadiusMiles = 3958.8;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(h));
}

function toLiveCafe(
  element: OverpassElement,
  center: MapCoordinate,
  index: number,
): { pin: CafeMapPin; extras: LiveCafeExtras } | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;

  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  const id = `osm-${element.type ?? "node"}-${element.id ?? index}`;
  const wifi = (tags.internet_access ?? "no") !== "no";
  const outdoor = tags.outdoor_seating === "yes";
  const specialty = (tags.cuisine ?? "").includes("coffee_shop");
  const street = tags["addr:street"];
  const miles = distanceMiles(center, { latitude, longitude });
  const milesLabel = Math.max(0.1, Math.round(miles * 10) / 10).toFixed(1);
  const walkMinutes = Math.max(2, Math.round(miles * 20));

  const aesthetic = estimatedScore(id, "aesthetic", 6.8, 9.2);
  const coffee = estimatedScore(id, "coffee", 7.4, 9.2);
  const work = estimatedScore(id, "work", 5.5, 8.9);
  const noise = Math.round(estimatedScore(id, "noise", 2, 8));

  const pinTags = [
    ...(specialty ? ["Specialty Coffee"] : []),
    ...(wifi ? ["Wi-Fi", "Work"] : []),
    ...(outdoor ? ["Outdoor"] : []),
    ...(aesthetic >= 8 ? ["Aesthetic"] : []),
  ];
  const needs: FilterNeed[] = [
    ...(wifi ? (["Wi-Fi"] as FilterNeed[]) : []),
    ...(outdoor ? (["Outdoor seating"] as FilterNeed[]) : []),
  ];
  const treats: FilterTreat[] = specialty ? ["Specialty coffee"] : [];

  const pin: CafeMapPin = {
    id,
    name,
    meta: `${street ?? "Nearby"} · ${milesLabel} mi`,
    score: aesthetic.toFixed(1),
    tags: pinTags.length > 0 ? pinTags : ["Cafe"],
    scores: [
      { label: "Aesthetic", value: aesthetic.toFixed(1) },
      { label: "Coffee", value: coffee.toFixed(1) },
      { label: "Work", value: work.toFixed(1) },
    ],
    summary: buildSummary(name, { wifi, outdoor, address: street, hours: tags.opening_hours }),
    tone: TONES[stableHash(id) % TONES.length],
    vibe: "Local spot from the live map",
    photoCount: 0,
    whyItMatches: [
      `Real cafe ${milesLabel} mi from your location.`,
      wifi ? "Wi-Fi reported by the community." : "Community-mapped local spot.",
      outdoor
        ? "Outdoor seating reported by the community."
        : "Vibe details fill in as people check in.",
    ],
    peopleLove: [],
    watchOutFor: [],
    walkMinutes,
    needs,
    moodScores: { aesthetic, work, noise },
    price: "$$",
    treats,
    latitude,
    longitude,
  };

  return {
    pin,
    extras: {
      address: street
        ? `${tags["addr:housenumber"] ? `${tags["addr:housenumber"]} ` : ""}${street}`
        : undefined,
      hours: tags.opening_hours,
      wifi,
      outdoor,
    },
  };
}

function buildSummary(
  name: string,
  info: { wifi: boolean; outdoor: boolean; address?: string; hours?: string },
): string {
  const perks = [
    ...(info.wifi ? ["Wi-Fi"] : []),
    ...(info.outdoor ? ["outdoor seating"] : []),
  ];
  const perkText =
    perks.length > 0 ? ` Community-reported ${perks.join(" and ")}.` : "";

  return `${name} is a real nearby cafe from the live map. We're still learning its vibe.${perkText}`;
}

export async function fetchLiveCafes(
  center: MapCoordinate,
): Promise<CafeMapPin[] | null> {
  const query = `[out:json][timeout:10];nwr["amenity"="cafe"](around:${SEARCH_RADIUS_METERS},${center.latitude},${center.longitude});out center 30;`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LIVE_CAFES_TIMEOUT_MS);

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Overpass rejects UA-less requests with a 406.
        "User-Agent": "CafeMoodMap/1.0 (demo app)",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { elements?: OverpassElement[] };

    if (!Array.isArray(payload.elements)) {
      return null;
    }

    const mapped = payload.elements
      .map((element, index) => toLiveCafe(element, center, index))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort(
        (a, b) =>
          distanceMiles(center, a.pin) - distanceMiles(center, b.pin),
      )
      .slice(0, MAX_LIVE_CAFES);

    if (mapped.length === 0) {
      return null;
    }

    lastLivePins = mapped.map((entry) => entry.pin);
    liveExtras.clear();
    for (const entry of mapped) {
      liveExtras.set(entry.pin.id, entry.extras);
    }

    return lastLivePins;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function isLiveCafeId(id: string): boolean {
  return id.startsWith("osm-");
}

export function getLiveCafePin(id: string): CafeMapPin | undefined {
  return lastLivePins.find((pin) => pin.id === id);
}

// Synthesized limited-data detail (US-014 contract) for a live cafe: real
// facts where OSM has them, estimate-labeled scores everywhere else.
export function getLiveCafeDetail(id: string): CafeDetail | undefined {
  const pin = getLiveCafePin(id);

  if (!pin) {
    return undefined;
  }

  const extras = liveExtras.get(id);

  return {
    id,
    status: "Open",
    statusMeta: "Community data",
    photoTones: [pin.tone],
    // One decorative tone block renders in the hero, so the pager reads 1/1.
    photoTotal: 1,
    detailScores: pin.scores,
    facts: [
      { label: "Address", value: extras?.address ?? "See map pin" },
      { label: "Hours", value: extras?.hours ?? "Not reported yet" },
      { label: "Wi-Fi", value: extras?.wifi ? "Reported" : "Not reported" },
      {
        label: "Outdoor seating",
        value: extras?.outdoor ? "Reported" : "Not reported",
      },
    ],
    bestTimes: [],
    similar: [],
    limited: true,
  };
}

// Test hook: reset the module cache between cases.
export function resetLiveCafesForTests(): void {
  lastLivePins = [];
  liveExtras.clear();
}
