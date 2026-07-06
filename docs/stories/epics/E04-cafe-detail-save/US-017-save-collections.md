# US-017 Save to collection and create collection

## Status

planned

## Lane

normal

## Product Contract

Saving is fast: pick or create a collection, optional private note, clear selected states; the whole interaction takes a few seconds.

## Relevant Product Docs

- `docs/product/cafe-detail.md`
- `docs/product/library-profile.md`

## Acceptance Criteria

- Default collections per cafe-detail.md (Want to Try, Work Spots, Date Spots, Aesthetic, Best Latte, Hidden Gems).
- Create modal: name, optional description, Private/Public toggle, suggested names.
- Private note placeholder 'Try on a weekday morning.'; saved state reflects on pins and cards.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: D1 - Save to Collection (collection grid, private note, create-new affordance)
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: D4 - Create Collection (name, description, suggested names, interactive Private/Public toggle, Create CTA)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06: dedicated create-collection modal designed.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Save to Collection Screen; Create Collection Modal
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-017 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
