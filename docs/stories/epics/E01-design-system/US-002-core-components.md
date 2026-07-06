# US-002 Core UI component library

## Status

planned

## Lane

normal

## Product Contract

Reusable component kit (buttons, chips, search bar, badges, cards, skeletons) matching design-system components, with variants and no duplicated styles.

## Relevant Product Docs

- `docs/product/design-system.md`

## Acceptance Criteria

- Primary/Secondary/Icon buttons with pressed/disabled variants (18px radius, button shadow).
- Vibe chip and preference chip with selected states (999px radius, 13px label).
- Search bar, score badge (Great/Good/Crowded), AI summary card, cafe image card, collection card, empty state card, loading skeleton, filter row.
- Components live under src/components/ui with clear names; screens consume them without style overrides.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: Buttons (Primary / Secondary; Pressed / Disabled), VibeChip, ScoreBadge, CafeImageCard, RouteStopCard
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- **Design gap**: Search bar, AI summary card, collection card, empty state card, loading skeleton, and filter row have no dedicated spec frames - derive them from their in-context uses in the Complete App file.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: CafeMood Design System (components)
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-002 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
