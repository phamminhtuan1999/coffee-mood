# US-010 Search with semantic queries and visual results

## Status

implemented

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
- Implemented a semantic search fixture model with recent searches, suggested
  searches, token matching, editorial visual cards, score badges, match
  reasons, and mini map preview pins.
- Kept the Expo Router route file thin by moving the screen body into
  `src/components/search/search-screen-content.tsx`.
- Empty state uses the required "No match for that vibe." copy with a Reset
  Filters CTA.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-010 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Added `src/data/search-fixtures.ts` as the local semantic result fixture
  source until live search APIs are introduced.

## Evidence

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `scripts/bin/harness-cli story verify US-010` passed.
- iPhone simulator smoke captured at
  `/tmp/cafemood-ios-simulator-us010-search.png`.
- Search input alignment follow-up captured at
  `/tmp/cafemood-ios-simulator-us010-input-align.png`.
