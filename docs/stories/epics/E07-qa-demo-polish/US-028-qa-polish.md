# US-028 Full-app QA, prototype wiring, demo polish

## Status

implemented

## Lane

normal

## Product Contract

The complete app passes flow, visual, product, UX, and business QA per Batch 6: all six flows work end-to-end, tokens are consistent, no generic drift, demo-ready.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/design-system.md`
- `docs/product/onboarding.md`
- `docs/product/discovery.md`
- `docs/product/cafe-detail.md`
- `docs/product/planning.md`
- `docs/product/library-profile.md`

## Acceptance Criteria

- Six flow walkthroughs pass: first-time, core discovery, AI recommendation, search, route, profile.
- Visual QA: no one-off colors, duplicate components, or off-token styles anywhere.
- UX QA: touch targets, safe areas, keyboard overlap, long text, low-image data, guest-mode restrictions.
- Deliverable: QA summary - screens count, components count, flows wired, known gaps, risks, engineering notes.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: all frames A1-G3 + Section H state catalog
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: full component sheet
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: B5, B6, D4, D5, D6, E5, G4 gap-fill frames
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: early MVP reference
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: All 2026-07-06 design gaps resolved. Remaining polish candidates (not gaps): in-context full-map state frames, dedicated full-screen AI result.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: All screens / full prototype flows
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-028 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

None — QA used the established deep-link + `xcrun simctl` screenshot flow.

## Evidence

- QA summary deliverable: `US-028-qa-summary.md` (same folder) — screens,
  components, six-flow results, two defects found and fixed (collection-edit
  privacy switch idiom, profile settings emoji glyph), known gaps/risks.
- Walkthrough screenshots: `/tmp/qa28-*.png` (20 screens incl. fixed
  re-shots), iPhone 15 Pro Expo Go, 2026-07-10.
- Gate after fixes: tsc clean, eslint 0 errors, 49 suites / 332 jest tests
  green (Node 24).
- Live paths re-verified during QA: Groq AI finder result, Apple Maps home.
- Interactive tap-through passes remain pending human manual QA (backlog #2).
