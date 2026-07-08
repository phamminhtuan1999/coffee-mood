# US-013 Discovery loading, empty, denied, AI-down states

## Status

implemented

## Lane

normal

## Product Contract

Map discovery always shows a designed state: skeleton pins while loading, expand-search empty state, location-denied recovery, AI-unavailable fallback.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- Copy and CTAs exactly per discovery.md system states.
- Skeleton photo pins and soft loading cards; no spinner-only screens.
- Location denied offers both Choose Location and Enable Location paths.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: Section H - System States: 'Loading map cafes' skeleton + shimmer, 'No cafes nearby', 'Location is off', 'AI is resting' cards
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - Section H covers these as designed state cards (copy + pattern). In-context full-map variants can be derived from B1 + the cards.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces (all on map home in `src/app/index.tsx`):
  - Loading: skeleton photo pins over the map plus a soft LoadingSkeleton
    card ("Loading map cafes" / "Pouring the map…"), 900ms before ready;
    never spinner-only.
  - Empty: EmptyStateCard "No cafe vibes found nearby." / "Try expanding
    your distance or choosing another neighborhood." with Expand Search
    CTA that clears the vibe chip and resets filters (shows whenever chip
    + advanced filters exclude every pin).
  - Location denied: recovery card ("Location is off.", caution motif,
    copy from Section H) with both Choose Location (routes to manual
    location search) and Enable Location (re-requests permission) per
    discovery.md; also triggered organically when foreground permission is
    already denied and no location was selected.
  - AI unavailable: existing ai-finder coffee-break fallback with Browse
    Map CTA (US-011); copy contract asserted in tests.
- Copy follows discovery.md exactly, modulo the app-wide unaccented
  "cafe" convention established in US-011.
- `?discovery=loading|empty|denied` QA deep-link param on the map route
  forces each state for simulator smoke (same pattern as the ai-finder
  `?prompt=` param).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-013 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Verify command configured: `npm run lint && npx tsc --noEmit &&
  npx jest map-discovery-states ai-finder`.

## Evidence

- `npm run lint` passed; raw `npx tsc --noEmit` passed.
- 8 jest tests pass in `src/app/__tests__/map-discovery-states.test.tsx`,
  rendering the full Index route with the real filter engine: skeleton +
  loading card then loaded pins, QA override holds loading, designed empty
  state with Expand Search recovery, denied card with both CTAs (Choose
  Location routes to manual search, Enable Location re-request dismisses),
  organic detection of already-denied permission, active-filter badge with
  filtered pins, and the exact coffee-break copy contract. The ai-finder
  suite covers the AI-down fallback CTA. Full suite: 101 tests.
- `scripts/bin/harness-cli story verify US-013` passed.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 (decision 0012)
  using the `?discovery=` QA param: loading (skeleton pins + card), empty
  ("No cafe vibes found nearby." + Expand Search), and location denied
  ("Location is off." + Choose Location / Enable Location) all rendered
  within safe areas. Screenshots:
  `/tmp/cafemood-ios-simulator-us013-loading.png`,
  `/tmp/cafemood-ios-simulator-us013-empty.png`,
  `/tmp/cafemood-ios-simulator-us013-denied.png`.
- Interactive tap-through (Expand Search recovery, Enable Location prompt)
  is covered by jest; the human manual pass per decision 0012 remains the
  outstanding interaction proof (backlog #2).
