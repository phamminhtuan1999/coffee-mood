import { createDatePlan } from "@/data/date-plan";
import type {
  DateMood,
  DatePlan,
  DatePlanInputs,
  DatePlanStep,
} from "@/data/date-plan";
import type { CafeMapPin } from "@/data/map-pins";
import {
  clampStopCount,
  generateRoute,
  getStopAlternatives,
  routeDurationLabel,
  routeRoleForIndex,
  routeSubtitle,
  routeTransportVerb,
} from "@/data/route-plan";
import type {
  GeneratedRoute,
  RouteAlternative,
  RouteMoodId,
  RoutePlannerInputs,
  RouteStop,
} from "@/data/route-plan";
import { findWorkSpots, workRank } from "@/data/work-planner";
import type {
  WorkSessionInputs,
  WorkSpotStat,
  WorkSpotsPlan,
} from "@/data/work-planner";
import { distanceMiles, getCachedLiveCafes } from "@/utils/live-cafes";

// Live planners (US-036): the work, date, and route planners build their plans
// from the map's real nearby OSM cafes (the US-031 session cache) instead of
// the curated fixtures. On a cold cache (planner opened before the map, or
// Overpass failed) each falls back to its fixture planner untouched — the same
// live/fixture split the map (0024), AI finder (0026), and search (US-035) use.
// No network call happens here; everything is derived locally.
//
// Live cafes carry only what OpenStreetMap actually knows (name, street,
// Wi-Fi, outdoor seating, specialty tag) plus US-031's deterministic score
// estimates. So live copy is derived from those real signals — it never
// invents the per-cafe specifics the curated fixtures hand-write.

const MAX_WORK_RESULTS = 4;
const MAX_ALTERNATIVES = 3;
const QUIET_NOISE = 3;
const WALK_MINUTES_PER_MILE = 20;

function hasWifi(pin: CafeMapPin): boolean {
  return pin.needs.includes("Wi-Fi");
}

function hasOutdoor(pin: CafeMapPin): boolean {
  return pin.needs.includes("Outdoor seating");
}

function isSpecialty(pin: CafeMapPin): boolean {
  return pin.tags.includes("Specialty Coffee");
}

// Live meta reads "<street> · <miles> mi"; pull the parts back out for copy.
function streetOf(pin: CafeMapPin): string {
  const [street] = pin.meta.split(" · ");

  return street && street !== "Nearby" ? street : "";
}

function distanceOf(pin: CafeMapPin): string {
  const parts = pin.meta.split(" · ");

  return parts[parts.length - 1] ?? "";
}

function communityPerks(pin: CafeMapPin): string[] {
  return [
    hasWifi(pin) ? "Wi-Fi" : null,
    hasOutdoor(pin) ? "outdoor seating" : null,
  ].filter((perk): perk is string => perk !== null);
}

// ---------------------------------------------------------------- work spots

function noiseLabel(noise: number): { value: string; level: WorkSpotStat["level"] } {
  if (noise <= QUIET_NOISE) {
    return { value: "Low", level: "positive" };
  }

  if (noise <= 5) {
    return { value: "Calm", level: "positive" };
  }

  return { value: "Lively", level: "caution" };
}

// Only report what OSM actually knows. Outlets have no OSM source, so they read
// "Not reported" rather than inventing a confidence level.
function liveWorkStats(pin: CafeMapPin): WorkSpotStat[] {
  const noise = noiseLabel(pin.moodScores.noise);

  return [
    {
      label: "Wi-Fi",
      value: hasWifi(pin) ? "Reported" : "Not reported",
      level: hasWifi(pin) ? "positive" : "caution",
    },
    { label: "Outlets", value: "Not reported", level: "caution" },
    { label: "Noise", value: `${noise.value} (est.)`, level: noise.level },
  ];
}

function liveWorkTip(pin: CafeMapPin): string {
  const perks = communityPerks(pin);
  const street = streetOf(pin);
  const where = street ? `On ${street}` : "Nearby";

  return perks.length > 0
    ? `${where} · community-reported ${perks.join(" and ")}. Vibe details fill in as people check in.`
    : `${where} · community-mapped spot. Vibe details fill in as people check in.`;
}

function liveWorkReason(pin: CafeMapPin): string {
  const signals = [
    `estimated work score ${pin.moodScores.work.toFixed(1)}`,
    hasWifi(pin) ? "Wi-Fi reported" : null,
    `${distanceOf(pin)} away`,
  ].filter((signal): signal is string => signal !== null);

  return signals.join(", ");
}

