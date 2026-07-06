# US-001 Design tokens and theme foundation

## Status

implemented

## Lane

normal

## Product Contract

App exposes the Ambient Editorial Map token set (colors, type scale, spacing, radius, shadows) as the single theme source.

## Relevant Product Docs

- `docs/product/design-system.md`

## Acceptance Criteria

- All color/spacing/radius/shadow/type tokens from docs/product/design-system.md exist in one theme module (extends src/constants/theme.ts).
- No screen uses hard-coded one-off colors; tokens only.
- Serif (editorial) + sans (UI) font pairing wired via expo-font.
- 8-point spacing scale and 20px screen padding constants exported.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: token sheet (colors, type, spacing, radius, shadows)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Tokens also appear inline throughout the Complete App file; the token sheet is authoritative.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: CafeMood Design System (token sheet)
- Commands / Queries / API / Tables: none for this foundation story.
- Implemented in `src/constants/theme.ts` with Ambient Editorial Map color,
  typography, spacing, radius, shadow, and map-style tokens.
- Font pairing is loaded through `expo-font` in `src/app/_layout.tsx` using
  Inter for UI text and Playfair Display for editorial display text.
- `src/app/index.tsx` now acts as a small token preview and uses exported theme
  tokens instead of one-off visual values.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-001 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Durable story matrix seeded from all 28 planned story packets.
- `US-001` marked `in_progress` before implementation and verified through
  `scripts/bin/harness-cli story verify US-001`.

## Evidence

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `scripts/bin/harness-cli story verify US-001` passed.
- Playwright web smoke at `http://localhost:8082` passed: expected token
  preview text rendered, no framework overlay, no console errors, no page
  errors.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 passed: app opened from
  Metro, rendered the token preview, and fit the native screen without content
  overlap. Screenshot captured at `/tmp/cafemood-ios-simulator-us001.png`.
- `rg` scan found hard-coded colors, rgba values, shadows, and font sizes only
  inside `src/constants/theme.ts`, the intended token source.
