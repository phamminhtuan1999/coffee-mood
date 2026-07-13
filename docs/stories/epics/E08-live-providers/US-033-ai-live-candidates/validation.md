# Validation

## Proof Strategy

Dual proof per decision 0012:

1. Credential-free gate: unit tests for the live-candidate request shape and
   the `CafeMapPin` → `AiCafe` mapping (mocked fetch, cache warmed via a
   mocked Overpass response); the existing fixture-candidate tests stay green
   because they never warm the cache (cold → fixture branch).
2. Live proof: iPhone 15 Pro with a simulated location — load the map (warms
   the live cache), open Ask AI, and confirm the result names a **real** OSM
   cafe with model-written bullets, distinct from the four fixtures.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Cold cache → fixture candidates + fixture mapping (existing suite unchanged); warm cache → live candidate ids sent, winner maps to the live cafe with live why-bullets and alternatives from other live pins; unknown id / empty why / non-200 → unavailable |
| Integration | Finder screen renders the client's live `AiCafe` (existing `ai-finder-live` suite, client mocked) |
| E2E | Human tap-through (backlog #2) |
| Platform | Simulator: map warms cache → Ask AI names a real cafe |
| Performance | ≤12 candidates sent; 15 s client abort unchanged |
| Logs/Audit | No new logging; real cafe names travel only inside the existing Groq request; nothing persisted |

## Fixtures

- Canned Overpass JSON to warm the cache in the new unit test.
- Mocked Groq response `{ bestMatchId: <live id>, why: [3] }`.

## Commands

```text
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"
node_modules/.bin/tsc --noEmit && node_modules/.bin/eslint .
node_modules/.bin/jest src/utils/__tests__/ai-finder-client.test.ts src/app/__tests__/ai-finder-live.test.tsx
xcrun simctl location <UDID> set 32.7466,-117.1297   # then map → Ask AI smoke
```

## Acceptance Evidence

- Credential-free gate (2026-07-10): tsc clean; eslint 0 errors; 52 suites /
  349 jest tests green (Node 24). Two new `ai-finder-client` tests: warm
  cache → live OSM candidate ids sent (`osm-node-501`, `osm-node-502`) and
  the winner maps to the real cafe (`Caffè Calabria`) with the model's
  bullets and alternatives from the other live pin; unknown live id →
  unavailable. Existing fixture-candidate tests unchanged (cold cache).
- Live pass (2026-07-10, iPhone 15 Pro, simulated location
  32.7466,-117.1297): map home warmed the live cache, then Ask AI with
  "quiet work spot with wifi and outlets" returned **Gather — Ray Street ·
  0.1 mi** (a real OSM cafe, not a fixture) with Groq bullets "Has Wi-Fi /
  Good for work / High base score"
  (`/tmp/cafemood-ios-simulator-us033-ai-live.png`). Before US-033 the same
  prompt could only ever return one of Mostra/Marigold/Terrace/Hearth.
- Note: an Apple Maps *widget* location prompt (OS modal raised by the map
  screen's MapView) overlays the capture; it needs a one-time human tap
  (backlog #2) and is not app UI. The result card is fully legible behind
  it.
