# Product Docs

This directory is intentionally generic and mostly empty in Harness v0.

When a user provides a project spec, derive smaller product contract files here
instead of keeping one large spec as the living plan. Name files by the product
domains that actually exist in that spec, for example `overview.md`,
`billing.md`, `workflows.md`, `permissions.md`, or `api-conventions.md`.

Do not create domain files before the spec just to fill the folder. Empty
structure is healthier than fake product truth.

## Current Product Contracts

- `overview.md` — CafeMood Map concept, experience principles, business goals,
  design source, epic/domain map.
- `design-system.md` — "Ambient Editorial Map" visual contract: color,
  typography, spacing, radius, shadow tokens, map style, core components.
- `onboarding.md` — splash, welcome, feature intro, auth (guest-first),
  location permission, taste onboarding.
- `discovery.md` — main map, photo pins, bottom sheet, search, AI café finder,
  filters, discovery system states.
- `cafe-detail.md` — café detail, gallery, review insight, save/collections,
  share card, detail states.
- `planning.md` — mood routes, work session planner, date plans, check-ins,
  vibe clips.
- `library-profile.md` — saved cafés, collections, taste profile, profile,
  settings, tab bar, app-wide states.

## Update Rule

When behavior changes:

1. Update the affected product doc.
2. Update or create the story packet.
3. Update durable proof status with `scripts/bin/harness-cli story add` or
   `scripts/bin/harness-cli story update`.
4. Record a decision if the change affects architecture, scope, risk, or a
   previously settled product rule.
