# Overview

## Current Behavior

The map home (live Apple Maps since US-030) renders exactly four curated
fixture cafes at hand-picked San Diego coordinates. Real places never appear;
decision 0010 deferred the map data layer.

## Target Behavior

On entering the map home, the app determines a center — the device's real
location when foreground permission is granted, otherwise the San Diego
fixture center — and fetches up to ~20 real cafes around it from the
OpenStreetMap Overpass API (keyless, free). Live cafes render as the same
photo pins, flow through chips/filters/selection/sheet unchanged, and the
camera fits the live pin spread. Tapping through to detail shows the
designed limited-data mode (real address/hours/Wi-Fi facts, estimate-labeled
vibe scores, no editorial content).

Failure behavior: any location or network failure silently falls back to
the four fixtures — the demo never degrades below today's behavior. Offline
(`?discovery=offline`) keeps its saved-pins contract.

## Affected Users

- Explorer: sees actual cafes near them; the map is real end-to-end.
- Developer/QA: fixture mode remains fully deterministic (jest mocks the
  fetch; QA overrides unchanged).

## Affected Product Docs

- `docs/product/discovery.md` (map home data source)
- `docs/product/cafe-detail.md` (limited-data mode now reachable live)

## Non-Goals

- Live data in AI finder/planners/search/saved (fixtures remain).
- Cafe photos/reviews/insights for live cafes.
- Server-side proxy or caching for Overpass.
