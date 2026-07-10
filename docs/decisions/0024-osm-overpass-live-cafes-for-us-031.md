# 0024 OpenStreetMap Overpass for Live Cafe Data (US-031)

Date: 2026-07-10

## Status

Accepted

## Context

Since US-030 the map home is a real Apple Maps view, but the cafes on it are
still the four curated fixtures — the map data layer stayed deferred
(decision 0010). The user asked for real cafe data with the same standing
constraints as US-029/US-030: no billing, no new accounts, and the app keeps
running in Expo Go.

Foursquare's free tier needs a developer account + API key; Google Places is
billing-gated. The OpenStreetMap Overpass API is free and keyless, and a
live probe near the fixture neighborhood (North Park, San Diego) returned 16
named cafes within 1.5 km with usable tags (name 16/16, opening_hours 11/16,
internet_access 6/16, outdoor_seating 6/16, addr:street 14/16).

## Decision

Fetch live cafes for the map home from **OpenStreetMap Overpass**
(`amenity=cafe` around a center), called **directly from the client**:

- No key or secret exists, so decision 0008's server-side-keys rule is not
  implicated; a Supabase proxy would add a hop for no hygiene gain.
- Center = real device location (foreground permission, 3 s race) with the
  San Diego fixture center as fallback; any failure at any step falls back
  to the four fixtures — the deterministic demo is never degraded.
- OSM tags map into the existing `CafeMapPin` shape; vibe scores for live
  cafes are deterministic hash-derived estimates surfaced under the
  limited-data notice (US-014's `limited` contract) — never presented as
  reviews. Detail facts (address, hours, Wi-Fi, outdoor seating) are real.
- Live data is scoped to the map home + detail; AI finder candidates,
  planners, search, and saved seeds remain the curated fixture world.
- Requests carry a `User-Agent` (Overpass 406s without one) and respect
  fair use: one fetch per map-home entry, ~20 results, 12 s abort.

This lifts decision 0010's data-layer deferral for the map home; 0010's
remaining scope (directions/navigation providers) stays deferred.

## Alternatives Considered

1. Foursquare Places free tier: richer metadata (ratings, photos) but needs
   an account + key via an Edge Function. Declined by the user; the natural
   upgrade path if richer live detail is wanted later.
2. Google Places: billing required; rejected.
3. Edge Function proxy over Overpass: rejected — no secret to protect, adds
   latency and a deploy surface.

## Consequences

Positive:

- Real cafes near the real user on the real map — zero cost, zero accounts,
  Expo Go preserved; fixture fallback keeps demos and tests deterministic.

Tradeoffs:

- OSM coverage/quality varies by neighborhood; some cafes lack hours/Wi-Fi
  tags, and vibe scores for live cafes are estimates by construction.
- Overpass is a shared community endpoint: fair-use limits apply, and a
  viral-scale app would need its own mirror or a paid provider (revisit
  under the high-risk lane).
- Live cafes have no photos/reviews, so their detail screens are
  permanently in limited mode until a richer provider lands.

## Follow-Up

- If richer live detail is wanted: Foursquare via Edge Function (same
  pattern as Groq), superseding the mapping layer only.
- Directions/navigation remain deferred with 0010.
