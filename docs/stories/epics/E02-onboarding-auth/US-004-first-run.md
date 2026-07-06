# US-004 First-run experience: splash, welcome, feature intro

## Status

planned

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
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-004 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
