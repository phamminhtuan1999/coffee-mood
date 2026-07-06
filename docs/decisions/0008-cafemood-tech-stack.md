# 0008 — CafeMood Tech Stack (Proposed)

## Status

Proposed — not accepted. No dependency may be installed on the basis of this
document alone; acceptance happens when the first story that needs a given
layer is selected.

## Context

The CafeMood Map spec (intake #1, 2026-07-06) suggests a stack. The repo today
is Expo SDK 57 + expo-router + TypeScript with no backend, styling library,
map, or AI integration.

## Proposed Stack

| Layer | Proposal | Open questions |
| --- | --- | --- |
| App | Expo + React Native + TypeScript (already in repo) | — |
| Navigation | Expo Router (already in repo) | — |
| UI | NativeWind **or** Tamagui; React Native Reanimated (in repo); Gorhom Bottom Sheet | NativeWind vs Tamagui undecided |
| Map | Mapbox first choice; Google Maps/Places for café data | Mapbox vs Google as render layer; Places licensing/cost |
| Backend | Supabase (Postgres + PostGIS, Auth, Storage, Edge Functions) | — |
| AI | OpenAI or Gemini, server-side only via Edge Functions | Provider choice; prompt/cost budget |
| Analytics | PostHog or Firebase Analytics | Provider choice |
| Notifications | Expo Notifications | — |
| Payments (later) | RevenueCat | Deferred until monetization work |
| Deployment | EAS Build, TestFlight, Play Internal Testing | — |

## Consequences

- Auth, map provider, AI provider, storage, and notifications are all
  external-system / auth hard gates: the stories that first touch them are
  high-risk lane and must confirm this decision (or supersede it) before
  implementation.
- AI calls never run on-device/client-side; only through Edge Functions.
- Sponsored content, if ever added, must be clearly labeled (see
  `docs/product/overview.md` business goals).

## Follow-up

Escalate this record to Accepted (or split per-layer decisions) when E02
(auth), E03 (map/AI), or backend-dependent stories are selected.
