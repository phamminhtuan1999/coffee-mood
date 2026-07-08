# 0013 Defer AI Provider For US-011

Date: 2026-07-07

## Status

Accepted

## Context

US-011 is the first story that selects the AI cafe finder result experience.
Decision 0008 proposes OpenAI or Gemini, server-side only via Edge Functions,
but the repo has no backend, no Edge Functions, no provider decision, and no
credentials. Decision 0008 explicitly forbids client-side AI calls, so with no
backend there is no compliant way to reach a real provider from this slice.

## Decision

US-011 implements a provider-ready finder and result experience using
deterministic fixture-backed matching over the existing cafe fixtures, plus
the taste profile when present. It does not install an AI SDK, call any
provider, or add a backend.

The result contract (best match, why-bullets, alternatives with better-for
labels, confidence line, AI-unavailable fallback) is the stable UI surface a
future Edge Function response will hydrate. The first provider-backed AI
story must accept a provider from decision 0008 or supersede it before adding
any AI dependency, and must keep calls server-side only.

## Alternatives Considered

1. Pick OpenAI or Gemini now and call it client-side - violates decision 0008
   and ships secrets in the app.
2. Stand up Supabase Edge Functions in this story - a backend bootstrap is its
   own high-risk story, far beyond this slice.
3. Leave the finder as the US-008 static stub - fails the US-011 product
   contract.

## Consequences

Positive:

- The full finder-to-result flow is demoable and testable in Expo Go with no
  credentials.
- The response shape a real provider must produce is pinned by fixtures and
  unit tests before any spend on provider calls.

Tradeoffs:

- Matching quality is keyword-based, not semantic; good enough only for
  fixtures.
- Later provider integration needs its own high-risk validation, including
  latency, cost, and failure-path proof.

## Follow-Up

- Revisit decision 0008 when a backend exists and real AI matching is
  scheduled; the AI-unavailable state shipped here becomes the provider
  failure path.
