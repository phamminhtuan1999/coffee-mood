# Exec Plan

## Goal

Ship the first usable main map home after onboarding while keeping external map
provider work explicit and deferred.

## Scope

In scope:

- Full-screen warm map home.
- Static cafe fixtures with photo pins, cluster affordance, and selected state.
- Vibe chip filtering.
- Mostra Coffee selected by default with product-contract scores and summary.
- Search and Ask AI navigation targets.
- iOS simulator smoke proof.

Out of scope:

- Mapbox, Google Maps, Places, or geocoding provider integration.
- Real cafe data fetching.
- Persisted saved cafes.
- Full bottom sheet, search, AI result, and tab flows.

## Risk Classification

Risk flags:

- External systems: map provider decision is touched but provider integration is
  intentionally deferred.
- Public contracts: primary app surface changes from placeholder to map home.
- Cross-platform: native safe areas and Expo Go rendering must be verified.
- Existing behavior: first-run handoff after taste onboarding changes.

Hard gates:

- External provider behavior is avoided in this PR; see decision 0010.

## Work Phases

1. Discovery: read product docs, US-008 packet, design frame B1, decision 0008,
   existing US-003 map shell components.
2. Design: record provider deferral and static-fixture contract.
3. Validation planning: lint, TypeScript, story verify, diff check, simulator
   smoke screenshot.
4. Implementation: replace handoff surface and add route targets.
5. Verification: run checks and update durable story proof.
6. Harness update: update story packet, decision, matrix evidence, and trace.

## Stop Conditions

Pause for human confirmation if:

- Provider credentials become required.
- A real external map SDK must be installed.
- The story needs backend cafe data or persisted saved state.
- Validation requirements need to be weakened beyond the known simulator
  interaction limitation.
