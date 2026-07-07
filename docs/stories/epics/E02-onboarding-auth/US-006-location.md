# US-006 Location permission primer and manual search

## Status

implemented

## Lane

normal

## Product Contract

Location is primed in-app before the OS dialog; privacy-conscious users can pick a city or neighborhood manually instead.

## Relevant Product Docs

- `docs/product/onboarding.md`

## Acceptance Criteria

- Primer: 'Find cafes near you' rationale; Use Current Location / Choose Manually; small map illustration with photo pins.
- Manual search: search-first layout, recent locations, popular neighborhoods (San Diego, Mira Mesa, La Jolla, North Park, Convoy), use-current-location link.
- Denied OS permission falls back gracefully to the manual path.
- Location is sensitive data: never in URLs or logs.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: A6 - Location Permission; A7 - Manual Location
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Location Permission Primer Screen; Manual Location Search Screen
- Commands / Queries / API / Tables: no backend commands, API, or tables are
  introduced in this slice.
- `src/app/index.tsx` now renders the Location Primer, requests foreground
  location only after "Use Current Location", falls back to Manual Location when
  permission is denied/unavailable, and hands off to US-007 taste onboarding.
- Manual Location includes a search-first layout, recent locations, popular
  neighborhoods, and a use-current-location link.
- Sensitive-data boundary: this slice requests permission but does not read,
  store, log, or put coordinates in URLs.
- `expo-location` is configured with an iOS foreground permission rationale in
  `app.json`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-006 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Intake #10 recorded for US-006 as normal lane.
- Durable story verify command set to `npm run lint && npx tsc --noEmit`.
- PR is stacked on US-005 while PR #6 is still open, because US-006 depends on
  the Auth -> Location Primer route introduced there.

## Evidence

Implemented location primer, foreground permission request, manual location
search, denied/unavailable fallback, and taste-onboarding handoff. Verification
passed: `npm run lint`; `npx tsc --noEmit`;
`scripts/bin/harness-cli story verify US-006`; `git diff --check`. iPhone 15
Pro simulator smoke via Expo Go on iOS 17.2 rendered the location primer safely
above the home indicator; screenshot:
`/tmp/cafemood-ios-simulator-us006-location.png`. Interaction automation remains
limited by the simulator tap gap recorded in backlog #2, so manual screen and
permission-denied transitions are covered by static route/state validation in
this pass.
