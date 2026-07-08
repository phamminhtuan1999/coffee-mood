# Design

## Visual Contract

Frame B3 in `docs/design/project/CafeMood Complete App.dc.html` (finder and
result on one scrolling screen). Token mapping follows the repo idiom of
theme tokens over raw prototype values:

- Prompt card: cardCream surface, borderMedium, searchCard shadow, 22px-class
  radius via `radius.card`-adjacent values; submit circle 36px espresso900
  with cream arrow.
- Suggestion chips: 999px radius, latte-soft background (new token
  `surface.latteSoft` = rgba(216,191,165,0.3)), chipLabel 12px espresso700.
- Result card: cream card, `radius.imageCard`-class 26px body, card shadow;
  "Best match" eyebrow with 24px latte ✦ circle; 64px photo tile with tone
  base + accent circle (same idiom as the bottom sheet thumb); serif name;
  muted meta line.
- Why-it-matches: eyebrow + dot rows (terracotta / score.great / latteBeige
  dots), mirroring the sheet InsightRow idiom.
- Alternatives: three equal cards, 16px-class radius, 44px tone photo block,
  11px semibold name, 10px terracotta semibold better-for label.
- Actions: View on Map (dark primary, wider), ♡ Save (outlined, narrow,
  toggles saved), Directions (outlined).

## Derivations (design gaps, noted in the packet)

- Refine Search: not in B3; rendered as a quiet text action under the action
  row. Resets to the input state, keeping the prompt.
- Confidence line: product-contract copy under the actions, caption muted.
- Thinking state: soft loading card via `LoadingSkeleton` per the discovery
  system-state idiom (never spinner-only).
- AI unavailable: no dedicated frame; uses `EmptyStateCard` with the
  discovery.md copy "CafeMood AI is taking a coffee break." and a Browse Map
  CTA that returns to the map. `EmptyStateCard` gains an optional `onCtaPress`.

## Data and Matching (decision 0013)

`src/data/ai-finder-fixtures.ts`:

- `AiCafe`: id, name, meta, tone, whyItMatches bullets, alternatives
  (name, betterFor, tone), keywords, baseScore.
- Fixture set mirrors the search fixtures plus the spec alternatives
  (Communal Coffee, Garden Cafe, Better Buzz) as better-for entries.
- `runAiFinder(prompt, profile?)` scores prompt tokens (weight 2) plus taste
  profile cafe types and priorities (weight 1) against keywords; highest
  total wins, ties break on baseScore. Empty prompt returns the reference
  best match (Mostra Coffee, per discovery.md parity note).
- Unavailability: a prompt containing "coffee break" returns
  `{ status: "unavailable" }` so manual QA can reach the fallback
  deterministically; a future provider failure maps to the same state.

## Screen State Machine

idle (input + chips) -> thinking (450ms) -> result | unavailable
Refine Search -> idle (prompt preserved). Back button always returns to map.
