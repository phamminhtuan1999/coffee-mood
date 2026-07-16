# US-036 Planners build on the real nearby cafes

## Status

implemented

## Lane

normal

## Product Contract

The work, date, and route planners plan around the **real** cafes near the user
(the live OpenStreetMap pins from US-031) instead of the four curated fixtures.
The route measures its **real** walking distance between stops and offers
**real** nearby cafes as swap alternatives. Fixtures remain the cold-cache /
offline fallback, the same live/fixture split the map (0024), AI finder (0026),
and search (US-035) use.

## Origin

Hard-code audit follow-up (intake #30), the second surface the user picked after
US-035. All three planners were fixture-only, and the route arc referenced cafes
that existed nowhere else in the app (`fernway`), with swap alternatives
(`bluevine`, `petal`, `quietbird`) that were pure inventions.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- `planWorkSpots` / `planDate` / `planRoute` / `planStopAlternatives`
  (utils/planner-cafes) build from `getCachedLiveCafes()` when the map cache is
  warm; each falls back to its fixture planner on a cold cache. No network call;
  all derivation is local.
- Live work results report only what OSM knows: Wi-Fi Reported/Not reported,
  **Outlets "Not reported"** (OSM has no outlet data — never invented), and the
  US-031 noise estimate explicitly labelled `(est.)`.
- The live route sequences stops nearest-neighbour from the best mood fit and
  reports the **real summed distance** between them, replacing the fixture's
  flat `perStop × stopCount` estimate.
- Live swap alternatives are real nearby cafes not already on the route, with
  the reason and detour measured **against the stop being replaced**, and
  distinct headline reasons where a cafe has more than one advantage.
- Every existing planner test stays green unchanged (cold cache → fixtures).

## Design Notes

- Commands: none.
- Queries: `planWorkSpots`, `planDate`, `planRoute`, `planStopAlternatives`.
- API: none — reuses the US-031 OSM cache; no new provider or secret.
- Domain rules: `workRank`/`meetsNeed` (data/work-planner) and
  `routeSubtitle`/`routeDurationLabel`/`routeTransportVerb`/`routeRoleForIndex`
  (data/route-plan) are shared by the fixture and live paths so both rank and
  read identically. `distanceMiles` is exported from utils/live-cafes for the
  route's real geometry.
- Copy rule: live planner copy is derived from real OSM signals (name, street,
  Wi-Fi, outdoor seating, specialty tag, distance) and the app's established
  limited-data idiom ("Vibe details fill in as people check in"). It is
  deliberately thinner than the fixtures' hand-written editorial rather than
  inventing per-cafe specifics that have no source.
- UI surfaces: `app/work.tsx`, `app/date.tsx`, `app/route/replace.tsx`,
  `utils/route-planner-store.ts`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `planner-cafes.test.ts`: cold→fixtures and warm→live for all four entry points; outlets never invented; real distance ≠ fixture estimate; nearest-neighbour ordering; distance summing; distinct swap reasons |
| Integration | Existing work/date/route planner suites stay green unchanged via the cold-cache fixture path |
| Platform | iPhone 15 Pro Expo Go smoke of all three planners + the swap screen over real cafes (screenshots) |

Per decision 0012, `implemented` requires both the automated checks and the
manual simulator pass; neither substitutes for the other.

## Harness Delta

No new decision — reuses decision 0024 (OSM cafes). Intake #30.

## Evidence

- 53 suites / 364 jest tests green (Node 24), tsc clean, eslint 0 errors. The
  349 pre-existing tests pass unchanged, proving the fixture path is intact.
- New coverage: `planner-cafes.test.ts` (15 tests) across all four entry points
  plus the exported route geometry helpers.
- Platform (iPhone 15 Pro Expo Go, simulated location 32.7466,-117.1297), after
  the map warmed the OSM cache:
  - Work — `/tmp/cafemood-ios-simulator-us036-work-live.png`: "Best overall:
    **Holsem Coffee** — estimated work score 8.2, Wi-Fi reported, 0.1 mi away",
    stats Reported / **Not reported** (outlets) / Lively (est.).
  - Date — `/tmp/cafemood-ios-simulator-us036-date-live.png`: the Outdoor mood
    picked **Bivouac Adventure Lodge Coffee Shop** (30th Street, 0.2 mi), which
    genuinely reports outdoor seating; each step cites a real signal.
  - Route — `/tmp/cafemood-ios-simulator-us036-route-live.png`: "Café Route
    Nearby", **0.6 mi walk** measured across 3 real cafes (the fixture would
    report a flat 1.2 mi), summary derived from real Wi-Fi/outdoor counts.
  - Replace — `/tmp/cafemood-ios-simulator-us036-replace-live.png`: real
    alternatives (Subterranean Coffee Boutique / Holsem Coffee / Caffè
    Calabria) excluding on-route cafes, reasons measured against "Gather".
- Known limitation: when a candidate's only genuine advantage over the replaced
  stop is one another candidate already claimed, the label repeats. That is
  deliberate — a truthful duplicate beats an invented distinct label. The
  no-advantage fallback is the neutral "Also nearby" rather than "Closer",
  which would assert an unverified comparison.
