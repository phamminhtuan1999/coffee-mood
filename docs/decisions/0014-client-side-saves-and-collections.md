# 0014 Client-Side Saves And Collections

Date: 2026-07-08

## Status

Accepted

## Context

US-017 turns the ephemeral save toggle from US-014 (local component state on
the cafe detail screen and the map preview sheet) into a real save flow:
choose or create a collection, attach a private note, and see the saved state
reflected wherever the cafe appears. Decision 0008 forbids client-side calls to
external providers and the repo still has no backend, so there is no compliant
way to persist saves or collections to a server in this slice. The save flow
also exposes a Private/Public toggle on collections, which implies a real
sharing surface that does not exist yet.

## Decision

US-017 persists saves and collections on-device through a reactive
`localStorage`-backed store (`src/utils/saved-store.ts`), mirroring the
existing map-filters and taste-profile store pattern (module cache + listener
set consumed via `useSyncExternalStore`). The store seeds the six default
collections from `cafe-detail.md`, records per-cafe collection membership plus a
private note, and is the single source of truth the cafe detail screen and the
map home read for saved state.

The collection Private/Public toggle and any "share this collection" affordance
are presentational only. No collection is transmitted anywhere; "Public" is
stored metadata with no backend effect until a real sharing/sync story lands.

## Alternatives Considered

1. Keep saves in per-screen component state - fails the US-017 contract that
   saved state reflects across pins, cards, and the detail screen, and loses
   saves on navigation.
2. Stand up a backend to persist saves now - a backend bootstrap is its own
   high-risk story, far beyond this slice, and blocked by the absence of a
   provider decision.
3. Wire the Private/Public toggle to a real sharing endpoint - there is no
   backend and no sharing contract; this would ship a dead or unsafe network
   path.

## Consequences

Positive:

- The full save-to-collection and create-collection flow is demoable and
  testable in Expo Go with no credentials, and saves survive app restarts.
- The store shape (collections + per-cafe saves + notes) is the contract a
  future Saved library (D2/D3, US-023) and any sync backend will hydrate.

Tradeoffs:

- Saves live only on the device; there is no cross-device sync or backup.
- The Public privacy state is cosmetic until a sharing story supersedes this;
  the UI must not imply a collection is actually shared.

## Follow-Up

- The Saved library and collection detail stories (E06) read this store rather
  than introducing their own persistence.
- Revisit when a backend exists: on-device saves become the local cache/offline
  layer, and the Private/Public toggle gains real meaning through a sharing
  contract.
