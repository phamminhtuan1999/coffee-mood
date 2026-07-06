# US-007 Taste onboarding and profile capture

## Status

planned

## Lane

normal

## Product Contract

Users build a taste profile (cafe type, priorities, distance, price) through large tactile chips ending in 'Build My Cafe Map'; the profile feeds ranking.

## Relevant Product Docs

- `docs/product/onboarding.md`
- `docs/product/library-profile.md`

## Acceptance Criteria

- Four question groups per onboarding.md with multi-select chips and subtle selected states.
- Flow is skippable; guest answers persist locally until backend sync exists.
- CTA 'Build My Cafe Map' routes to Main Map.
- Taste profile schema gets documented when the data model is defined (data-model flag).

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: A8 - Taste Onboarding
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: 01 - Mood Onboarding (early MVP reference)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Taste Onboarding Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-007 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
