# US-017 Save to collection and create collection

## Status

implemented

## Lane

normal

## Product Contract

Saving is fast: pick or create a collection, optional private note, clear selected states; the whole interaction takes a few seconds.

## Relevant Product Docs

- `docs/product/cafe-detail.md`
- `docs/product/library-profile.md`

## Acceptance Criteria

- Default collections per cafe-detail.md (Want to Try, Work Spots, Date Spots, Aesthetic, Best Latte, Hidden Gems).
- Create modal: name, optional description, Private/Public toggle, suggested names.
- Private note placeholder 'Try on a weekday morning.'; saved state reflects on pins and cards.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: D1 - Save to Collection (collection grid, private note, create-new affordance)
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: D4 - Create Collection (name, description, suggested names, interactive Private/Public toggle, Create CTA)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06: dedicated create-collection modal designed.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Durable decision `docs/decisions/0014-client-side-saves-and-collections.md`:
  saves and collections persist on-device via a reactive localStorage store;
  the Private/Public toggle and sharing are presentational until a backend
  lands (extends decision 0008, mirrors decisions 0010/0013 deferrals).
- New store `src/utils/saved-store.ts` follows the map-filters / taste-profile
  pattern (module cache + listener set, consumed via `useSyncExternalStore`).
  It seeds the six default collections, records per-cafe collection membership
  plus a trimmed private note, exposes pure selectors (`isCafeSaved`,
  `getCafeSave`, `collectionSaveCount`) and mutations (`saveCafe`,
  `removeCafeSave`, `quickToggleSave`, `createCollection`), and validates /
  reseeds corrupt or stale stored data on load.
- New data module `src/data/collections.ts`: default collections + slug ids +
  swatch tones, D4 suggested names, and the note/name/description placeholders.
- `SaveCollectionSheet` (frame D1) is a bottom-sheet overlay over a dimmed
  backdrop: 2-column collection grid (swatch + name + `N saved` + filled check
  indicator, multi-select), "Create new collection" dashed affordance, private
  note field (placeholder "Try on a weekday morning."), Cancel / Save Cafe.
  Deselecting every collection and saving unsaves the cafe.
- `CreateCollectionSheet` (frame D4): name, optional description, suggested-name
  chips (fill the name), Private/Public toggle with live copy, Cancel / Create
  Collection (disabled until a name is entered). Creating returns to the save
  sheet with the new collection selected.
- The cafe detail heart (hero + sticky bar) opens the save sheet instead of the
  old ephemeral toggle; the filled state now reads from the store. The map home
  preview heart uses `quickToggleSave` (one-tap into "Want to Try"). Both
  surfaces read `isCafeSaved`, so a save reflects across pins, cards, and the
  detail screen.
- Copy uses the app-wide unaccented "cafe" ("Save Cafe", "Cute Date Cafes"),
  consistent with the US-011 precedent.
- QA deep-link override `?sheet=save|create` opens a sheet on load for
  deterministic simulator smoke (same pattern as `?state=` / `?discovery=`).

## Harness Delta

- Test harness: added a global in-memory `localStorage` in `jest-setup.ts` and
  a `jest.moduleNameMapper` stub for `expo-sqlite/localStorage/install`, so the
  persisted stores run under jest (the real polyfill can't open SQLite in
  jest). This makes all localStorage-backed stores unit-testable.
- Durable decision 0014 recorded.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-017 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/utils/__tests__/saved-store.test.ts`, `src/data/__tests__/collections.test.ts`, `src/components/ui/__tests__/save-collection-sheet.test.tsx`, `src/components/ui/__tests__/create-collection-sheet.test.tsx` |
| Integration | Save + create flow through the detail screen in `src/app/__tests__/cafe-detail.test.tsx` (heart → sheet → select/create → persist), map home store wiring in `map-discovery-states.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 22 suites, 181 tests passing (32 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/cafe/mostra?sheet=save` →
    `/tmp/cafemood-ios-simulator-us017-save-sheet.png` (collection grid with
    swatches + `0 saved` counts, create-new affordance, private note with
    "Try on a weekday morning." placeholder, Cancel / Save Cafe).
  - `--/cafe/mostra?sheet=create` →
    `/tmp/cafemood-ios-simulator-us017-create-sheet.png` (name + description
    fields, four suggested-name chips, Private collection toggle, Create
    Collection disabled until a name is entered).
- Cross-surface saved reflection (heart fill on detail + map preview after a
  save) is proven by the store round-trip and screen integration tests;
  interactive tap-through remains part of the human manual pass per
  decision 0012 / backlog #2.
