# US-003 Photo map pin and bottom sheet shells

## Status

implemented

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
- Commands / Queries / API / Tables: none for this foundation story.
- `PhotoMapPin` covers default, selected, scored, and saved bookmark states.
- `ClusteredPhotoPin` derives the grouped marker from the B1 map context.
- `CafeBottomSheetShell` exposes collapsed, half, and expanded snap-point
  shells without integrating a bottom-sheet runtime. Decision 0008 remains
  proposed; actual provider/library adoption is deferred until a story needs
  draggable sheet behavior or a real map provider.
- `MapPreviewSurface` provides the warm desaturated map-style shell using
  token-backed native views instead of a map SDK.
- `src/app/index.tsx` now shows the US-003 map shell in context and a small
  pin-state strip below the first viewport.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-003 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- `US-003` marked `in_progress` before implementation and verified through
  `scripts/bin/harness-cli story verify US-003`.

## Evidence

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `scripts/bin/harness-cli story verify US-003` passed.
- `rg` color scan found hard-coded colors and rgba values only inside
  `src/constants/theme.ts`, the intended token source.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 passed: warm map
  surface, photo pins, cluster marker, floating actions, and half bottom sheet
  rendered without visible clipping. Screenshot captured at
  `/tmp/cafemood-ios-simulator-us003.png`.
- 2026-07-07 proof-gap pass (intake #2, decision 0009): unit tests added in
  `src/components/ui/__tests__/photo-map-pin.test.tsx` (default/selected/saved
  states, score badge, cluster count, pin shadow token, press handling) and
  `cafe-bottom-sheet-shell.test.tsx` (32px top radius, drag handle,
  collapsed/half/expanded content, handle-tap snap cycling, save action).
  `SheetPill` rgba literals were tokenized as
  `theme.colors.surface.positiveSoft`/`cautionSoft` (same rendered values) so
  the no-hard-coded-colors scan holds repo-wide. Unit proof recorded with
  `story update --id US-003 --unit 1`; `story verify US-003` passes.