function liveWorkSpots(
  inputs: WorkSessionInputs,
  pins: CafeMapPin[],
): WorkSpotsPlan {
  const ranked = [...pins]
    .sort((a, b) => workRank(b, inputs.needs) - workRank(a, inputs.needs))
    .slice(0, MAX_WORK_RESULTS);

  return {
    bestReason: `Best overall: ${ranked[0].name} — ${liveWorkReason(ranked[0])}.`,
    results: ranked.map((pin) => ({
      cafeId: pin.id,
      name: pin.name,
      meta: pin.meta,
      workScore: pin.moodScores.work.toFixed(1),
      tone: pin.tone,
      stats: liveWorkStats(pin),
      tip: liveWorkTip(pin),
    })),
  };
}

export function planWorkSpots(inputs: WorkSessionInputs): WorkSpotsPlan {
  const liveCafes = getCachedLiveCafes();

  return liveCafes.length > 0
    ? liveWorkSpots(inputs, liveCafes)
    : findWorkSpots(inputs);
}

// ----------------------------------------------------------------- date plan

function dateMoodScore(pin: CafeMapPin, mood: DateMood): number {
  if (mood === "Quiet") {
    return 10 - pin.moodScores.noise;
  }

  if (mood === "Outdoor") {
    return (hasOutdoor(pin) ? 5 : 0) + pin.moodScores.aesthetic;
  }

  // Cozy / Aesthetic / Fun all lean on the aesthetic estimate.
  return pin.moodScores.aesthetic;
}

// Each step cites something OpenStreetMap actually reports for this cafe.
function liveDateSteps(pin: CafeMapPin): DatePlanStep[] {
  const street = streetOf(pin);

  return [
    {
      title: `Meet at ${pin.name}`,
      detail: hasOutdoor(pin)
        ? "Community-reported outdoor seating — take a table outside."
        : street
          ? `Find each other on ${street}.`
          : "Find each other at the counter.",
    },
    {
      title: "Order something to share",
      detail: isSpecialty(pin)
        ? "Tagged specialty coffee — worth splitting a slow pour-over."
        : "Split whatever looks good at the counter.",
    },
    {
      title: street ? `Wander ${street}` : "Wander the block",
      detail: `${distanceOf(pin)} from you, so the walk back is short.`,
    },
  ];
}

function liveDateTip(pin: CafeMapPin): string {
  const perks = communityPerks(pin);
  const perkText =
    perks.length > 0 ? ` Community-reported ${perks.join(" and ")}.` : "";

  return `${pin.name} is a real spot ${distanceOf(pin)} from you.${perkText} Vibe details fill in as people check in.`;
}

function liveDatePlan(
  inputs: DatePlanInputs,
  variant: number,
  pins: CafeMapPin[],
): DatePlan {
  const ranked = [...pins].sort(
    (a, b) => dateMoodScore(b, inputs.mood) - dateMoodScore(a, inputs.mood),
  );
  // Shuffle rotates through the ranked cafes, mirroring the fixture rotation.
  const pin = ranked[variant % ranked.length];

  return {
    cafeId: pin.id,
    name: pin.name,
    meta: pin.meta,
    tone: pin.tone,
    steps: liveDateSteps(pin),
    tip: liveDateTip(pin),
  };
}

export function planDate(inputs: DatePlanInputs, variant = 0): DatePlan {
  const liveCafes = getCachedLiveCafes();

  return liveCafes.length > 0
    ? liveDatePlan(inputs, variant, liveCafes)
    : createDatePlan(inputs, variant);
}

// ---------------------------------------------------------------- route plan

function routeMoodScore(pin: CafeMapPin, moodId: RouteMoodId): number {
  if (moodId === "work") {
    return pin.moodScores.work;
  }

  if (moodId === "outdoor") {
    return (hasOutdoor(pin) ? 5 : 0) + pin.moodScores.aesthetic;
  }

  if (moodId === "specialty") {
    return (isSpecialty(pin) ? 5 : 0) + pin.moodScores.aesthetic;
  }

  // aesthetic / date.
  return pin.moodScores.aesthetic;
}

