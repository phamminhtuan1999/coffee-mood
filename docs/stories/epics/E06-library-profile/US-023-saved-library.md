# US-023 Saved cafes library

## Status

implemented

## Lane

normal

## Product Contract

Saved feels like a personal coffee map: collection tabs, map/grid/list view modes (map or grid default), rich cards with quick actions.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Tabs: Want to Try, Work Spots, Date Spots, Aesthetic, Visited; view modes Map / Grid / List.
- Card: photo, name, tags, distance, score, collection label, quick actions (Directions, Remove, Share).
- Empty state 'Your coffee map is empty.' with Explore Cafes CTA.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: D2 - Saved Cafés
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- One screen at `src/app/saved.tsx` (route `/saved`) matching D2: serif
  "Saved" title, Map/Grid/List segmented view switch, horizontal collection
  tab chips, and the three view bodies (grid cards, map surface with tone
  pins + "N saved nearby" pill, list rows).
- The library is a live view over the persisted saved store (decision 0014):
  `src/data/saved-library.ts` joins `state.saves` against the pin fixtures.
  Tabs derive from the live collections (so user-created collections appear)
  plus a pinned Visited tab; the contract five (Want to Try, Work Spots,
  Date Spots, Aesthetic, Visited) always render. Visit history is future
  data-model work (library-profile.md), so Visited resolves to a calm
  placeholder line instead of demo cards.
- Cards blend the D2 grid anatomy (tone photo swatch, ♥ badge, collection
  pill, name + score, meta) with the acceptance-criteria affordances: a tags
  line and a Directions / Remove / Share quick-action row. Remove is live
  (`removeCafeSave`), Share opens the US-018 share sheet (provider handlers
  still deferred per decision 0015), Directions stays inert until the map
  provider lands (decision 0010). Card tap opens `/cafe/[id]`.
- Empty state uses the product-contract copy ("Your coffee map is empty." /
  Explore Cafés → map home) via `EmptyStateCard`. Populated-but-empty tabs
  get a lighter inline line ("Nothing in this collection yet.").
- QA overrides for deterministic smoke: `?state=demo` renders a populated
  in-memory library (never mutates the persisted store), `?view=map|grid|list`
  and `?tab=<collection-id>` preselect the surface.
- Entry is deep-link only (`/saved`) until the US-027 tab bar adds the durable
  entry - same provisional-entry situation as decisions 0016/0017 note.

## Harness Delta

- None. No new store (reads the US-017 saved store), no new decisions
  (Directions inert per 0010, saves per 0014, share per 0015).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-023 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/saved-library.test.ts` (tabs contract, joins, visited, counts) |
| Integration | Tab/view switching, remove, share, detail push in `src/app/__tests__/saved-library.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 36 suites, 265 tests passing (14 new).
- Simulator smoke (iPhone 15 Pro, iOS 17.2, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/saved?state=demo` → `/tmp/cafemood-ios-simulator-us023-grid.png`
    (grid cards with ♥ badge, collection pill, score, tags, quick actions).
  - `--/saved?state=demo&view=map&tab=work-spots` →
    `/tmp/cafemood-ios-simulator-us023-map.png` (map surface, 2 tone pins,
    "2 saved nearby" pill, Work Spots tab selected).
  - `--/saved` → `/tmp/cafemood-ios-simulator-us023-empty.png` ("Your coffee
    map is empty." + Explore Cafés CTA).
- Directions is the deferred provider layer (decision 0010); share handlers
  deferred per 0015. Interactive tap-through remains part of the human manual
  pass per decision 0012 / backlog #2.
