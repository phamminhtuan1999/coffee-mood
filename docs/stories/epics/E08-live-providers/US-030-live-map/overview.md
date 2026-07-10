# Overview

## Current Behavior

The map home (frame B1, US-008/US-013/US-027) draws a decorative illustration:
`MapPreviewSurface` (`src/components/ui/map-preview-surface.tsx`) renders
absolutely-positioned Views for water/parks/roads, and cafe photo pins are
placed with hard-coded screen-pixel offsets (`top`/`left`/`right`/`bottom` on
`CafeMapPin` in `src/data/map-pins.ts`). The map cannot pan or zoom; the
current-location FAB is inert. Decision 0010 deferred the real map (proposing
Mapbox); decision 0008's stack kept the map layer presentational.

## Target Behavior

The map home renders a real interactive Apple Maps view
(`react-native-maps`, default provider) centered on the fixture neighborhood
(San Diego — North Park / South Park / University Heights). The four cafe
pins and the cluster pin are geographic `Marker`s wrapping the existing
`PhotoMapPin` / `ClusteredPhotoPin` components, so pin visuals, selection,
and the preview sheet behave exactly as today. The map pans/zooms natively;
the current-location FAB re-centers to the initial region. All overlays
(search bar, filter button + badge, vibe chips, FABs, loading/empty/denied/
offline cards, bottom sheet, tab bar) are unchanged, as are the
`?discovery=` QA overrides.

Provider note: Apple Maps via `react-native-maps` (bundled in Expo Go) per
decision 0023, superseding 0010's Mapbox proposal — no account, token,
billing, or EAS dev build required, matching the user's no-billing
constraint from US-029.

## Affected Users

- Explorer browsing the map: real panning/zooming geography.
- Developer/QA: map renders in Expo Go with zero new setup; jest suites run
  against a mocked map.

## Affected Product Docs

- `docs/product/discovery.md` (map home behavior)

## Non-Goals

- Mapbox styling, live cafe/Places data, real device location, dark-mode map
  styling, Android verification, clustering logic (the cluster pin remains a
  single curated marker).
