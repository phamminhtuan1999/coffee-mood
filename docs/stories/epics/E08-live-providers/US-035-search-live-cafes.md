# US-035 Search ranks the real nearby cafes

## Status

implemented

## Lane

normal

## Product Contract

Search returns the **real** cafes near the user (the live OpenStreetMap pins
from US-031) instead of the four curated fixtures. Result cards and the search
mini-map show real names, tags, scores, and coordinates; the mini-map is a real
Apple Maps preview with markers at those coordinates (not a decorative
surface). Fixtures remain the cold-cache / offline fallback, the same
live/fixture split the map (0024) and AI finder (0026) use.

## Origin

Hard-code audit follow-up (intake #29): the user asked to remove hard-coded
data and use real data where a real source exists. Search was fixture-only —
four fixed cafes matched by keyword, drawn on a fake map with hard-coded pixel
offsets. It reuses the map's live OSM cache, so no new provider or network call
is needed.

## Relevant Product Docs

- `docs/product/discovery.md` (Search section + contract notes)

## Acceptance Criteria

- `searchCafes(query)` ranks `getCachedLiveCafes()` (real OSM cafes) when the
  map cache is warm; on a cold cache it falls back to `findSearchResults`
  (fixtures). No network call happens in search; matching is local.
- Live results carry real `latitude`/`longitude`; the mini-map renders a real
  non-interactive `MapView` + `Marker`s framed on the result coordinates
  (`regionForPins`), replacing `MapPreviewSurface` and the hard-coded
  `mapPosition` offsets.
- The dead `mapPosition` field and the unused `distance` field are removed from
  `SearchResult`.
- The screen opens on the nearest cafes (empty default query) rather than a
  canned query that may match no real cafe.
- An unmatched query still shows the "No match for that vibe." empty state.

## Design Notes

- Commands: none.
- Queries: `searchCafes(query)` (utils/cafe-search) → warm ?
  `filterSearchResults(live.map(pinToSearchResult), query)` : fixtures.
- API: none — reuses the US-031 OSM cache; no new provider or secret.
- Tables: none.
- Domain rules: `filterSearchResults` is shared by the fixture matcher and the
  live path so both rank identically. Query suggestions (recent/suggested
  chips) stay curated — they are prompts, not cafe data (same as the AI
  finder's chips).
- UI surfaces: `src/components/search/search-screen-content.tsx`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `cafe-search.test.ts`: warm cache → live OSM candidates; cold cache → fixtures; live results carry real coordinates |
| Integration | `search-screen-content.test.tsx`: cold → curated cafes; warm → real OSM cafes (fixtures gone); query filtering; empty state |
| Platform | iPhone 15 Pro Expo Go smoke: Search shows real nearby OSM cafes + a real Apple Maps mini-map (screenshot) |

Per decision 0012, `implemented` requires both the automated checks and the
manual simulator pass; neither substitutes for the other.

## Harness Delta

No new decision — reuses decisions 0024 (OSM cafes) and 0023 (real map).
Intake #29.

## Evidence

- 52 suites / 356 jest tests green (Node 24), tsc clean, eslint 0 errors.
- New coverage: `cafe-search.test.ts` (3 tests — cold→fixtures, warm→live OSM
  ids, live coordinates) and `search-screen-content.test.tsx` (4 tests —
  cold curated open, warm real cafes with fixtures gone, query filtering,
  empty state). Search had **no** tests before this story.
- Wiring: new `utils/cafe-search.ts` `searchCafes`; `search-fixtures.ts`
  `SearchResult` drops `mapPosition`/`distance`, gains `latitude`/`longitude`,
  and exposes a shared `filterSearchResults`; the mini-map is now a real
  `MapView`.
- Platform (iPhone 15 Pro Expo Go, simulated location 32.7466,-117.1297): after
  the map warmed the OSM cache, Search listed real cafes — **Subterranean
  Coffee Boutique · 30th Street · 0.1 mi** with real tags — over a real Apple
  Maps mini-map with a score marker at its coordinates
  (`/tmp/cafemood-ios-simulator-us035-search-live.png`). Tap-through of a
  result card remains the standing backlog #2 tap-gap.
