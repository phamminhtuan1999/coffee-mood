import type { CafeMapPinTone } from "@/data/map-pins";

// Mood route planner data layer. The route is generated deterministically from
// the planner inputs (no live AI/routing provider - AI is deferred per decision
// 0013), so the generator reads as a curated café-hopping arc that visibly
// responds to the selected mood, duration, transport, and stop count.

export type RouteMoodId =
  | "aesthetic"
  | "work"
  | "date"
  | "outdoor"
  | "specialty";
export type RouteDurationId = "1h" | "2h" | "half";
export type RouteTransportId = "walk" | "drive" | "transit";

export type RouteMood = { id: RouteMoodId; label: string };
export type RouteDuration = { id: RouteDurationId; label: string };
export type RouteTransport = { id: RouteTransportId; label: string };

export const ROUTE_MOODS: RouteMood[] = [
  { id: "aesthetic", label: "Aesthetic" },
  { id: "work", label: "Work" },
  { id: "date", label: "Date" },
  { id: "outdoor", label: "Outdoor" },
  { id: "specialty", label: "Specialty Coffee" },
];

export const ROUTE_DURATIONS: RouteDuration[] = [
  { id: "1h", label: "1 hour" },
  { id: "2h", label: "2 hours" },
  { id: "half", label: "Half day" },
];

export const ROUTE_TRANSPORTS: RouteTransport[] = [
  { id: "walk", label: "Walk" },
  { id: "drive", label: "Drive" },
  { id: "transit", label: "Transit" },
];

export const ROUTE_STARTING_AREA = "Current location · North Park";
export const ROUTE_STOP_MIN = 2;
export const ROUTE_STOP_MAX = 4;

export type RoutePlannerInputs = {
  area: string;
  moodId: RouteMoodId;
  durationId: RouteDurationId;
  transportId: RouteTransportId;
  stopCount: number;
};

export const DEFAULT_ROUTE_INPUTS: RoutePlannerInputs = {
  area: ROUTE_STARTING_AREA,
  moodId: "aesthetic",
  durationId: "2h",
  transportId: "walk",
  stopCount: 3,
};

export type RouteStop = {
  cafeId: string;
  name: string;
  role: string;
  note: string;
  tone: CafeMapPinTone;
};

export type GeneratedRoute = {
  title: string;
  subtitle: string;
  distanceLabel: string;
  durationLabel: string;
  stopsLabel: string;
  vibeSummary: string;
  stops: RouteStop[];
};

// The curated arc: a slow morning-to-golden-hour café hop. generateRoute()
// slices this to the requested stop count, so 2 stops drop the dessert middle
// and 4 stops add a focus break.
const ROUTE_ARC: RouteStop[] = [
  {
    cafeId: "mostra",
    name: "Mostra Coffee",
    role: "Morning latte",
    note: "Soft window light and a strong horchata latte to open the day.",
    tone: "terracotta",
  },
  {
    cafeId: "fernway",
    name: "Fernway Bakes",
    role: "Dessert café",
    note: "Mid-route sugar stop — pistachio croissants and quiet corner booths.",
    tone: "latte",
  },
  {
    cafeId: "terrace",
    name: "Terrace & Thistle",
    role: "Sunset chill spot",
    note: "Golden-hour patio to close the loop with plants and slow light.",
    tone: "olive",
  },
  {
    cafeId: "marigold",
    name: "Marigold & Oak",
    role: "Focus break",
    note: "Quiet tables and reliable outlets if the afternoon needs a reset.",
    tone: "latte",
  },
];

// The dessert middle (stop 2) is the replaceable one in the E5 flow.
export const REPLACEABLE_STOP_INDEX = 1;

const MOOD_PHRASE: Record<RouteMoodId, string> = {
  aesthetic: "aesthetic",
  work: "focused",
  date: "date-night",
  outdoor: "outdoor",
  specialty: "specialty-coffee",
};

const DURATION_WORD: Record<RouteDurationId, string> = {
  "1h": "1-hour",
  "2h": "2-hour",
  half: "half-day",
};

