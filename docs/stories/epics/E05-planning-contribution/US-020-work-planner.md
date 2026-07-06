# US-020 Work session planner and results

## Status

planned

## Lane

normal

## Product Contract

Remote workers enter a work window and constraints and get ranked work-spot cards with confidence indicators and arrival advice.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Inputs: start/end time, Wi-Fi, outlets, quiet level, parking; Find Work Spots CTA; not calendar-app styled.
- Result cards per planning.md: photo, name, work score, Wi-Fi/outlet confidence, noise, recommended arrival, parking note; best-overall reason line.
- Actions: View Detail, Save, Directions.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: E3 - Work Session Planner (includes results: 'Best for your session' cards with work score, Wi-Fi/outlet/noise stats, arrival tips)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - E3 contains planner inputs AND results on one scrolling screen.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Work Session Planner Screen; Work Session Results Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-020 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
