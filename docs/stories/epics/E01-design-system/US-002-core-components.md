# US-002 Core UI component library

## Status

implemented

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
- Commands / Queries / API / Tables: none for this foundation story.
- Components are implemented under `src/components/ui` with one clear file per
  primitive and a barrel export in `src/components/ui/index.ts`.
- `src/app/index.tsx` now consumes the UI kit as a component showcase rather
  than hand-coding component internals on the screen.
- Search bar, AI summary card, collection card, empty state card, loading
  skeleton, and filter row were derived from their in-context uses in the
  Complete App and system-state frames.
- New component state colors were added to `src/constants/theme.ts` so visual
  values stay centralized.
- Scroll performance was tightened by removing non-copyable `selectable` text
  handlers and avoiding high-blur shadows on repeated scroll surfaces.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-002 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- `US-002` marked `in_progress` before implementation and verified through
  `scripts/bin/harness-cli story verify US-002`.

## Evidence

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `scripts/bin/harness-cli story verify US-002` passed.
- `rg` scan found hard-coded colors and rgba values only inside
  `src/constants/theme.ts`, the intended token source.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 passed after restarting
  Metro with a cleared cache: the Core UI Kit screen rendered buttons, chips,
  search bar, score badges, and AI summary card without visible overlap.
  Screenshot captured at `/tmp/cafemood-ios-simulator-us002.png`.
- Follow-up scroll responsiveness patch keeps button shadows for the component
  contract while removing expensive card/search/icon shadows from the scrolling
  showcase surfaces. Fresh simulator screenshot captured at
  `/tmp/cafemood-ios-simulator-us002-scroll-fix-fresh.png`.
- 2026-07-07 proof-gap pass (intake #2, decision 0011): component tests added
  under `src/components/ui/__tests__/` (`button.test.tsx`, `chip.test.tsx`,
  `ui-kit.test.tsx`) covering button variants/pressed/disabled behavior, chip
  selected/disabled states and the 13px label, and render contracts for search
  bar, score badge tones, AI summary card, cafe image card, collection card,
  empty state card, filter row, loading skeleton, map preview surface, and
  route stop card. `LoadingSkeleton` now sets `accessible` so its declared
  progressbar role is exposed to assistive tech. Unit proof recorded with
  `story update --id US-002 --unit 1`; `story verify US-002` passes.
