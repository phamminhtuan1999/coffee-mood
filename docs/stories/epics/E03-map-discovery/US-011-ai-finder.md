# US-011 AI cafe finder and result

## Status

implemented

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
- High-risk folder: `US-011-ai-finder/` (overview, execplan, design,
  validation). AI provider deferred per decision 0013; deterministic
  fixture matcher in `src/data/ai-finder-fixtures.ts` (prompt tokens
  weighted 2, taste-profile tokens 1, baseScore tie-break).
- Screen state machine in `src/app/ai-finder.tsx`: idle -> thinking (450ms
  LoadingSkeleton) -> result | unavailable; Refine Search returns to idle
  keeping the prompt. `?prompt=` deep-link param auto-runs the finder
  (also used for simulator state QA).
- Derivations recorded in the folder design.md: Refine Search action,
  confidence line, thinking state, and the coffee-break fallback
  (EmptyStateCard gained an optional `onCtaPress`).
- Reserved prompt containing "coffee break" maps to the unavailable state,
  the same state a future provider failure will use.

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

- Decision 0013 (defer AI provider) recorded with durable row.
- Verify command configured:
  `npm run lint && npx tsc --noEmit && npx jest ai-finder`.

## Evidence

- `npm run lint` passed; raw `npx tsc --noEmit` passed; `git diff --check`
  passed.
- 18 jest tests pass (`npx jest ai-finder`): matcher ranking for every
  suggestion chip and prompt family, taste-profile boost, unavailable
  trigger, fixture shape, and screen states (idle, thinking, result content,
  chip fill, save toggle, refine, fallback CTA, back navigation, deep-link
  param). Full suite: 69 tests pass.
- `scripts/bin/harness-cli story verify US-011` passed.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 (decision 0012):
  finder idle state, AI result state (best match, why-bullets, deep-linked
  via `?prompt=Good latte`), and coffee-break fallback with Browse Map CTA
  all rendered within safe areas. Screenshots:
  `/tmp/cafemood-ios-simulator-us011-finder.png`,
  `/tmp/cafemood-ios-simulator-us011-result.png`,
  `/tmp/cafemood-ios-simulator-us011-ai-down.png`.
- Interactive tap-through (chips, save toggle, refine, scroll to
  alternatives/actions) remains covered by jest and static validation;
  simulator tap automation is still blocked (backlog #2) and the desktop
  control request was declined, so the human manual pass per decision 0012
  is the remaining interaction proof.
