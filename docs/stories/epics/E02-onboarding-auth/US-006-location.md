# US-006 Location permission primer and manual search

## Status

planned

## Lane

normal

## Product Contract

Location is primed in-app before the OS dialog; privacy-conscious users can pick a city or neighborhood manually instead.

## Relevant Product Docs

- `docs/product/onboarding.md`

## Acceptance Criteria

- Primer: 'Find cafes near you' rationale; Use Current Location / Choose Manually; small map illustration with photo pins.
- Manual search: search-first layout, recent locations, popular neighborhoods (San Diego, Mira Mesa, La Jolla, North Park, Convoy), use-current-location link.
- Denied OS permission falls back gracefully to the manual path.
- Location is sensitive data: never in URLs or logs.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: A6 - Location Permission; A7 - Manual Location
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Location Permission Primer Screen; Manual Location Search Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-006 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
