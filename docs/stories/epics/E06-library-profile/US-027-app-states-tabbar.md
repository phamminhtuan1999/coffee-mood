# US-027 App-wide states and bottom tab bar

## Status

planned

## Lane

normal

## Product Contract

Every surface has designed empty/loading/error states (per the library-profile.md catalog) and the 5-tab bottom bar ties the app together.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Six empty states, five loading patterns, five error states with the exact copy.
- Bottom tab bar: Map, Search, Saved, Routes, Profile; clear selected states; safe-area correct.
- Offline state surfaces saved cafes.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: Section H - System States (6 empty-state cards, 4 loading skeletons, 4 error cards); tab bar in context on B1 / D2 / G2
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: B5 - tab bar in context
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - Section H is the app-wide state catalog. States are design cards, not full frames; compose per-surface at implementation time.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: App-wide Empty States; App-wide Loading States; App-wide Error States; Bottom Tab Bar
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-027 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
