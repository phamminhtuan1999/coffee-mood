# Overview

## Current Behavior

The Ask AI pill on the map home opens `/ai-finder`, a static US-008 stub:
back button, headline, non-functional prompt input, and six suggestion chips.
Nothing happens on submit; there is no result, loading, or fallback state.

## Target Behavior

The finder accepts a free-text prompt (typed or chip-filled), shows a soft
thinking state, then renders the AI result per frame B3: best-match card with
why-it-matches bullets, three alternatives with better-for labels, View on
Map / Save / Directions actions plus Refine Search, and the confidence line
"Based on reviews, photos, hours, and your taste profile." When the finder is
unavailable, the screen shows "CafeMood AI is taking a coffee break." with a
Browse Map CTA. Matching is deterministic and fixture-backed per decision
0013; no AI provider is called.

## Affected Users

- CafeMood users describing what they want in natural language instead of
  browsing the map or search.

## Affected Product Docs

- `docs/product/discovery.md`
- `docs/decisions/0008-cafemood-tech-stack.md`
- `docs/decisions/0013-defer-ai-provider-for-us-011.md`

## Non-Goals

- Installing or calling any AI provider (decision 0013).
- Backend, Edge Functions, or credentials.
- Persisted saves from the result card (heart toggles in-screen state only).
- The full US-013 discovery state catalog; only the AI-unavailable state ships
  here.
