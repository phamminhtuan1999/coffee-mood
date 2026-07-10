# Exec Plan

## Goal

The AI cafe finder (US-011 surface) returns a real model-ranked result:
Gemini 2.5 Flash picks the best cafe from the curated candidates and writes
the why-bullets, called server-side through a Supabase Edge Function. The
deterministic fixture matcher stays as the unconfigured demo mode and the
designed AI-unavailable state absorbs provider failures.

## Scope

In scope:

- Supabase Edge Function `ai-finder` (Deno) calling Gemini with structured
  JSON output; `GEMINI_API_KEY` from function secrets only.
- App-side live client (`src/utils/ai-finder-client.ts`) gated on
  `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Finder screen wiring: configured → live call; unconfigured → existing
  deterministic matcher; live failure/timeout → AI-unavailable state.
- Env scaffolding (`.env.example`, `supabase/functions/.env.example`),
  supabase project skeleton, setup docs.

Out of scope:

- Map provider (US-030), backend cafe data, saves sync, auth backend.
- Streaming, conversation memory, or prompts beyond the single finder call.
- Any client-side AI SDK (forbidden by decision 0008).

## Risk Classification

Risk flags:

- External systems (Gemini API, Supabase Edge Functions).
- Existing behavior (US-011 finder flow is implemented and test-covered).
- Weak proof until live credentials exist (see stop conditions).

Hard gates:

- External provider behavior → high-risk lane, human-confirmed direction
  (Gemini accepted by the human on 2026-07-09; accepts decision 0008's AI
  layer as proposed).

## Work Phases

1. Discovery: US-011 contract, fixture matcher, fallback states. (done)
2. Design: request/response schema, key placement, fallback mapping →
   `design.md`, decision 0021.
3. Validation planning: `validation.md`; unit + integration tests run
   without credentials; live proof checklist for the human-keyed pass.
4. Implementation: Edge Function, live client, screen wiring, env scaffold.
5. Verification: jest/tsc/lint now; live curl + simulator smoke once the
   human supplies the Supabase project and Gemini key.
6. Harness update: story row, trace, decision 0021, backlog epic row.

## Stop Conditions

Pause for human confirmation if:

- The provider or key-handling shape needs to change (supersedes 0021/0008).
- Any path would require the Gemini key in the app bundle or repo.
- Live verification reveals contract changes to the US-011 result surface.
- Validation requirements would need to be weakened to merge.
