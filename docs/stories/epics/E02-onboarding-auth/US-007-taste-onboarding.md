# US-007 Taste onboarding and profile capture

## Status

implemented

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
- Taste profile schema is documented for the local app-facing slice. Backend
  sync remains future data-model work.

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
- Commands / Queries / API / Tables: no backend commands, API, or tables are
  introduced in this slice.
- `src/app/index.tsx` now renders Taste Onboarding after location selection and
  routes `Build My Cafe Map` to a main-map handoff shell.
- `src/utils/taste-profile.ts` persists guest/local answers with schema:
  `cafeTypes`, `priorities`, `distance`, `price`, `skipped`, `updatedAt`.
- Four question groups are implemented: cafe type, priorities, distance, and
  price. Cafe type and priorities are multi-select; distance and price are
  single-select.
- Skip is supported and persists a `skipped: true` local profile marker so
  guest users are not blocked before map discovery.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-007 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Intake #11 recorded for US-007 as normal lane.
- Durable story verify command set to `npm run lint && npx tsc --noEmit`.
- PR is stacked on US-005 while PR #6 is still open, because US-007 depends on
  the Auth -> Location -> Taste route introduced by US-005/US-006.

## Evidence

Implemented taste onboarding, local profile persistence, skip path, and main-map
handoff. Verification passed: `npm run lint`; `npx tsc --noEmit`;
`scripts/bin/harness-cli story verify US-007`; `git diff --check`. iPhone 15
Pro simulator smoke via Expo Go on iOS 17.2 rendered the onboarding flow after
US-007 changes; screenshot: `/tmp/cafemood-ios-simulator-us007.png`.
Interaction automation remains limited by backlog #2, so the taste screen,
skip path, and main-map handoff are covered by static route/state validation in
this pass.
