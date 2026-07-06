# US-008 Main map home with photo pins

## Status

planned

## Lane

high-risk

## Product Contract

Full-screen warm-styled map with photo pins, clustering, vibe chips, floating search, Ask AI pill, and location button - the primary app surface.

## Relevant Product Docs

- `docs/product/discovery.md`

## Acceptance Criteria

- Custom map style: beige roads, muted olive parks, soft dusty water, minimal POI - never default provider colors.
- Photo pins and clusters (US-003) render cafe data; tap opens the preview sheet (US-009).
- Vibe chip row filters pins; search bar and Ask AI pill route to their screens.
- Mostra Coffee reference selection state matches discovery.md.
- Map provider per decision 0008 (Mapbox first choice) - confirm/supersede before implementation.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: B1 - Main Map Home
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: 02 - Aesthetic Map (early MVP reference)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: B1 uses Leaflet with a warm sepia tile filter in the prototype; map provider for the real app is decision 0008.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Main Map Home Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.
- External provider hard gate: expand to high-risk story folder when selected.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-008 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

None yet.

## Evidence

None yet - story is planned, not selected for implementation.
