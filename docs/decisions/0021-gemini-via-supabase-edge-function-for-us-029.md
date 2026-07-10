# 0021 Gemini via Supabase Edge Function for US-029

Date: 2026-07-09

## Status

Accepted

## Context

US-029 is the first story to integrate a real provider. Decision 0008
(proposed) called for "OpenAI or Gemini, server-side only via Edge
Functions" and forbids client-side AI calls. The human picked Gemini and
Supabase on 2026-07-09, which accepts 0008's AI layer as proposed rather
than superseding it. No backend exists yet; the finder UI contract (best
match, why-bullets, alternatives, confidence line, unavailable fallback) has
been stable since US-011.

## Decision

- Provider: Gemini 2.5 Flash through a single stateless Supabase Edge
  Function (`supabase/functions/ai-finder`), structured JSON output
  (`bestMatchId` + `why[]`) over the curated candidate set sent with each
  request. The model ranks candidates; it cannot invent cafes.
- Key placement: `GEMINI_API_KEY` lives only in Supabase — function secrets
  for deployed (`supabase secrets set`), `supabase/functions/.env` for local
  `functions serve` (gitignored, `.env.example` committed). It never enters
  the app bundle, repo, or Expo env.
- App env carries only public values: `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env` (gitignored; example committed).
- Mode mapping: env unset → deterministic fixture matcher (unchanged demo
  mode, what jest runs); env set + success → live result rendered through
  the unchanged US-011 surface; env set + any failure → the designed
  AI-unavailable state (honors decision 0013's failure contract).
- The story stays open until a live curl + simulator pass with real
  credentials is recorded in its validation.md (dual-proof, decision 0012).

## Alternatives Considered

1. OpenAI or Claude instead of Gemini: viable; human chose Gemini (existing
   key, matches 0008's proposal verbatim).
2. Client-side SDK: forbidden by 0008 — key would ship in the bundle.
3. Backendless proxy (e.g. API-gateway key vault): more moving parts than
   one Edge Function and off the 0008 path.

## Consequences

Positive:

- First accepted slice of the 0008 stack (Supabase + server-side AI) with
  the smallest possible footprint; Expo Go workflow survives.
- Demo mode and tests keep working with zero credentials.

Tradeoffs:

- Candidate data travels with each request (fine at 4 cafes; revisit when a
  real cafe backend lands).
- Provider latency/cost now exist; the 8s client abort bounds UX.

## Follow-Up

- US-030 (live map) accepts or supersedes 0008's map layer separately.
- Escalate 0008 layers to Accepted as each lands (AI layer: this decision).
