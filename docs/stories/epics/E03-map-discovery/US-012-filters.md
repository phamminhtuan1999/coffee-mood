# US-012 Advanced filters as mood tuning

## Status

implemented

## Lane

normal

## Product Contract

Filters read as mood tuning (chips, sliders, warm grouped cards) covering the full facet list in discovery.md, with Apply and Reset.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- All facets present and grouped: distance, open now, price, rating, aesthetic/work score, noise, parking, Wi-Fi, outlets, outdoor, groups, dates, specialty, matcha, dessert, late night.
- Apply returns to the map with filters applied and visibly active.
- Reset clears to defaults.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B4 - Advanced Filters
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Advanced Filters Screen (`src/app/filters.tsx`, "Tune your
  map" per frame B4) reached from the slider icon in the map-home search
  bar; the icon shows an active-count badge when filters are tuned.
- Filter model: pure engine in `src/utils/map-filters.ts` (types, defaults,
  `applyMapFilters`, `activeMapFilterCount`, hint labels) plus a
  localStorage-backed store in `src/utils/map-filters-store.ts`
  (`cafemood.map-filters.v1`, same idiom as the taste profile); map home
  subscribes via `useSyncExternalStore`.
- Facet coverage (all 16 from discovery.md): distance slider (5-30 min,
  30 renders "Anywhere"), needs chips (open now, parking, Wi-Fi, outlets,
  outdoor seating, late night, good for groups), mood sliders (aesthetic
  min, work min, noise max with any/quiet-ish/moderate hints), price
  segment ($ / $$ / $$$, tap again to clear), treats chips (specialty
  coffee, matcha, dessert, good for dates, high rating - the last maps to
  overall score >= 8.5).
- Pin fixtures moved to `src/data/map-pins.ts` and extended with facet data
  (walkMinutes, needs, moodScores, price, treats) so filters genuinely
  filter; `MoodSlider` added to the UI kit (responder-based track with
  accessibility increment/decrement actions).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-012 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Verify command configured: `npm run lint && npx tsc --noEmit &&
  npx jest map-filters mood-slider src/app/__tests__/filters.test.tsx`.
- jest-setup.ts now mocks react-native-safe-area-context with the
  library's official jest mock (needed by any screen using insets).

## Evidence

- `npm run lint` passed; raw `npx tsc --noEmit` passed.
- 23 jest tests pass across the filter engine (every facet, combinations,
  empty result, hint labels, active count), MoodSlider (touch mapping,
  clamping, accessibility actions), and the filters screen (all 16 facets
  render, apply persists + returns to map, price toggle-off, header reset,
  stored-filters hydration). Map-home integration (active-count badge,
  pins filtered, badge routes to /filters) is covered in
  `src/app/__tests__/map-discovery-states.test.tsx`. Full suite: 101 tests.
- `scripts/bin/harness-cli story verify US-012` passed.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 (decision 0012):
  Tune your map screen rendered per frame B4 (header with Reset, distance
  card, needs chips, mood-level sliders with hints, sticky Reset/Apply
  footer) within safe areas. Screenshot:
  `/tmp/cafemood-ios-simulator-us012-filters.png`.
- Interactive tap-through (chip toggles, slider drag, Apply returning to a
  visibly filtered map) is covered by jest; simulator tap automation is
  still blocked (backlog #2), so the human manual pass per decision 0012
  is the remaining interaction proof.
