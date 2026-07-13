# Overview

## Current Behavior

"Ask AI" (US-029) always ranks the same **four curated fixtures** (Mostra,
Marigold, Terrace, Hearth). `runLiveAiFinder` sends `aiCafes` as candidates
and the result spreads the winning fixture object, overriding only the three
why-bullets. So even with the live Groq call working, the recommended cafe's
identity (name, meta, scores, alternatives) is hardcoded — only the three
bullets are model-written — and the real cafes now on the map (US-031) never
reach the finder. This is why the result reads as canned.

## Target Behavior

When the map's live-cafe cache is warm (US-031 already fetched real cafes
around the user), the finder sends those **real cafes** as candidates. Groq
picks the best real cafe for the prompt; the winner maps back to that cafe and
renders with its real name/meta, the model's why-bullets grounded in real
candidate data, and alternatives drawn from the other nearby live cafes.

- Cold cache / unconfigured (demo): the four fixtures remain the candidate
  pool and fallback, so the deterministic demo and its tests are unchanged.
- Provider failure/timeout: the designed AI-unavailable state (0013),
  unchanged.

The `ai-finder` Edge Function is candidate-agnostic, so nothing server-side
changes and no redeploy is needed.

## Affected Users

- Explorer using Ask AI: gets a real nearby cafe, not one of four fixtures.
- Developer/QA: demo mode (no env / cold cache) stays deterministic.

## Affected Product Docs

- `docs/product/discovery.md` (AI finder candidate source)
- `docs/product/cafe-detail.md` (limited-data note already covers live cafes)

## Non-Goals

- Finder-initiated location fetch, Save/Directions wiring on the finder
  result, live cafes in search/planners, Edge Function changes.
