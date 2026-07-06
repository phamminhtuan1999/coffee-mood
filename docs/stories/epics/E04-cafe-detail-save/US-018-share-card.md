# US-018 Share cafe card

## Status

planned

## Lane

normal

## Product Contract

One tap generates a premium, story-shareable cafe card (photo, name, vibe tag, aesthetic score, AI summary, branding) with copy/share/send actions.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- Card matches design; renders as an image for the share sheet.
- Actions: copy link, share image, send to friend.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: D6 - Share Cafe Card (story-format card: photo, serif name, vibe tag, aesthetic score badge, AI one-liner, CafeMood branding; Copy Link / Share Image / Send to Friend)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Share Cafe Card Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-018 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
