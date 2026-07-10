# Overview

## Current Behavior

The AI cafe finder (frame B3, US-011) is fully presentational: `runAiFinder`
in `src/data/ai-finder-fixtures.ts` ranks the four curated cafes with a
deterministic keyword/taste-profile scorer, why-bullets are fixture strings,
and the "coffee break" prompt simulates the AI-unavailable state (decision
0013 deferred the real provider; decision 0008 forbids client-side AI).

## Target Behavior

When Supabase env values are present, Ask AI calls the `ai-finder` Edge
Function, which asks the AI provider to pick the best candidate cafe and
write three why-bullets grounded in the candidate data and the user's taste
profile. The result renders through the unchanged US-011 result surface.

Provider note: implemented against Groq (`llama-3.3-70b-versatile`) per
decision 0022 — the original Gemini pick (0021) hit a billing-gated free-tier
429, so the provider was swapped behind the same Edge Function contract. The
`GROQ_API_KEY` secret replaces `GEMINI_API_KEY`; nothing else changed.

- Unconfigured (no `.env`): today's deterministic demo behavior, untouched.
- Configured + provider failure/timeout/bad response: the designed
  AI-unavailable state ("CafeMood AI is taking a coffee break.").
- `GEMINI_API_KEY` exists only in Supabase (secrets for deployed, local
  `supabase/functions/.env` for `supabase functions serve`); the app bundle
  carries only the public Supabase URL + anon key.

## Affected Users

- Explorer looking for a cafe by vibe (finder prompt → live match).
- Developer/QA: new env setup path documented in `supabase/README.md`.

## Affected Product Docs

- `docs/product/discovery.md` (AI finder behavior)

## Non-Goals

- Live map/Places data (US-030), backend persistence, streaming responses,
  prompt history, or provider choice changes.
