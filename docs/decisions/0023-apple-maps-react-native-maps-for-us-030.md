# 0023 Apple Maps via react-native-maps for US-030 (supersedes 0010's provider proposal)

Date: 2026-07-10

## Status

Accepted

## Context

Decision 0010 deferred the real map layer and proposed Mapbox as the eventual
provider (matching the design comps' custom-styled map). US-030 now brings the
map home live. Mapbox requires an account plus an access token, and its native
SDK does not run in Expo Go — the project would need an EAS dev build,
changing how every simulator smoke in this repo works. In US-029 the user
explicitly declined provider setups that require billing/accounts, and chose
to stay on the free path again here.

`react-native-maps` is bundled in Expo Go (SDK 57 pairing 1.27.2): the
default provider renders Apple Maps on iOS with zero accounts, tokens,
billing, or build changes.

## Decision

Implement the live map home with **react-native-maps (default provider —
Apple Maps on iOS)**:

- No API key anywhere (client or server); decision 0008's no-client-secrets
  rule is untouched because there is no secret.
- Cafe pins become geographic `Marker`s (curated San Diego fixture
  coordinates on `CafeMapPin`) wrapping the existing `PhotoMapPin` /
  `ClusteredPhotoPin` components; selection and sheet behavior unchanged.
- The illustrated `MapPreviewSurface` and its screen-pixel pin offsets are
  removed.
- Expo Go remains the runtime for all platform smokes (decision 0012's
  dual-proof flow is preserved unchanged).

This supersedes the *provider proposal* in decision 0010; 0010's deferral
reasoning and everything else stands. On Android, Expo Go serves
`react-native-maps` through Google Maps with Expo's own key — acceptable and
out of this story's verification scope.

## Alternatives Considered

1. Mapbox (0010's proposal): closest to the design comps' custom map style,
   but needs an account + token and an EAS dev build (no Expo Go). Declined
   by the user.
2. Google Maps provider on iOS: requires an API key + native config — same
   Expo Go problem, plus billing.
3. WebView map (Leaflet/MapLibre): free and Expo Go-safe but non-native
   gestures and awkward custom markers; rejected.

## Consequences

Positive:

- Real interactive map with zero cost, zero setup, zero secrets, still in
  Expo Go — simulator QA flow unchanged.
- Pins move to real geography, unblocking future location/provider work.

Tradeoffs:

- Apple Maps styling cannot match the design comps' warm custom map; the
  cream illustration look is lost on the home canvas.
- Provider differs per platform (Apple on iOS, Google on Android) — visual
  parity across platforms is not guaranteed.
- If custom styling becomes a requirement, moving to Mapbox later means an
  EAS dev build (revisit under the high-risk lane).

## Follow-Up

- Real device location (centering on the user) remains deferred with 0010's
  data-layer scope.
- Dark-mode map styling once the app gains a dark-mode signal.
