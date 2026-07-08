# Validation

## Proof Strategy

Prove the finder-to-result flow deterministically with jest (decision 0011)
and prove real rendering with a manual iPhone 15 simulator pass (decision
0012). No external AI risk enters the slice (decision 0013).

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Matcher: work/parking prompt ranks Marigold or Hearth; photo/latte prompt ranks Mostra; empty prompt returns Mostra; taste profile boosts matching cafes; "coffee break" prompt returns unavailable. Screen: idle renders headline/chips; chip press fills prompt; submit shows thinking then result with why-bullets, better-for alternatives, actions, confidence line; Refine Search returns to input; unavailable state shows coffee-break copy with Browse Map. |
| Integration | Deferred to wiring-story backfill; route target typechecks with `/`. |
| E2E | Deferred to US-028 full-flow QA walkthroughs. |
| Platform | Manual iPhone 15 simulator smoke of finder and result, screenshot recorded in Evidence (decision 0012). |
| Performance | No provider latency in slice; thinking state is a fixed 450ms. |
| Logs/Audit | Not applicable; no backend. |

## Commands

```text
npm run lint
npx tsc --noEmit
npx jest ai-finder
scripts/bin/harness-cli story verify US-011
git diff --check
```

## Acceptance Evidence

Recorded in the US-011 story packet Evidence section after implementation.
