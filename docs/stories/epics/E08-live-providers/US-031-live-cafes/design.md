# Design

## Domain Model

- `src/utils/live-cafes.ts` owns the live data layer:
  - `fetchLiveCafes(center) → Promise<CafeMapPin[] | null>` — null on any
    failure (callers fall back to fixtures). Results are full `CafeMapPin`
    objects so every downstream surface (chips, filters, sheet, markers)
    works unchanged.
  - Module-level cache of the last successful fetch plus a side map of
    extras (street address, opening hours, Wi-Fi/outdoor flags) feeding
    `getLiveCafePin(id)` / `getLiveCafeDetail(id)` for the detail route.
  - Deterministic pseudo-scores: a stable string hash of the OSM id seeds
    Aesthetic/Coffee/Work scores (7.4–9.2) and mood scores, so re-renders
    and re-fetches keep identical numbers. Presented under the limited-data
    notice ("still learning about this spot") — not claimed as reviews.
- OSM tag mapping: `name` (required — unnamed cafes dropped), node `lat/lon`
  or way `center`; `internet_access` → Wi-Fi need/tag; `outdoor_seating` →
  Outdoor; `cuisine` containing coffee_shop → Specialty Coffee tag;
  `addr:street` + haversine distance → meta ("30th Street · 0.4 mi");
  distance → `walkMinutes`. Cap ~20 nearest, ids `osm-<type>-<id>`.

## Application Flow

- Map home (`MainMapHandoff`):
  1. Effect (skipped under `stateOverride`): resolve center — foreground
     permission granted → `Location.getCurrentPositionAsync` raced against a
     3 s timeout; else fixture center.
  2. `fetchLiveCafes(center)`; on non-empty success, store pins in state and
     `animateToRegion(regionForPins(livePins))`.
  3. `basePins = liveCafes ?? cafeMapPins` feeds the existing chip filter
     (`filterCafePins` gains a pins argument) and `applyMapFilters`.
  4. The "+3 more" cluster pin renders only in fixture mode (live density is
     real); selection falls back to the first visible pin as today.
  5. Current-location FAB re-centers to the active region (live or fixture).
- Cafe detail: `pin = fixtures.find(...) ?? getLiveCafePin(id)`; `detail =
  getCafeDetail(id) ?? getLiveCafeDetail(id)` where the live detail is a
  synthesized `CafeDetail` with `limited: true`, real facts (address, hours,
  Wi-Fi, outdoor), and hash-consistent scores. Unknown ids still error.
- `regionForPins(pins)` generalizes US-030's region math (exported from
  `map-pins.ts`, reused for `MAP_HOME_REGION`).

## Interface Contract

- Overpass request: POST `https://overpass-api.de/api/interpreter`, body
  `data=[out:json][timeout:10];nwr["amenity"="cafe"](around:1500,<lat>,<lng>);out center 30;`,
  `User-Agent: CafeMoodMap/1.0` (Overpass 406s without a UA). 12 s client
  abort. No auth, no key, no secret anywhere.
- Screen contracts unchanged: pins, sheet, `?discovery=` overrides,
  accessibility labels, detail `?state=` overrides.

## Data Model

No persistence; in-memory cache for the session only.

## UI / Platform Impact

- iOS Expo Go only (as all stories); simulator smoke uses
  `xcrun simctl location` to simulate a real position.
- Jest: `live-cafes` fetch is mocked (unit) and the module is mocked in the
  map-home integration test; existing suites see fixture mode (fetch
  unavailable → null → fallback), so no churn.

## Observability

- Fetch failures are silent by design (fixture fallback); no logging of
  location or place data anywhere.

## Alternatives Considered

1. Foursquare Places free tier: richer metadata but requires an account +
   key (Edge Function). Declined by the user; revisit if richer live detail
   is ever needed.
2. Google Places: billing-gated; rejected.
3. Proxying Overpass through a Supabase Edge Function: adds a hop and infra
   for no secret-hygiene gain (there is no key to hide); rejected for now.
