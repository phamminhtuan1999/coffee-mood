# 0009 Defer Map Provider For US-008

Date: 2026-07-07

## Status

Accepted

## Context

US-008 is the first story that selects the main discovery map surface. Decision
0008 proposes Mapbox as the first-choice renderer, but the repo has no accepted
map provider decision, credentials, backend cafe source, or provider-specific
validation path yet.

Installing a native map SDK now would create external-system risk before the
product slice needs live tiles or provider data.

## Decision

US-008 implements a provider-ready native UI surface using the existing warm
map shell, static cafe fixtures, and reusable photo pin components. It does not
install Mapbox, Google Maps, Places, or any credentialed provider.

The first provider-backed map story must either accept Mapbox from decision
0008 or supersede it with a new decision before installing SDK dependencies.

## Alternatives Considered

1. Accept Mapbox and install it in US-008.
2. Use Google Maps as the renderer in US-008.
3. Keep the existing handoff placeholder until a provider is available.

## Consequences

Positive:

- US-008 can prove the primary visual surface, filters, selected pins, and
  navigation without credentials.
- The app remains runnable in Expo Go for simulator validation.
- Provider choice stays explicit instead of implicit.

Tradeoffs:

- The map is not a live provider map yet.
- Later provider integration will need its own high-risk validation and may
  require native build proof beyond Expo Go.

## Follow-Up

- Revisit decision 0008 when live tiles, Places data, geocoding, or provider
  interactions become necessary.
