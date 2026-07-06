# US-003 Photo map pin and bottom sheet shells

## Status

planned

## Lane

normal

## Product Contract

Map-specific primitives - circular photo pin, clustered photo pin, cafe preview bottom sheet shell - exist as reusable components with all visual states.

## Relevant Product Docs

- `docs/product/design-system.md`
- `docs/product/discovery.md`

## Acceptance Criteria

- Photo pin: circular thumbnail, warm border, score badge; default / selected (larger) / saved (bookmark) states.
- Cluster pin variant for grouped cafes.
- Bottom sheet shell: 32px top radius, drag handle, collapsed/half/expanded snap points (library per decision 0008).
- Pin shadow token applied; renders on the warm map style.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: PhotoMapPin, CafeBottomSheet
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B1 - Main Map Home (pin + sheet in context)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- **Design gap**: Clustered photo pin has no dedicated frame; derive from B1.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Photo Map Pin; Clustered Photo Pin; Cafe Preview Bottom Sheet
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-003 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
