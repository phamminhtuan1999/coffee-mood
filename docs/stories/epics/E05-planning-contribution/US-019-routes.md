# US-019 Mood route planner, route detail, replace stop

## Status

planned

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

- UI surfaces: Mood Route Planner Screen; Route Detail Screen; Replace Route Stop Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-019 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

None yet.

## Evidence

None yet - story is planned, not selected for implementation.
