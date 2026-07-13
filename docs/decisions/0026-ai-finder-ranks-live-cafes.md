# 0026 AI Finder Ranks Live Cafes (US-033)

Date: 2026-07-10

## Status

Accepted

## Context

US-029 shipped the live Groq AI finder, but decision 0024 scoped it to the
four curated fixtures: even with the live call working, "Ask AI" always
recommends one of Mostra / Marigold / Terrace / Hearth and only the three
why-bullets are model-written. After US-031 put real cafes on the map, the
mismatch became visible — the user reported the finder "sounds like hardcode."
The recommended cafe's identity is fixed; only the bullets vary.

## Decision

Feed the map's **live OSM cafes** (US-031 `fetchLiveCafes` session cache) into
the finder as the candidate set:

- When the cache is warm, `runLiveAiFinder` sends up to 12 real nearby cafes
  (id, name, meta, keyword tags, score) to the unchanged, candidate-agnostic
  `ai-finder` Edge Function; the winning `bestMatchId` maps back to the real
  `CafeMapPin`, adapted to the `AiCafe` the result card renders, with the
  model's why-bullets and alternatives drawn from the other nearby cafes.
- When the cache is cold (finder opened before the map loaded) or the app is
  unconfigured, the four fixtures remain the candidate pool and fallback, so
  the deterministic demo and its tests are unchanged.
- Provider failure keeps the AI-unavailable state (0013).

This narrows decision 0024's "AI finder candidates remain the curated fixture
world" — live candidates when available, fixtures as fallback. No Edge
Function change (it validates `bestMatchId ∈ candidateIds` for any set), so no
redeploy; decision 0008 is untouched (no key moves; the finder already called
Groq server-side).

## Privacy Note

The finder now sends real, location-derived cafe names to Groq. This is a
small increment over the existing disclosure: the app already sends the user's
coordinates to Overpass (US-031) and the free-text prompt to Groq (US-029).
No coordinates or user identity are sent to Groq — only public cafe names the
map already displays. Nothing is persisted or logged. If this ever needs
explicit consent, gate it at the finder entry under the high-risk lane.

## Alternatives Considered

1. Finder fetches its own live cafes with a dedicated location prompt: more
   robust on a cold cache but duplicates location logic and risks a second
   permission prompt; deferred (the map cache is warm in the normal flow).
2. Replace fixtures entirely: breaks the deterministic demo/tests; rejected —
   fixtures stay as the cold-cache/demo fallback.
3. Foursquare-backed richer candidates: needs an account/key; out of scope
   (recorded as the US-031 upgrade path in 0024).

## Consequences

Positive:

- Ask AI recommends a real cafe near the user with reasoning grounded in real
  candidate data — the "hardcode" feel is gone in the live path.

Tradeoffs:

- Live cafes carry estimate-derived scores (0024), so the model's confidence
  is only as good as OSM tag coverage.
- On a cold cache the finder still shows a fixture — a brief window right
  after launch before the map fetch completes.
- Real cafe names travel to a third-party LLM (see Privacy Note).

## Follow-Up

- Wire the finder result's Save (to the saved store) and Directions (OS maps
  deep link, decision 0025) to the real cafe — a small separate story.
- Finder-initiated live fetch for the cold-cache case if it proves common.
