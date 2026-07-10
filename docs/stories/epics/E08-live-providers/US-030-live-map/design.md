# Design

## Domain Model

- `CafeMapPin` gains `latitude: number` and `longitude: number`; the legacy
  screen-pixel fields (`top`/`left`/`right`/`bottom`) are removed with the
  illustrated canvas. Coordinates are curated fixtures in the cafes' real
  neighborhoods (San Diego): Mostra (North Park), Marigold & Oak (North
  Park), Terrace & Thistle (South Park), Hearth Supply Co. (University
  Heights).
- `MAP_HOME_REGION`: the initial region derived from the pin coordinates
  (center + deltas with padding) exported from `src/data/map-pins.ts` so
  tests can assert it and the FAB can re-center to it.
- Business rule: every pin coordinate must fall inside `MAP_HOME_REGION`
  (unit-tested), so no marker renders off-screen at launch.

## Application Flow

- `MainMapHandoff` swaps `MapPreviewSurface` for a `MapView`
  (`provider` default → Apple Maps on iOS) with
  `initialRegion={MAP_HOME_REGION}` and `StyleSheet.absoluteFill` sizing.
- Each cafe renders as `<Marker coordinate={{latitude, longitude}}
  anchor={{x: 0.5, y: 1}} onPress={() => selectCafe(id)}>` wrapping the
  existing `PhotoMapPin` (selection ring behavior unchanged). Marker
  `tracksViewChanges` stays enabled on iOS so the selected ring updates.
- The `+3 more` cluster pin becomes a fifth `Marker` with its own curated
  coordinate wrapping `ClusteredPhotoPin`.
- Current-location FAB calls `mapRef.current?.animateToRegion(
  MAP_HOME_REGION, 400)` instead of being inert.
- Loading state: the skeleton pin layer renders as an absolute overlay above
  the map (same accessibility labels), markers hidden while loading so the
  skeleton remains the only pin surface.
- Filtered-out cafes simply have no `Marker` (same conditional as today).

## Interface Contract

- No network contract. The map module is `react-native-maps@1.27.2`
  (Expo SDK 57 pairing, bundled in Expo Go).
- Screen contract unchanged: overlays, sheet, tab bar, `?discovery=`
  overrides, accessibility labels (`"<Cafe name>"` pins, `"Loading cafes on
  the map"` skeleton) all keep their current shapes.

## Data Model

No persistence. Fixture-only coordinate fields.

## UI / Platform Impact

- iOS Expo Go: Apple Maps renders natively; smoke-verified on iPhone 15 Pro.
- Android: `react-native-maps` in Expo Go uses Google Maps with Expo's key;
  out of verification scope here.
- Jest: `react-native-maps` ships untranspiled and has no jest-expo stub, so
  `jest-setup.ts` registers a global mock (host-component `MapView`/`Marker`
  stubs that render children) keeping the Index suite intact.
- The cream glass overlays that softened the illustration are dropped from
  the map home so the real map stays legible. `MapPreviewSurface` itself is
  kept: the onboarding/location previews and the search screen still use the
  illustration as a decorative preview surface (out of scope here).

## Observability

None added — no provider calls, no secrets, nothing to log.

## Alternatives Considered

1. Mapbox (decision 0010's proposal): custom-styled map closest to the
   design comps, but requires an account + access token and a native module
   outside Expo Go (EAS dev build). Rejected by the user (no
   account/billing; keep Expo Go), recorded in decision 0023.
2. Keep the illustration and overlay a static map image tile: no interaction
   gain; rejected.
3. WebView + web map (Leaflet/MapLibre): works in Expo Go but non-native
   gestures, worse perf, and marker overlays are harder; rejected.
