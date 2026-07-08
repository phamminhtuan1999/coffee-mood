# Overview

## Current Behavior

After onboarding, the app shows a temporary "map is ready" handoff card with a
small decorative map preview. The primary discovery surface is not implemented.

## Target Behavior

After onboarding, the app lands on the full-screen main map home with warm map
styling, cafe photo pins, a selected Mostra Coffee preview, horizontal vibe
filters, search navigation, Ask AI navigation, a location control, and bottom
navigation affordances.

## Affected Users

- CafeMood users browsing nearby cafes after onboarding.

## Affected Product Docs

- `docs/product/discovery.md`
- `docs/decisions/0008-cafemood-tech-stack.md`
- `docs/decisions/0009-defer-map-provider-for-us-008.md`

## Non-Goals

- Install or configure Mapbox, Google Maps, or Places credentials.
- Implement the full US-009 bottom sheet state machine.
- Implement the full US-010 semantic search result experience.
- Implement the full US-011 AI finder result experience.
