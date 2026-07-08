# Validation

## Proof Strategy

Prove the map home renders and remains type-safe without adding external map
provider risk. Platform proof uses Expo Go on the iPhone simulator.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Static fixture and component render paths are covered by TypeScript and lint. |
| Integration | `/`, `/search`, and `/ai-finder` route targets typecheck together. |
| E2E | Deferred to US-028 full-flow QA walkthroughs. |
| Platform | iPhone simulator screenshot of the map home after US-008 changes. |
| Performance | Avoid expensive text select handlers or map SDK work in this slice. |
| Logs/Audit | Not applicable; no backend or audit behavior. |

## Fixtures

- Mostra Coffee: Aesthetic / Specialty Coffee / Good Latte; Aesthetic 9.1,
  Coffee 8.8, Work 6.5; product-contract summary.
- Marigold & Oak, Terrace & Thistle, and Hearth Supply Co. provide deterministic
  secondary pin/filter cases.

## Commands

```text
npm run lint
npx tsc --noEmit
scripts/bin/harness-cli story verify US-008
git diff --check
```

## Acceptance Evidence

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `scripts/bin/harness-cli story verify US-008`: pass.
- `git diff --check`: pass.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 rendered the US-008 map
  home. Screenshot: `/tmp/cafemood-ios-simulator-us008-final.png`.
- Simulator interaction automation remains limited by backlog #2, so
  pin/filter/navigation interactions are covered by static route/state
  validation and TypeScript.