const DURATION_APPROX: Record<RouteDurationId, string> = {
  "1h": "~1 hr",
  "2h": "~2 hrs",
  half: "~4 hrs",
};

const TRANSPORT_DISTANCE: Record<
  RouteTransportId,
  { perStop: number; verb: string }
> = {
  walk: { perStop: 0.4, verb: "walk" },
  drive: { perStop: 1.1, verb: "drive" },
  transit: { perStop: 0.9, verb: "transit" },
};

// Route metadata shared by the fixture arc and the live-cafe route (US-036,
// utils/planner-cafes) so both read identically for the same inputs.
export function routeSubtitle(inputs: RoutePlannerInputs): string {
  return `${DURATION_WORD[inputs.durationId]} ${MOOD_PHRASE[inputs.moodId]} café hopping route near you`;
}

export function routeDurationLabel(durationId: RouteDurationId): string {
  return DURATION_APPROX[durationId];
}

export function routeTransportVerb(transportId: RouteTransportId): string {
  return TRANSPORT_DISTANCE[transportId].verb;
}

// The curated arc's role vocabulary (morning latte -> dessert -> sunset ->
// focus break) keeps a live route's shape coherent for the same stop count.
export function routeRoleForIndex(index: number): string {
  return ROUTE_ARC[index % ROUTE_ARC.length].role;
}

export function clampStopCount(count: number): number {
  if (Number.isNaN(count)) {
    return DEFAULT_ROUTE_INPUTS.stopCount;
  }

  return Math.min(ROUTE_STOP_MAX, Math.max(ROUTE_STOP_MIN, Math.round(count)));
}

export function generateRoute(inputs: RoutePlannerInputs): GeneratedRoute {
  const stopCount = clampStopCount(inputs.stopCount);
  const stops = ROUTE_ARC.slice(0, stopCount);
  const transport = TRANSPORT_DISTANCE[inputs.transportId];
  const distance = (transport.perStop * stopCount).toFixed(1);

  return {
    title: "Saturday Café Route",
    subtitle: routeSubtitle(inputs),
    distanceLabel: `${distance} mi ${transport.verb}`,
    durationLabel: DURATION_APPROX[inputs.durationId],
    stopsLabel: `${stopCount} stops`,
    vibeSummary:
      "Slow morning arc: latte in soft light, dessert stop mid-route, golden-hour patio to finish. Street parking is easiest near stop 1.",
    stops,
  };
}

export type RouteAlternative = {
  cafeId: string;
  name: string;
  meta: string;
  reason: string;
  detour: string;
  tone: CafeMapPinTone;
};

// Reasoned nearby alternatives offered when swapping a stop. Reasons mirror the
// E5 contract (better parking / more aesthetic / quieter / better coffee) and
// are role-agnostic, so the same pool works for any stop on the route.
const STOP_ALTERNATIVES: RouteAlternative[] = [
  {
    cafeId: "bluevine",
    name: "Bluevine Bakehouse",
    meta: "South Park · 0.3 mi",
    reason: "Better parking",
    detour: "+3 min",
    tone: "latte",
  },
  {
    cafeId: "petal",
    name: "Petal & Crumb",
    meta: "North Park · 0.4 mi",
    reason: "More aesthetic",
    detour: "+5 min",
    tone: "terracotta",
  },
  {
    cafeId: "quietbird",
    name: "Quiet Bird Coffee",
    meta: "University Heights · 0.6 mi",
    reason: "Quieter",
    detour: "+2 min",
    tone: "olive",
  },
];

export function getStopAlternatives(): RouteAlternative[] {
  return STOP_ALTERNATIVES;
}

// Builds the RouteStop that replaces a stop, keeping the original route role so
// the arc (morning latte / dessert / sunset) stays coherent after a swap.
export function stopFromAlternative(
  alt: RouteAlternative,
  role: string,
): RouteStop {
  return {
    cafeId: alt.cafeId,
    name: alt.name,
    role,
    note: `Swapped in for ${alt.reason.toLowerCase()} — ${alt.meta}.`,
    tone: alt.tone,
  };
}
