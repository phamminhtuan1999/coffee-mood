# US-009 Cafe preview bottom sheet states

## Status

implemented

## Lane

normal

## Product Contract

Selecting a pin presents the cafe preview sheet with collapsed, half, and expanded states per discovery.md, using the US-003 shell.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- Collapsed: name, main score, one-line vibe.
- Half: photo, name, tags, score row, AI summary, Save / Directions / View Photos.
- Expanded: more photos, why-it-matches, people love, watch out for, add to route.
- Drag and snap gestures feel native (Reanimated).

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B1 - Main Map Home (half-expanded sheet in context)
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: CafeBottomSheet (interactive collapsed / half / expanded component)
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: B5 - Sheet Collapsed (in context); B6 - Sheet Expanded (in context: photos, why it matches, people love, watch out for, Add to Route)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06: all three states now designed, both as component spec and in context.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Cafe Bottom Sheet - Collapsed; Cafe Bottom Sheet - Half Expanded; Cafe Bottom Sheet - Expanded
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.
- Implemented with the reusable `CafeBottomSheetShell` from US-003, now wired
  to the US-008 map home selected cafe state.
- The sheet supports collapsed, half, and expanded snap points with Reanimated
  height transitions and pan gestures through `react-native-gesture-handler`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-009 --unit 1 --integration 1 --e2e 0 --platform 0`.

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

Implemented collapsed, half, and expanded cafe preview sheet states. The map
home now uses the reusable `CafeBottomSheetShell`, tracks selected cafe snap
state, supports Reanimated height transitions, pan-to-snap gestures, tap-to-cycle
handle behavior, saved state, and expanded content for photos, why it matches,
people love, watch out for, and Add to Route. Verification passed: npm run
lint; npx tsc --noEmit; story verify US-009; git diff --check; iPhone 15 Pro
simulator smoke via Expo Go on iOS 17.2 rendered the half sheet with actions.
Screenshot: `/tmp/cafemood-ios-simulator-us009-half.png`. Interaction
automation remains limited by backlog #2, so snap interactions are covered by
Reanimated/Gesture static validation and first-render simulator proof.
