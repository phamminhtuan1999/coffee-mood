# 0015 Defer Share Provider For US-018

Date: 2026-07-09

## Status

Accepted

## Context

US-018 ships the Share Cafe Card: a premium, story-format card (photo, name,
vibe tag, aesthetic score, AI one-liner, CafeMood branding) with Copy Link,
Share Image, and Send to Friend actions. Two of those actions need device
capabilities the repo does not have:

- "Copy Link" needs a clipboard module (`expo-clipboard` or
  `@react-native-clipboard/clipboard`) - neither is installed.
- "Share Image" needs the card rasterized to a PNG (`react-native-view-shot` /
  `captureRef`) and handed to a share sheet - not installed.
- "Send to Friend" needs a share target (the React Native core `Share` API or
  `expo-sharing`).

`scripts/bin/harness-cli query tools` registers none of these capabilities, so
per the harness rule an absent capability is a clean skip. Decision 0008 also
keeps the app free of un-scoped native/provider additions in a slice.

## Decision

US-018 implements the full Share Cafe Card surface - the story card
(`ShareCafeCard`) and the share overlay (`ShareCafeSheet`) opened from the cafe
detail Share action (text action and hero button) - with card content derived
from the existing pin fixtures (`src/data/share-card.ts`). This satisfies the
primary contract: one tap generates a premium, story-shareable card.

The three actions (Copy Link, Share Image, Send to Friend) render but stay
inert, matching the other provider-deferred actions in the detail screen
(Directions, Add to Route, Open in Google Maps). The card is built as a
standalone view so a future `view-shot` capture can rasterize it without the
surrounding sheet chrome. No clipboard, view-shot, or share dependency is added
in this slice.

## Alternatives Considered

1. Add `expo-clipboard` + `react-native-view-shot` now and wire all three
   actions - pulls native dependencies and a rasterization/permission surface
   into a UI slice; each deserves its own validated change.
2. Wire only the React Native core `Share` API for text - ships an
   inconsistent, half-working action row ("Share Image" without an image) and
   contradicts the "renders as an image" contract.
3. Leave the detail Share action inert - fails the US-018 contract that a tap
   generates the shareable card.

## Consequences

Positive:

- The premium share card is demoable and testable in Expo Go with no new
  dependencies, and its content/branding contract is pinned by unit tests.
- The card view is capture-ready, so the image-export follow-up is additive.

Tradeoffs:

- Copy Link / Share Image / Send to Friend do nothing until the provider lands,
  consistent with the other deferred actions.
- Image export and real sharing need their own change (dependency, permissions,
  and failure-path proof).

## Follow-Up

- A share-provider story adds the clipboard + view-shot + share-target wiring
  and registers the capabilities in the tool registry.
- Revisit alongside decision 0014 (client-side saves) if a backend introduces
  shareable collection links.
