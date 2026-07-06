# US-023 Saved cafes library

## Status

planned

## Lane

normal

## Product Contract

Saved feels like a personal coffee map: collection tabs, map/grid/list view modes (map or grid default), rich cards with quick actions.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Tabs: Want to Try, Work Spots, Date Spots, Aesthetic, Visited; view modes Map / Grid / List.
- Card: photo, name, tags, distance, score, collection label, quick actions (Directions, Remove, Share).
- Empty state 'Your coffee map is empty.' with Explore Cafes CTA.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: D2 - Saved Cafes
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Saved Cafes Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-023 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
