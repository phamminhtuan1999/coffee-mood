# Exec Plan

## Goal

Replace the illustrated map canvas on the map home (frame B1, US-008) with a
real interactive map so pins sit on actual geography and the user can pan and
zoom, while every existing overlay (search, filters, chips, FABs, state cards,
sheet, tab bar) keeps its current behavior.

## Scope

In scope:

- `react-native-maps` (Apple Maps on iOS via the default provider), which is
  bundled in Expo Go — no account, token, billing, or EAS dev build.
- Geographic coordinates for the four fixture cafes and the cluster pin
  (San Diego North Park / South Park / University Heights, matching the
  fixture neighborhoods).
- `PhotoMapPin` / `ClusteredPhotoPin` rendered as custom `Marker` children.
- Re-center behavior for the current-location FAB.
- Jest mock for `react-native-maps` so the existing Index suite stays green.

Out of scope:

- Mapbox custom styling (decision 0023 supersedes the 0010 Mapbox pick).
- Live cafe data / Places API (cafes remain the curated fixtures).
- Real device location (map centers on the fixture neighborhood).
- Dark-mode map styling (no dark-mode signal exists in the app yet).
- Android verification (no Android simulator in this environment).

## Risk Classification

Risk flags:

- External systems (map provider SDK).
- Existing behavior (map home is implemented and test-covered).
- Cross-platform (native map module; Expo Go compatibility).

Hard gates:

- External provider behavior → high-risk lane.

## Work Phases

1. Discovery: scoped `src/app/index.tsx` map canvas, pin layer, overlays,
   fixtures, and jest mocking strategy (done — see design.md).
2. Design: decision 0023 (Apple Maps via react-native-maps supersedes 0010).
3. Validation planning: validation.md (unit fixtures + mocked-map integration
   + simulator smoke).
4. Implementation: smallest vertical slice — swap the canvas, keep overlays.
5. Verification: tsc, lint, jest (Node 24), iPhone 15 Pro Expo Go smoke.
6. Harness update: story row, decision row, trace, backlog refresh.

## Stop Conditions

Pause for human confirmation if:

- Expo Go cannot render `react-native-maps` at SDK 57 (would force an EAS
  dev build — a direction change the user explicitly declined for Mapbox).
- The design requires map styling only Mapbox can deliver.
- Validation must be weakened (e.g. the Index suite cannot stay green under
  a mocked map).
