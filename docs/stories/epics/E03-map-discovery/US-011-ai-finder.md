# US-011 AI cafe finder and result

## Status

planned

## Lane

high-risk

## Product Contract

Users describe what they want in natural language and get a best-match cafe with reasons, alternatives, and a confidence line - warm editorial presentation, not a chatbot.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- Finder: headline, free-text prompt input, six suggested chips per discovery.md.
- Result: best match with why-bullets; alternatives with better-for labels; View on Map / Save / Get Directions / Refine Search.
- Confidence line: 'Based on reviews, photos, hours, and your taste profile.'
- AI runs server-side only via Edge Functions per decision 0008; 'CafeMood AI is taking a coffee break.' fallback state.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B3 - AI Cafe Finder (includes the AI Result: best-match card, why-it-matches bullets, alternatives with better-for labels, View on Map / Save / Directions)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - B3 contains finder AND result on one scrolling screen. A dedicated full-screen result variant is optional polish, not a gap.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: AI Cafe Finder Screen; AI Result Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.
- External AI provider hard gate: expand to high-risk story folder when selected.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-011 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
