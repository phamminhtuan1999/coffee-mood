# 0019 Collection Editing Semantics for US-024

Date: 2026-07-09

## Status

Accepted

## Context

US-024 makes collections editable (rename, description, cover, privacy,
reorder, remove). The saved store (decision 0014) is a client-side
localStorage store with no backend, no media pipeline (0018 deferred), and no
share provider (0015 deferred). The D5 design shows a photo cover, a
drag-to-reorder list, and share affordances.

## Decision

- Collection editing stays inside the local saved store, extending the
  `cafemood.saved.v1` schema additively: `Collection.cafeOrder: string[]`
  plus `updateCollection` / `removeCafeFromCollection` /
  `orderedCollectionCafeIds`. Parsing tolerates pre-US-024 state (missing
  `cafeOrder` defaults to `[]`), so no migration or version bump is needed.
- Persisted collection fields now win over the seed on load (previously the
  seed tone won), so cover/privacy edits survive relaunch.
- Cover image = collection tone swatch cycling through the palette until a
  media provider lands (0018 class). No image picking.
- Reorder uses explicit move up/down controls instead of drag-and-drop; a
  gesture pass can replace them later without store changes.
- The edit screen is draft-based: nothing commits until Save Changes,
  including removals (remove of the last membership deletes the save, same
  semantics as the D1 sheet).
- Collection share (header ↗ and bottom Share) stays inert until the share
  provider lands, extending decision 0015 to collection artifacts.

## Alternatives Considered

1. New store keyed separately (`cafemood.collections.v2`): rejected — splits
   ownership of the same artifact and breaks 0014's single-source rule.
2. Real drag-to-reorder with react-native-gesture-handler: deferred — heavier
   interaction work than the story needs; move controls are testable today.
3. Commit-on-change editing: rejected — destructive removes without a
   confirmation step; Save Changes is the design's explicit commit affordance.

## Consequences

Positive:

- Legacy saved data keeps working; edits survive relaunch.
- Reorder/remove are deterministic and unit-testable.

Tradeoffs:

- No real cover photos or drag interaction until providers/gesture passes.
- Share buttons render but do nothing (consistent with 0015 surfaces).

## Follow-Up

- Real provider work (share, media, backend sync) must expand to the
  high-risk template and confirm or supersede decision 0008 first.
