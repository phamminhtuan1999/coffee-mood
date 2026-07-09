# 0016 Defer Route Navigation, Save, And Share Providers For US-019

Date: 2026-07-09

## Status

Accepted

## Context

US-019 ships the mood route planner flow: a planner screen (area, mood,
duration, transport, stop count → Generate Route), a route detail screen (map
line, numbered stops, travel/distance/parking, vibe summary), and a replace-stop
screen (reasoned alternatives that swap into the route). The interactive core -
inputs → generate → detail → replace → swap - is fully implemented and reactive.

Three of the route detail actions, plus one planner affordance, need
capabilities the repo does not have:

- "Start Navigation" needs a maps/navigation provider - deferred for the whole
  app per decision 0010 (map provider) and 0008 (no un-scoped native additions).
- "Save Route" needs a route-persistence layer. The client-side save store from
  decision 0014 stores café saves and collections, not routes; a saved-routes
  library is E06 territory (US-023+).
- "Share" (route detail glass button) needs the clipboard / view-shot / share
  provider deferred for cafés in decision 0015.
- "Change" (planner starting area) needs a location/area picker beyond this
  slice's scope.

Route generation itself is deterministic from fixtures, not a live routing or AI
service - consistent with decision 0013 deferring the AI provider. `query tools`
registers none of these capabilities, so per the harness rule an absent
capability is a clean skip.

## Decision

US-019 implements the full three-screen route flow with a deterministic,
input-driven route generator (`src/data/route-plan.ts`) and an ephemeral,
in-memory reactive store (`src/utils/route-planner-store.ts`) shared across the
planner, detail, and replace screens. Generate Route, the per-stop Replace
affordance, alternative selection, and the swap-updates-the-route behavior are
all live and covered by unit + integration tests.

Start Navigation, Save Route, the route Share button, and the planner's Change
affordance render but stay inert, matching the other provider-deferred actions
in the app (Directions, Add to Route, Open in Google Maps, café Share). The
route store is deliberately in-memory only (not persisted to localStorage),
because a generated route is ephemeral session state; persistence arrives with
the Save Route provider.

The cafe detail "Add to Route" action (previously inert) becomes the provisional
in-app entry to the planner (`router.push("/route")`) until the US-027 bottom
tab bar adds a dedicated Plan tab. All three screens are also reachable by QA
deep link (`/route`, `/route/detail`, `/route/replace?stop=N`).

## Alternatives Considered

1. Wire Save Route into a new persisted routes store now - duplicates the E06
   saved-library data model and validation before that story is designed; the
   route store would need a schema, migration, and library UI to be meaningful.
2. Wire Start Navigation to a device maps deep link - contradicts decision 0010,
   which defers the map/navigation provider app-wide behind a single validated
   change.
3. Leave "Add to Route" inert and rely on deep links only - leaves the flow
   unreachable in-app before US-027, hurting demo continuity.

## Consequences

Positive:

- The full planner → detail → replace flow is demoable and testable in Expo Go
  with no new dependencies; its data and swap behavior are pinned by unit and
  integration tests.
- The in-memory store keeps route state coherent across the three screens and
  makes the replace-updates-detail behavior deterministic.

Tradeoffs:

- Start Navigation / Save Route / route Share / Change do nothing until their
  providers land, consistent with the other deferred actions.
- A generated route does not survive an app restart until Save Route persists
  it; this is acceptable for the current session-scoped flow.

## Follow-Up

- A saved-routes story (E06) adds route persistence and reuses this store's
  shape, then wires Save Route and confirms or supersedes decision 0014.
- The map/navigation provider work (decision 0010) wires Start Navigation.
- The share provider work (decision 0015) wires the route Share button.
- US-027 adds the Plan tab as the durable entry, replacing the provisional
  "Add to Route" wiring.
