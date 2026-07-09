# 0017 Defer Date Plan Save, Share, And Navigation Providers For US-021

Date: 2026-07-09

## Status

Accepted

## Context

US-021 ships the date plan screen (frame E4): area/time/budget input cards, a
mood chip row (Cozy, Aesthetic, Quiet, Fun, Outdoor), a Create Date Plan CTA,
and the generated "Your plan" card - cafe, three timeline steps including a
dessert/walking stop, and a best-time vibe tip - with a live Shuffle rotation.

Three actions need capabilities the repo does not have:

- "Save this plan" needs a plan-persistence layer. The client-side saved store
  (decision 0014) holds café saves and collections, not plans; a saved-plans
  library is E06 territory, the same gap decision 0016 records for Save Route.
- "Share" needs the clipboard / view-shot / share provider deferred in
  decision 0015.
- "Start Navigation" needs the maps/navigation provider deferred in decision
  0010.

Plan generation itself is deterministic by mood over pin-backed date profiles -
no live AI, consistent with decision 0013. `query tools` registers none of the
missing capabilities, so per the harness rule an absent capability is a clean
skip.

## Decision

US-021 implements the full E4 screen with deterministic plan selection
(`src/data/date-plan.ts`) and a live Shuffle that rotates through the date
profiles without randomness. Save this plan, Share, and Start Navigation render
but stay inert, matching the app's other provider-deferred actions. State is
screen-local (no store): a generated date plan is ephemeral session state, the
same reasoning as the route planner store in decision 0016.

Entry is deep-link only (`/date`, QA override `?state=plan`) until the US-027
Plan tab adds the durable entry.

## Alternatives Considered

1. Persist plans into the decision-0014 saved store now - stretches a
   café-save schema to hold plan documents before the E06 library design
   exists; both Save Route (0016) and Save this plan should land together with
   that design.
2. Wire Share to the React Native core Share API for text - same rejection as
   decision 0015: a half-working share row contradicts the card-based share
   contract.
3. Leave Shuffle inert too - unnecessary; rotation needs no provider and makes
   the plan feel alive, so it ships live.

## Consequences

Positive:

- The full date plan flow is demoable and testable in Expo Go with no new
  dependencies; mood-driven selection and Shuffle rotation are pinned by unit
  and integration tests.

Tradeoffs:

- Save this plan / Share / Start Navigation do nothing until their providers
  land, consistent with the other deferred actions.
- A generated plan does not survive an app restart until plan persistence
  lands in E06.

## Follow-Up

- The E06 saved-library work adds plan/route persistence and wires Save this
  plan alongside Save Route (decision 0016).
- The share provider work (decision 0015) wires Share; the map provider work
  (decision 0010) wires Start Navigation.
- US-027 adds the Plan tab as the durable entry.
