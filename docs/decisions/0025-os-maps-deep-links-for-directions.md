# 0025 OS Maps Deep Links for Directions (US-032)

Date: 2026-07-10

## Status

Accepted

## Context

Decision 0010 deferred directions/navigation alongside the map provider, so
every Directions button shipped inert. Since then the map went live (0023)
and pins carry real coordinates (0024) — the deferral's premise ("no real
geography to navigate to") no longer holds. The user reported the dead
buttons as a bug.

## Decision

Directions buttons open the **OS maps app via URL scheme** at the cafe's
real coordinates — `maps://?daddr=<lat>,<lng>&q=<name>` (Apple Maps) on iOS,
`geo:` on Android, `https://maps.apple.com` as web fallback — and the cafe
detail's "Open in Google Maps" opens the Google Maps web search URL. All via
`Linking.openURL` with failures swallowed; no SDK, key, account, or network
provider is involved, so decision 0008 is untouched.

Scope: cafe preview sheet, cafe detail sticky bar, saved-library quick
action. Route-level "Start Navigation" (multi-stop) stays deferred with
decision 0016; in-app turn-by-turn remains out of scope.

This supersedes the *directions* portion of decision 0010; nothing else in
0010 changes.

## Alternatives Considered

1. In-app directions (Mapbox/Google Directions API): needs accounts/billing
   and an EAS build; rejected per the standing constraint.
2. `showsUserLocation` + in-map routing on react-native-maps: no routing
   engine without a provider; rejected.

## Consequences

Positive:

- Every Directions button now does the expected thing at zero cost, and the
  handoff target (Apple Maps) matches the map provider users already see.

Tradeoffs:

- Navigation leaves the app (OS handoff) rather than staying in-app.
- Live OSM cafes navigate to coordinates, which can be a few meters off the
  storefront depending on OSM data quality.

## Follow-Up

- Route detail "Start Navigation" could chain multi-stop Apple Maps links
  later (own story under 0016's scope).
