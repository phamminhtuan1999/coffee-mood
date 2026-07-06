# US-010 Search with semantic queries and visual results

## Status

planned

## Lane

normal

## Product Contract

Search supports plain and semantic vibe queries and returns editorial visual result cards with match reasons - never plain listing rows.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- Recent and suggested searches; semantic examples per discovery.md ('quiet cafe with parking', 'cute matcha place', ...).
- Result card: photo, name, distance, vibe tags, match reason, score badge; mini map preview section.
- Empty state 'No match for that vibe.' with Reset Filters CTA.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B2 - Search
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Search Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-010 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
