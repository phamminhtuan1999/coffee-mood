# US-026 Profile, settings, notification preferences

## Status

planned

## Lane

normal

## Product Contract

Profile hub (avatar, counts, shortcuts) with clean warm settings (account, preferences, privacy including delete account) and calm notification toggles.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Profile, Settings, Notification Preferences screens per library-profile.md.
- Sign out works; delete account is a confirm-guarded flow (audit/security flag at implementation).
- Notification prefs: five toggles, persisted.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: G2 - Profile; G3 - Settings
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: G4 - Notification Preferences (5 interactive toggles with calm sub-copy)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Profile Screen; Settings Screen; Notification Preferences Screen
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-026 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
