# Exec Plan

## Goal

Make "Ask AI" reason over the **real** cafes near the user (the live OSM pins
from US-031) instead of the four curated fixtures, so the recommendation is a
real nearby cafe with model-written reasoning — not one of four fixed names.

## Scope

In scope:

- The AI finder client sends the map's cached live cafes (US-031
  `fetchLiveCafes` results) as the candidate set to the unchanged `ai-finder`
  Edge Function; the winning `bestMatchId` maps back to the real cafe.
- A `CafeMapPin` → `AiCafe` adapter so the existing result card renders a
  live cafe (name, meta, tone, live why-bullets, alternatives drawn from the
  other nearby live cafes).
- Fixtures remain the fallback candidate pool when the live cache is cold
  (finder opened before the map loaded) or the app is unconfigured (demo).

Out of scope:

- Fetching live cafes from inside the finder (it reuses the map's session
  cache; cold cache falls back to fixtures — no second location prompt).
- Edge Function changes (it is already candidate-agnostic — no redeploy).
- Wiring the finder's Save/Directions buttons to the real cafe (pre-existing
  gaps, separate follow-up).
- Live cafes in search / planners.

## Risk Classification

Risk flags:

- External systems (Groq via the Edge Function).
- Existing behavior (the finder is implemented and test-covered).
- Weak proof (live results are nondeterministic; tests mock the boundary).
- Audit/security (real, location-derived cafe names now travel to the LLM).

Hard gates:

- External provider behavior → high-risk lane.

## Work Phases

1. Discovery: traced the finder → client → Edge Function path; confirmed the
   Edge Function is candidate-agnostic and the result card renders any
   `AiCafe` (done).
2. Design: decision 0026 (finder ranks live candidates; fixture fallback;
   privacy note).
3. Validation planning: unit tests for the live-candidate request + mapping;
   existing fixture tests stay green (cold cache).
4. Implementation: `getCachedLiveCafes` getter + client branch + adapter.
5. Verification: tsc, lint, jest, iPhone 15 Pro live smoke (real cafe named
   in the AI result).
6. Harness update: story row, decision, trace, product docs, backlog.

## Stop Conditions

Pause for human confirmation if:

- Sending real nearby cafe names to the LLM needs to be gated behind consent
  beyond the existing map/Overpass disclosure.
- The Edge Function turns out to need candidate-shape changes (it does not).
- Validation must weaken (the fixture suite cannot stay green).
