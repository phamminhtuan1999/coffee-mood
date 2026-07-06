# US-015 Photo and video gallery

## Status

planned

## Lane

normal

## Product Contract

Pinterest-feel masonry gallery with vibe-tab filters and tap-to-detail, per cafe-detail.md.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- Tabs: Interior, Drinks, Seating, Outdoor, Work Setup, Date Vibe.
- Masonry grid, warm overlays, soft radius, photo vibe tags (Cozy, Bright, Crowded, Laptop-friendly, Aesthetic, Outdoor).
- Photo detail state on tap.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: C2 - Photo Gallery
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Photo / Video Gallery Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-015 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
