# US-004 First-run experience: splash, welcome, feature intro

## Status

implemented

## Lane

normal

## Product Contract

New users see splash -> welcome -> 3-slide feature intro communicating the product promise in under 10 seconds, with the guest path visible.

## Relevant Product Docs

- `docs/product/onboarding.md`

## Acceptance Criteria

- Splash: logo, tagline 'Find cafes by vibe.', warm map texture, soft reveal.
- Welcome: hero headline/subtitle per onboarding.md; Get Started + Explore as Guest; collage hero (cafe photo, map preview, pins, chips).
- Carousel: 3 slides (Explore visually / Match your mood / Save your coffee map), page dots, Skip, Continue.
- Explore as Guest routes to location primer, skipping auth.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: A1 - Splash; A2 - Welcome; A3 - Feature Intro (3 slides)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Splash Screen; Welcome Screen; Feature Intro Carousel
- Commands / Queries / API / Tables: none for this foundation story.
- `src/app/index.tsx` now hosts the first-run flow as an in-app state machine:
  splash -> welcome -> feature intro carousel -> location-primer handoff.
- The guest path is visible on the welcome screen and skips auth into a
  lightweight location-primer handoff. US-006 still owns the full location
  permission primer and manual-location search implementation.
- The feature intro carousel implements the three product slides from
  `docs/product/onboarding.md`: Explore visually, Match your mood, and Save
  your coffee map.
- The visuals reuse existing token-backed UI primitives from US-002/US-003,
  including `CafeButton`, `CafeImageCard`, `CollectionCard`,
  `MapPreviewSurface`, `PhotoMapPin`, and `VibeChip`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-004 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- `US-004` marked `in_progress` before implementation and verified through
  `scripts/bin/harness-cli story verify US-004`.

## Evidence

- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `scripts/bin/harness-cli story verify US-004` passed.
- `git diff --check` passed.
- `rg` color scan found hard-coded colors and rgba values only inside
  `src/constants/theme.ts`, the intended token source.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 passed: splash screen
  rendered with logo, tagline, warm map texture, and loading dots. Screenshot
  captured at `/tmp/cafemood-ios-simulator-us004.png`.
