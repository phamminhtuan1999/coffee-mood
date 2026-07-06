# US-014 Cafe detail screen with scores and states

## Status

planned

## Lane

normal

## Product Contract

Detail screen answers 'is this cafe right for my mood' with carousel, score cards, amenity details, AI summary, editorial sections, and action row - plus loading/error/limited-data states.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- All content blocks per cafe-detail.md in order; Mostra Coffee reference renders (scores 9.1/8.8/6.5/7.2).
- Actions: Save, Directions, Share, Add to Route, View Photos, Open in Google Maps.
- Skeleton loading, error-with-retry, and limited-data notice states included.
- Long cafe names and missing images handled.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: C1 - Cafe Detail; Section H - 'Cafe detail' loading skeleton card, error state cards
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: 03 - Cafe Detail (early MVP reference)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Detail states exist as Section H pattern cards; compose them onto the C1 layout at implementation time. 'Limited vibe data' copy lives in docs/product/cafe-detail.md.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Cafe Detail Screen; Detail Loading / Error / Limited Data States
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-014 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
