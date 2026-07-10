# 0022 Groq Provider for US-029 (supersedes 0021's provider choice)

Date: 2026-07-10

## Status

Accepted

## Context

Decision 0021 wired the `ai-finder` Edge Function to Gemini 2.5 Flash. In live
verification Gemini returned a persistent `429 quota exceeded` on a fresh key
after only ~15 requests — the key's Google Cloud project has free-tier quota
gated behind billing (a regional free-tier restriction). The user declined to
enable Google billing for a demo.

The integration itself was fully proven end-to-end (Supabase Edge Function,
anon-key auth, secret handling, JSON schema, retry) — only the provider was
unusable without billing.

## Decision

Swap the AI provider from Gemini to **Groq** (`console.groq.com`), keeping
everything else from 0021:

- Groq's OpenAI-compatible chat completions endpoint with `response_format:
  json_object`, model `llama-3.3-70b-versatile` (overridable via `GROQ_MODEL`).
- Free tier requires no credit card, with rate limits far above demo needs.
- `GROQ_API_KEY` replaces `GEMINI_API_KEY` in Supabase secrets; still
  server-side only (decision 0008's rule is unchanged — only the named
  provider changes).
- App request/response contract (`{ prompt, profile, candidates }` →
  `{ bestMatchId, why[] }`), the demo-mode fallback, and the AI-unavailable
  failure mapping are all identical to 0021; no app code or test changes.
- Server-side retry now also covers 429 (not just 503), since free tiers
  surface transient rate limits that way.

This supersedes the *provider choice* in decisions 0021 and 0008 (which
proposed "OpenAI or Gemini"); the rest of 0021 (architecture, key placement,
mode mapping) stands.

## Alternatives Considered

1. Enable Google billing for Gemini: declined by the user.
2. Different Gemini free model: rejected — the 429 is project/region-level,
   not per-model, so a model swap would not clear it.
3. Mistral / OpenRouter / Cohere free tiers: viable equivalents; Groq chosen
   because the user already provisioned a `GROQ_API_KEY`.

## Consequences

Positive:

- Live AI finder works on a genuinely free, no-card tier.
- Provider is a swap-in behind the same Edge Function contract; the app,
  tests, and env shape are unchanged.

Tradeoffs:

- Model family changes (Llama vs Gemini); output quality is comparable for
  this short ranking task but not identical.
- Groq JSON mode is prompt-enforced rather than schema-enforced, so the
  function still validates `bestMatchId ∈ candidates` and `why` server-side
  (it already did).

## Follow-Up

- If Groq's free tier is ever insufficient, `GROQ_MODEL` / provider swap
  follows the same pattern; revisit under the high-risk lane.
