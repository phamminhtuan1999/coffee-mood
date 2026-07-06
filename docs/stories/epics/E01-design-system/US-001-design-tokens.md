# US-001 Design tokens and theme foundation

## Status

planned

## Lane

normal

## Product Contract

App exposes the Ambient Editorial Map token set (colors, type scale, spacing, radius, shadows) as the single theme source.

## Relevant Product Docs

- `docs/product/design-system.md`

## Acceptance Criteria

- All color/spacing/radius/shadow/type tokens from docs/product/design-system.md exist in one theme module (extends src/constants/theme.ts).
- No screen uses hard-coded one-off colors; tokens only.
- Serif (editorial) + sans (UI) font pairing wired via expo-font.
- 8-point spacing scale and 20px screen padding constants exported.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Design System.dc.html`
    - Frames: token sheet (colors, type, spacing, radius, shadows)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Tokens also appear inline throughout the Complete App file; the token sheet is authoritative.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: CafeMood Design System (token sheet)
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-001 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
