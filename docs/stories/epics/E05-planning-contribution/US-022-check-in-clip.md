# US-022 Check-in vibe report and vibe clip

## Status

planned

## Lane

normal

## Product Contract

Post-visit users file a sub-20-second tactile vibe report and can optionally attach a photo/video vibe clip with tags.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Five quick questions with option chips per planning.md; Submit Vibe Report CTA.
- Vibe clip: upload photo/short video, vibe tags, optional note, Post Vibe Clip; photo-first, minimal friction.
- Reports feed vibe scores and confidence (documented when schema lands; user media implies storage + moderation flags).

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: F1 - Vibe Report; F2 - Add Vibe Clip
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Check-in / Vibe Report Screen; Add Vibe Clip Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-022 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