// Order the chosen stops into a sensible hop: start at the best-fit cafe, then
// always continue to the closest unvisited one, so the route doubles back as
// little as possible and its distance means something.
export function nearestNeighborOrder(pins: CafeMapPin[]): CafeMapPin[] {
  if (pins.length <= 2) {
    return [...pins];
  }

  const [start, ...rest] = pins;
  const ordered = [start];
  let remaining = [...rest];
  let current = start;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    remaining.forEach((candidate, index) => {
      const distance = distanceMiles(current, candidate);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    current = remaining[bestIndex];
    ordered.push(current);
    remaining = remaining.filter((_, index) => index !== bestIndex);
  }

  return ordered;
}

// Real walking distance across the arc, not an estimate per stop.
export function totalRouteMiles(pins: CafeMapPin[]): number {
  let total = 0;

  for (let index = 1; index < pins.length; index += 1) {
    total += distanceMiles(pins[index - 1], pins[index]);
  }

  return total;
}

function liveStopNote(pin: CafeMapPin): string {
  const perks = communityPerks(pin);
  const specialty = isSpecialty(pin) ? "Tagged specialty coffee." : "";
  const perkText =
    perks.length > 0 ? ` Community-reported ${perks.join(" and ")}.` : "";

  return `${pin.meta}.${specialty ? ` ${specialty}` : ""}${perkText}`.trim();
}

function liveVibeSummary(pins: CafeMapPin[], miles: number): string {
  const wifiCount = pins.filter(hasWifi).length;
  const outdoorCount = pins.filter(hasOutdoor).length;
  const notes = [
    `${miles.toFixed(1)} mi across ${pins.length} real cafes near you`,
    wifiCount > 0 ? `${wifiCount} with Wi-Fi reported` : null,
    outdoorCount > 0 ? `${outdoorCount} with outdoor seating` : null,
  ].filter((note): note is string => note !== null);

  return `${notes.join(" · ")}. Vibe details fill in as people check in.`;
}

function liveRoute(
  inputs: RoutePlannerInputs,
  pins: CafeMapPin[],
): GeneratedRoute {
  const stopCount = clampStopCount(inputs.stopCount);
  const bestFit = [...pins]
    .sort((a, b) => routeMoodScore(b, inputs.moodId) - routeMoodScore(a, inputs.moodId))
    .slice(0, stopCount);
  const ordered = nearestNeighborOrder(bestFit);
  const miles = totalRouteMiles(ordered);

  const stops: RouteStop[] = ordered.map((pin, index) => ({
    cafeId: pin.id,
    name: pin.name,
    role: routeRoleForIndex(index),
    note: liveStopNote(pin),
    tone: pin.tone,
  }));

  return {
    title: "Café Route Nearby",
    subtitle: routeSubtitle(inputs),
    distanceLabel: `${miles.toFixed(1)} mi ${routeTransportVerb(inputs.transportId)}`,
    durationLabel: routeDurationLabel(inputs.durationId),
    stopsLabel: `${stops.length} stops`,
    vibeSummary: liveVibeSummary(ordered, miles),
    stops,
  };
}

export function planRoute(inputs: RoutePlannerInputs): GeneratedRoute {
  const liveCafes = getCachedLiveCafes();

  return liveCafes.length > 0 ? liveRoute(inputs, liveCafes) : generateRoute(inputs);
}

// Every real way this cafe beats the stop being replaced, strongest first. The
// swap reason has to say why you'd trade *this* stop for it, so each signal is
// a comparison against that stop rather than a fact about the cafe alone.
function advantagesOver(pin: CafeMapPin, anchor: CafeMapPin): string[] {
  return [
    isSpecialty(pin) && !isSpecialty(anchor) ? "Better coffee" : null,
    hasOutdoor(pin) && !hasOutdoor(anchor) ? "More outdoor" : null,
    pin.moodScores.noise < anchor.moodScores.noise ? "Quieter" : null,
    pin.moodScores.aesthetic > anchor.moodScores.aesthetic
      ? "More aesthetic"
      : null,
    hasWifi(pin) && !hasWifi(anchor) ? "Wi-Fi reported" : null,
  ].filter((advantage): advantage is string => advantage !== null);
}

function liveStopAlternatives(
  excludeIds: string[],
  anchorId: string | undefined,
  pins: CafeMapPin[],
): RouteAlternative[] {
  const anchor =
    pins.find((pin) => pin.id === anchorId) ??
    pins.find((pin) => excludeIds.includes(pin.id)) ??
    pins[0];
  // Give each alternative a different headline advantage where it has one, so
  // the list reads as a real choice instead of three identical labels.
  const claimed = new Set<string>();

  return pins
    .filter((pin) => !excludeIds.includes(pin.id))
    .slice(0, MAX_ALTERNATIVES)
    .map((pin) => {
      const advantages = advantagesOver(pin, anchor);
      const reason =
        advantages.find((advantage) => !claimed.has(advantage)) ??
        advantages[0] ??
        "Also nearby";
      claimed.add(reason);

      const detourMinutes = Math.max(
        1,
        Math.round(distanceMiles(anchor, pin) * WALK_MINUTES_PER_MILE),
      );

      return {
        cafeId: pin.id,
        name: pin.name,
        meta: pin.meta,
        reason,
        detour: `+${detourMinutes} min`,
        tone: pin.tone,
      };
    });
}

// `anchorId` is the stop being replaced: swap reasons and the detour are both
// measured against it.
export function planStopAlternatives(
  excludeIds: string[] = [],
  anchorId?: string,
): RouteAlternative[] {
  const liveCafes = getCachedLiveCafes();

  if (liveCafes.length === 0) {
    return getStopAlternatives();
  }

  const alternatives = liveStopAlternatives(excludeIds, anchorId, liveCafes);

  // Every nearby cafe is already on the route — keep the curated pool rather
  // than showing an empty swap list.
  return alternatives.length > 0 ? alternatives : getStopAlternatives();
}
