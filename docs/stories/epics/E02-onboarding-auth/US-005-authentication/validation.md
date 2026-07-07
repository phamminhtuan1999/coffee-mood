# Validation

## Proof Strategy

US-005 requires static proof for the typed route/session code, story proof for
Harness, and platform proof that the auth surfaces render inside Expo Go on an
iPhone simulator.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | TypeScript validates the `AuthSession` model and route state usage. |
| Integration | Harness story verify runs lint and TypeScript together. |
| E2E | Deferred to US-028 full-flow QA walkthroughs. |
| Platform | iPhone simulator smoke of first-run auth screens. |
| Performance | Scroll surfaces stay simple; no heavy shadows beyond primary controls. |
| Logs/Audit | No product auth logs yet because no external auth call occurs. |

## Fixtures

- Guest session marker.
- Email session marker for a normalized email address.
- Apple and Google provider markers without external tokens.

## Commands

```text
npm run lint
npx tsc --noEmit
scripts/bin/harness-cli story verify US-005
git diff --check
```

## Acceptance Evidence

Verification passed:

- `npm run lint`
- `npx tsc --noEmit`
- `scripts/bin/harness-cli story verify US-005`
- `git diff --check`
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 rendered the first-run
  app after the US-005 changes; screenshot:
  `/tmp/cafemood-ios-simulator-us005-initial.png`

Simulator limitation: this environment's `simctl` supports screenshots and UI
settings but not tap gestures, and macOS assistive access blocks desktop click
automation. Auth-screen interaction proof is therefore covered by static
route/state validation for this pass.
