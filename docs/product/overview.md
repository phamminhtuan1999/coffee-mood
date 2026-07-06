# CafeMood Map — Product Overview

## Concept

CafeMood Map is a map-first, visual-first mobile app that helps users discover
beautiful coffee shops nearby based on vibe, not just rating. Users find cafés
for work, dates, aesthetic photos, quiet time, outdoor seating, good latte, or
café hopping routes.

Product promise: **"Find cafés by vibe, not just rating."**

## Target

- iOS-first mobile app (Expo / React Native), 390x844 design frame.
- Startup-pitch / portfolio quality bar ("2026 startup-ready").

## Experience Principles

Feel: ultra-modern, premium, warm, editorial, map-first, photo-first,
human-made, tactile, calm.

Avoid: generic AI-generated UI, Yelp-style listing pages, neon gradients,
random 3D blobs, cartoon mascots, overdone glassmorphism, SaaS dashboard
styling, repetitive card layouts, too many plain vertical lists.

## Core User Needs

Every main screen must serve one of:

1. Discover cafés visually (map + photo pins).
2. Match current mood (vibe chips, AI finder, filters).
3. Decide if a café is worth visiting (detail, scores, review insight).
4. Save cafés into a personal coffee map (collections, taste profile).
5. Plan a café route or outing (routes, work sessions, date plans).
6. Personalize recommendations (taste onboarding, check-ins, vibe clips).

## Business Goals

- Activation: understand the app quickly, reach the map fast, browse without
  signup (guest mode is a first-class path).
- Engagement: tap photo pins, view details, search by vibe, use AI finder.
- Retention: saved cafés, collections, taste profile, routes/work/date plans.
- Future monetization: premium AI routes, café owner profiles, clearly labeled
  sponsored discovery, curated city guides.

## Design Source

- **Primary (in-repo)**: Claude Design handoff extracted from
  `CoffeeMood-handoff.zip` into `docs/design/`:
  - `docs/design/project/CafeMood Complete App.dc.html` — 27 labeled frames
    (A1–A8 onboarding/auth, B1–B4 discovery, C1–C3 detail, D1–D3 save/library,
    E1–E4 planning, F1–F2 contribution, G1–G3 profile).
  - `docs/design/project/CafeMood Design System.dc.html` — component sheet
    (Buttons, VibeChip, ScoreBadge, PhotoMapPin, CafeBottomSheet,
    CafeImageCard, RouteStopCard) and tokens.
  - `docs/design/project/CafeMood Missing Screens.dc.html` — gap-fill
    companion (generated 2026-07-06): B5–B6 sheet collapsed/expanded in
    context, D4 create collection, D5 edit collection, D6 share café card,
    E5 replace route stop, G4 notification preferences.
  - `docs/design/project/CafeMood App Screens.dc.html` — early 4-screen MVP,
    reference only.
  - The `.dc.html` prototypes are HTML/CSS/JS; read the source directly and
    match output, don't copy internals (`docs/design/README.md`).
- Cloud mirror (synced 2026-07-06): claude.ai/design project **"CafeMood Map"**
  (design-system type, ID `68686769-51dd-408c-b361-fb9c3142d7d7`) holds all
  four `.dc.html` files plus `ios-frame.jsx` / `support.js`, including the
  Missing Screens gap-fill file. Sync direction is repo → cloud via the
  DesignSync tool; the repo copy stays authoritative.
- Cloud original (pre-handoff): [CafeMood Complete App](https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html)
  — the user's original design project; not API-writable, superseded by the
  handoff + mirror above.
- Design system contract: "Ambient Editorial Map" — `docs/product/design-system.md`.
- Screen coverage is complete as of 2026-07-06: the Complete App file's
  Section H covers system-state cards, B3/E3/E4 include their result views
  inline, and the Missing Screens file fills the remaining seven screens.

## Domain Map

| Epic | Domain | Product doc |
| --- | --- | --- |
| E01 | Design system foundation | `design-system.md` |
| E02 | Onboarding and auth | `onboarding.md` |
| E03 | Map discovery, search, AI finder | `discovery.md` |
| E04 | Café detail, gallery, save flow | `cafe-detail.md` |
| E05 | Routes, planners, check-ins | `planning.md` |
| E06 | Saved library, profile, settings | `library-profile.md` |
| E07 | Full-app QA and demo polish | (spans all) |

## Suggested Stack (Proposed, Not Decided)

See `docs/decisions/0008-cafemood-tech-stack.md`. Nothing is installed until a
story that needs it is selected.
