# Exec Plan

## Goal

Put real cafes on the live map: the map home fetches actual cafes near the
user's location from OpenStreetMap and renders them as pins, so the map is no
longer limited to the four curated fixtures.

## Scope

In scope:

- OpenStreetMap Overpass API (`amenity=cafe` around a center) — free,
  keyless, no account; direct client fetch (no secret exists, so decision
  0008's server-side-keys rule is not implicated).
- Device location via `expo-location` when permission is granted; fall back
  to the San Diego fixture center when denied/unavailable/timeout.
- Mapping OSM tags to the existing `CafeMapPin` shape: real name, real
  coordinates, real street/distance meta, Wi-Fi/Outdoor tags from
  `internet_access`/`outdoor_seating`, deterministic hash-derived vibe
  scores (labeled honestly as estimates via the limited-data notice).
- Live cafes flow through the existing chips/filters/sheet unchanged.
- Cafe detail for live cafes renders the designed limited-data mode
  (US-014's `limited` contract) with real address/hours/Wi-Fi facts.
- Fixture fallback: any fetch/location failure leaves today's demo intact.

Out of scope:

- Photos, reviews, insights for live cafes (no source; detail is limited).
- Live cafes in AI finder candidates, planners, search, saved seeds
  (fixtures remain those surfaces' world).
- Overpass proxying/caching infra; offline persistence of live results.

## Risk Classification

Risk flags:

- External systems (Overpass API).
- Existing behavior (map home is the app's core, test-covered).
- Weak proof (live network data is nondeterministic; tests mock it).

Hard gates:

- External provider behavior → high-risk lane.

## Work Phases

1. Discovery: probed Overpass live (16 named cafes within 1.5 km of North
   Park; tags: name 16/16, opening_hours 11, internet_access 6,
   outdoor_seating 6, addr:street 14).
2. Design: decision 0024 (OSM Overpass, keyless client fetch, fixture
   fallback).
3. Validation planning: mocked-fetch unit/integration tests + live
   simulator smoke with a simulated location.
4. Implementation: `live-cafes` util + map home wiring + limited detail.
5. Verification: tsc, lint, jest, iPhone 15 Pro smoke (real Overpass data).
6. Harness update: story row, decision, trace, backlog/product docs.

## Stop Conditions

Pause for human confirmation if:

- Overpass fair-use limits make direct client calls untenable (would need a
  proxy — infra direction change).
- Live data would have to replace fixtures in surfaces beyond the map home.
- Validation must weaken (e.g. live smoke impossible from the simulator).
