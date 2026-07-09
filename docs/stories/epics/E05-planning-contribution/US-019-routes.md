# US-019 Mood route planner, route detail, replace stop

## Status

implemented

## Lane

normal

## Product Contract

Users generate a cafe-hopping route from mood inputs and get a lifestyle itinerary (map line, numbered stops, notes) they can tweak stop-by-stop.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Planner inputs per planning.md: area, mood, duration, transport, stops; Generate Route CTA.
- Route detail: map with route line, 3 numbered stops, travel time, distance, parking notes, vibe summary; Save / Replace Stop / Start Navigation / Share.
- Replace stop: alternatives with reasons (better parking / more aesthetic / quieter / better coffee); swap updates the route.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: E1 - Mood Route Planner; E2 - Route Detail (per-stop Replace affordance)
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: 04 - Visual Route (early MVP reference)
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: E5 - Replace Route Stop (current stop, 3 alternatives with reason + detour chips, interactive selection, Replace / Keep current)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Durable decision `docs/decisions/0016-defer-route-providers-for-us-019.md`:
  the full three-screen flow ships with a deterministic route generator, but
  Start Navigation / Save Route / route Share / planner Change stay inert until
  their providers land (map/navigation per 0010, route persistence in E06,
  share per 0015; extends 0008). Route generation is deterministic from fixtures
  (no live AI/routing - consistent with 0013).
- Three screens live under the `/route` segment:
  - `src/app/route/index.tsx` (E1) - planner: starting area card, mood chips
    (single-select), Duration/Transport segmented rows, a stop stepper
    (2-4 clamped), and the Generate Route CTA. Selections are local draft state;
    Generate commits them to the store and navigates to the detail.
  - `src/app/route/detail.tsx` (E2) - route detail: back + share, serif title,
    input-derived subtitle, distance/duration/stops meta chips, the
    `RouteMapPreview`, a vibe-summary card, and a numbered stop timeline where
    each stop has a Replace affordance. Save Route / Start Navigation bottom bar.
  - `src/app/route/replace.tsx` (E5) - replace stop: current-stop dashed card,
    three reasoned alternatives (reason + detour chips) with radio selection,
    Keep current / Replace Stop (disabled until a choice is made). Replacing
    swaps the stop in the store and the detail reflects it reactively.
- `RouteMapPreview` (`src/components/ui/route-map-preview.tsx`) draws the map
  line without react-native-svg: connector Views are computed from fixed pin
  coordinates (design E2 viewBox) via length/angle geometry, with numbered pins
  sized to the stop count.
- Data lives in `src/data/route-plan.ts` (moods/durations/transports, the
  curated arc sliced to the stop count, input-driven copy, reasoned
  alternatives) and the ephemeral reactive store
  `src/utils/route-planner-store.ts` (in-memory only - a generated route is
  session state, not a persisted preference; persistence arrives with Save
  Route). The swap preserves the original stop's route role.
- Entry: the cafe detail "Add to Route" action (previously inert) opens the
  planner - provisional until the US-027 Plan tab. QA deep links: `/route`,
  `/route/detail`, `/route/replace?stop=N`.
- Copy uses the accented "café" from the design prototype for route-domain
  strings (planner/detail headings) rather than the app-wide unaccented "cafe";
  matched to the E1/E2 visual contract.

## Harness Delta

- Durable decision 0016 recorded. No test-harness changes needed (the route
  store is in-memory, so the existing jest localStorage harness is untouched).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-019 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/route-plan.test.ts`, `src/utils/__tests__/route-planner-store.test.ts`, `src/components/ui/__tests__/route-map-preview.test.tsx` |
| Integration | Planner → detail → replace flows in `src/app/__tests__/route-planner.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 28 suites, 214 tests passing (23 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/route` → `/tmp/cafemood-ios-simulator-us019-planner.png` (E1 planner:
    starting area, mood chips with Aesthetic selected, Duration/Transport
    segmented rows, stop stepper at 3, Generate Route).
  - `--/route/detail` → `/tmp/cafemood-ios-simulator-us019-detail.png` (E2:
    Saturday Café Route, meta chips, route map line + numbered pins, vibe
    summary, Mostra/Fernway stop timeline with Replace, Save Route / Start
    Navigation).
  - `--/route/replace?stop=1` →
    `/tmp/cafemood-ios-simulator-us019-replace.png` (E5: "Replace stop 2",
    Fernway Bakes current-stop dashed card, three reasoned alternatives with
    reason + detour chips and radios, Keep current / disabled Replace Stop).
- Start Navigation / Save Route / route Share / Change are the deferred provider
  layer (decision 0016). Interactive tap-through remains part of the human
  manual pass per decision 0012 / backlog #2.
