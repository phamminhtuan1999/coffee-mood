# US-016 Review insight screen

## Status

implemented

## Lane

normal

## Product Contract

Reviews are summarized into editorial insight sections (love / complain / best for / not ideal / best time) - smart editorial, not chatbot output.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- Five sections with example content per cafe-detail.md.
- Uses AI summary card components from US-002.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: C3 - Review Insights
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- New nested route `src/app/cafe/[id]/insights.tsx` renders frame C3:
  serif "What people say" header, "Summarized from 480 reviews · updated
  this week" caption, People love / People complain about bar cards,
  Best for / Not ideal for chip columns, and "The short version" card.
- The five sections map to cafe-detail.md's contract: love, complain,
  best for, not ideal for, and best time (the best-time guidance lives in
  the short-version editorial line, per the C3 frame).
- "The short version" reuses `AISummaryCard` from US-002 with a custom
  eyebrow, satisfying the component-reuse acceptance criterion.
- Insight data lives in `src/data/review-insights.ts` keyed by pin id.
  Mostra mirrors the design reference exactly (92/88/81 love, 46/38/24
  complaints, Ray St short version); Marigold & Oak and Terrace &
  Thistle carry data consistent with their pin fixtures (work spot /
  garden patio). Hearth stays the limited-data cafe with no summary.
- Percentage bars are real progress elements: `accessible` Views with
  `accessibilityRole="progressbar"` and `accessibilityValue` 0-100, fill
  width driven by the pct value, `score.great` / `score.crowded` tones.
- Chip ink colors from the frame (`#445238`, `#8C4A31`) were added as
  theme tokens `score.greatInk` / `score.crowdedInk`; bar tracks reuse
  `surface.borderSoft` (design 0.07 alpha vs token 0.08).
- Entry point: the cafe detail screen's editorial section gained a
  pressable "What people say" row (with per-cafe review count) after the
  People love / Watch out for chips, pushing `/cafe/[id]/insights` —
  same pattern as View Photos → gallery. Hidden for limited-data cafes,
  whose detail screen already suppresses editorial content.
- Cafes without a summary (Hearth, unknown ids) get a still-learning
  card ("We're still learning what people say about this spot.") instead
  of empty sections; deep-linking `/cafe/hearth/insights` exercises it.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-016 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/review-insights.test.ts`, `src/app/__tests__/review-insights.test.tsx`, insights-entry cases in `src/app/__tests__/cafe-detail.test.tsx` |
| Integration | Detail → insights navigation covered in `cafe-detail.test.tsx` (push `/cafe/mostra/insights`) |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Harness Delta

None - existing intake, story, and trace flows fit; no friction found.

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run
  lint`, `rtk proxy npx jest` - 18 suites, 149 tests passing (14 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/cafe/mostra/insights` →
    `/tmp/cafemood-ios-simulator-us016-insights.png` (header, love and
    complaint bars with percentages, Best for / Not ideal for chips).
  - `--/cafe/hearth/insights` →
    `/tmp/cafemood-ios-simulator-us016-insights-empty.png`
    (still-learning card, "Hearth Supply Co. · no review summary yet").
- "The short version" card sits below the fold in the smoke screenshot;
  it is asserted in `review-insights.test.tsx` and reuses the proven
  US-002 `AISummaryCard`.
- Interactive tap-through (entry row → insights → back) remains part of
  the human manual pass per decision 0012 / backlog #2.
