# US-021 Date plan and results

## Status

implemented

## Lane

normal

## Product Contract

Users generate a tasteful coffee-date plan (cafe + optional walk/dessert + best time) from area, time, budget, and mood inputs.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Inputs and mood chips (Cozy, Aesthetic, Quiet, Fun, Outdoor); Create Date Plan CTA.
- Results: plan steps, best time, vibe summary; Save Plan / Share / Start Navigation.
- Subtle romantic tone; no cheesy hearts.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: E4 - Date Plan (includes result: 'Your plan' card with cafe, timeline steps, AI golden-hour tip, Shuffle / Save this plan)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - E4 contains inputs AND the generated plan on one scrolling screen.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Durable decision `docs/decisions/0017-defer-date-plan-providers-for-us-021.md`:
  Save this plan / Share / Start Navigation render but stay inert (plan
  persistence lands with the E06 library alongside Save Route per 0016, share
  per 0015, navigation per 0010). Shuffle is live - rotation needs no provider.
- One screen at `src/app/date.tsx` (route `/date`) matching E4: serif title
  "Plan a coffee date" + "Low-effort, high-charm.", the k/v input-card grid
  (Area / Time / Budget, tap-to-cycle presets), a Mood chip row (the five
  planning.md moods, single-select - chips are contractual even though E4
  renders inputs as k/v cards), the Create Date Plan CTA, and the generated
  "Your plan" card below on the same scroll.
- The plan card mirrors the E4 anatomy: eyebrow, 60px tone swatch + serif cafe
  name + meta line, a three-step timeline (terracotta dots + connector; every
  arc includes a dessert or walking stop per planning.md), the ✦ best-time
  vibe tip on `latteSoft` (Terrace mirrors the design copy: "Golden hour hits
  the patio at 4:40..."), and the Shuffle / Save this plan action row. Share /
  Start Navigation sit under the card as text actions.
- Data lives in `src/data/date-plan.ts`: mood/area/time/budget presets and
  `createDatePlan(inputs, variant)` - deterministic selection by mood over
  three pin-backed date profiles (Cozy/Aesthetic → Mostra, Quiet → Marigold,
  Fun/Outdoor → Terrace; no AI per decision 0013). Shuffle increments the
  variant and rotates through the remaining profiles without randomness;
  Create resets the rotation. Terrace meta uses the pin-truth price ($$$)
  rather than the design placeholder ($$), consistent with the US-018
  derive-from-fixtures precedent.
- Copy keeps the subtle-romantic contract: patio light, shared desserts,
  bookstore browsing - no hearts.
- QA deep link `?state=plan` renders the generated plan on load. Entry is
  deep-link only until the US-027 Plan tab (same provisional-entry situation
  as decisions 0016/0017 note).

## Harness Delta

- Durable decision 0017 recorded. No test-harness changes (screen-local state,
  no persistence).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-021 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/date-plan.test.ts` (options, mood selection, rotation, arc shape) |
| Integration | Input → create → shuffle → reset flows in `src/app/__tests__/date-plan.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 32 suites, 239 tests passing (12 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/date` → `/tmp/cafemood-ios-simulator-us021-inputs.png` (E4 inputs:
    Area/Time/Budget cards, five mood chips with Outdoor selected, Create
    Date Plan CTA).
  - `--/date?state=plan` → `/tmp/cafemood-ios-simulator-us021-plan.png`
    ("Your plan" card: Terrace & Thistle patio café, three timeline steps
    with the dessert and golden-hour walk stops, tip + actions below).
- Save this plan / Share / Start Navigation are the deferred provider layer
  (decision 0017). Interactive tap-through remains part of the human manual
  pass per decision 0012 / backlog #2.
