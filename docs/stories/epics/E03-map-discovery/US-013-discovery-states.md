# US-013 Discovery loading, empty, denied, AI-down states

## Status

planned

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

- UI surfaces: Map Loading State; No Cafes Nearby State; Location Denied State; AI Unavailable State
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

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

None yet.

## Evidence

None yet - story is planned, not selected for implementation.
