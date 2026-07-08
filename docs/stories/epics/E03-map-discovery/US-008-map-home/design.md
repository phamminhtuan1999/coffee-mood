# Design

## Domain Model

US-008 uses deterministic cafe fixtures for the first discovery surface.
`CafeMapPin` captures the cafe id, display name, location metadata, vibe tags,
score, score breakdown, AI-style summary, visual pin tone, saved state, and map
placement.

## Application Flow

1. First-run onboarding completes with a taste profile.
2. The app opens the `main-map` step.
3. Mostra Coffee is selected by default.
4. Tapping a photo pin selects that cafe and refreshes the preview sheet.
5. Tapping a vibe chip filters visible pins and selects the first matching cafe.
6. Tapping search routes to `/search`.
7. Tapping Ask AI routes to `/ai-finder`.

## Interface Contract

- `src/app/index.tsx` owns the main map home route state for this slice.
- `/search` and `/ai-finder` are lightweight route targets so map controls have
  working navigation. Their full behavior remains owned by US-010 and US-011.
- The map uses the existing `MapPreviewSurface`, `PhotoMapPin`, and
  `ClusteredPhotoPin` components from US-003.

## Data Model

No persisted data model changes. Cafe data is static fixture data until a later
provider-backed discovery story defines data ownership and API contracts.

## UI / Platform Impact

The temporary scroll handoff screen is replaced by a full-screen native map
home. Safe area insets drive top controls and the bottom tab bar padding.

## Observability

No runtime logs or audit records are added. Harness trace and story evidence
record validation.

## Alternatives Considered

1. Install Mapbox now: rejected for this slice because decision 0008 is still
   proposed, credentials are not available, and native provider setup would
   outgrow the first UI story.
2. Keep the placeholder handoff: rejected because US-008 is the primary app
   surface and must prove the visual map home behavior now.
