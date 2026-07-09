# US-024 Collection detail and editing

## Status

implemented

## Lane

normal

## Product Contract

A collection reads like a curated local guide (cover collage, map preview, cards) and is editable: rename, cover, privacy, reorder, remove.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Detail per library-profile.md incl. share button and Private/Public toggle.
- Edit screen: name, description, cover image, privacy, reorder, remove; Save Changes CTA.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: D3 - Collection Detail
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: D5 - Edit Collection (change cover, name, description, interactive privacy toggle, drag-to-reorder rows, remove buttons, Save Changes)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Detail at `src/app/collection/[id]/index.tsx` matching D3: cover collage
  (one tall + two stacked tone tiles from member cafes), glass back/share
  circles, serif name, count line, live Private/Public mini toggle
  (`updateCollection`), map preview with tone pins and a live "View on map"
  hop into `/saved?view=map&tab=<id>`, cafe cards with italic save notes,
  Edit collection + Share bottom row. Card tap opens `/cafe/[id]`.
- Edit at `src/app/collection/[id]/edit.tsx` matching D5, draft-based: name
  and description inputs, Change cover (cycles the tone palette until a media
  provider lands), the D4 privacy switch idiom, reorder rows with explicit
  move up/down controls standing in for drag, `–` remove chips, and a pinned
  Save Changes bar that commits the whole draft (decision 0019). Removing the
  last membership deletes the save (D1 semantics).
- Store delta (decision 0019): `Collection.cafeOrder` added additively to
  `cafemood.saved.v1` with tolerant parsing; `updateCollection`,
  `removeCafeFromCollection`, `orderedCollectionCafeIds`,
  and test-only `reloadSavedStore`. Persisted collection fields now win over
  the seed so edits survive relaunch.
- Entry: the collection pill on D2 grid cards opens the collection detail;
  deep link `/collection/[id]` works directly. `?state=demo` QA override
  renders from the demo library and keeps Save Changes/privacy read-only.
- Count line reads "N cafés · curated by you" - the design's "updated 2d ago"
  needs an update timestamp the store doesn't track yet (fixture truth over
  design placeholder).
- Share (header ↗ and bottom button) stays inert per decisions 0015/0019.

## Harness Delta

- Decision 0019 records the editing semantics (local schema extension, tone
  cover, move-control reorder, draft commit, share deferral).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-024 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Store editing/order/removal + legacy parse in `src/utils/__tests__/saved-store.test.ts`; composition in `src/data/__tests__/collection-detail.test.ts` |
| Integration | Detail render, privacy toggle, navigation, draft commit/reorder/remove flows in `src/app/__tests__/collection-detail.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 38 suites, 287 tests passing (22 new incl. 6 new
  store tests).
- Simulator smoke (iPhone 15 Pro, iOS 17.2, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/collection/work-spots?state=demo` →
    `/tmp/cafemood-ios-simulator-us024-detail.png` (D3: cover collage, name,
    count line, Private/Public toggle, map preview + View on map, cards with
    notes, Edit collection / Share row).
  - `--/collection/work-spots/edit?state=demo` →
    `/tmp/cafemood-ios-simulator-us024-edit.png` (D5: Change cover pill on
    tone cover, name/description fields, privacy switch, reorder/remove rows,
    Save Changes bar).
- Share inert per 0015/0019; cover is a tone swatch until a media provider
  lands. Interactive tap-through remains part of the human manual pass per
  decision 0012 / backlog #2.
