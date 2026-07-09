# US-026 Profile, settings, notification preferences

## Status

implemented

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

- Profile hub at `src/app/profile.tsx` (G2): persona avatar/name/meta (demo
  persona until a profile-editing model exists), three stat tiles (Saved and
  Collections live from the saved store; Visited 0 until visit history lands
  per 0018), four shortcut rows (Taste profile → `/taste`, Saved cafés →
  `/saved` with live count subtitle, My routes → `/route`, Settings →
  `/settings`), Edit profile (inert per 0020) + Preferences buttons.
- Settings at `src/app/settings/index.tsx` (G3): Account / Preferences /
  Privacy groups. Email shows the live session value ("Guest session" for
  guest). Sign out clears the local session and returns to the root - the
  first-run gate in `src/app/index.tsx` now checks the session before the
  taste profile so sign-out lands on splash/auth (decision 0020); the
  discovery-states test mock gained a session accordingly. Default vibe reads
  the live taste answers; Collections visibility derives Private/Mixed from
  the store. Preference value rows are display-only until a preferences data
  model exists. Delete account opens an in-screen confirm overlay
  ("Delete everything" / "Keep my account") and on confirm clears all local
  stores (session, taste, saves, notification prefs) - on this device-only
  build, local data is the account (decision 0020).
- Notification preferences at `src/app/settings/notifications.tsx` (G4):
  calm intro, five switch rows with sub-copy, "no guilt" footer. Persisted in
  `src/utils/notification-prefs.ts` (`cafemood.notification-prefs.v1`,
  defaults on/on/on/off/off). Push delivery stays deferred external-systems
  work (0020).
- QA override: `/profile?state=demo` renders counts from the demo library.
- Entry: deep links until the US-027 tab bar adds Profile.

## Harness Delta

- Decision 0020 records the local account semantics (session-first first-run
  gate, local-only delete, notification provider deferral).

## Validation

Intake #19 carried auth + audit/security + data-model flags (hard gates
narrowed to the local demo model by this packet), so validation is stronger
than baseline: store-level tests plus full confirm-flow integration tests.

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-026 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/utils/__tests__/notification-prefs.test.ts` (defaults, toggle, persistence, corrupt recovery); `src/data/__tests__/profile.test.ts` (live counts, settings groups, notification rows) |
| Integration | Profile rows, sign-out, confirm-guarded delete (cancel + confirm), toggle persistence in `src/app/__tests__/profile-settings.test.tsx`; first-run gate regression in `map-discovery-states.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 43 suites, 312 tests passing (14 new).
- Simulator smoke (iPhone 15 Pro, iOS 17.2, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/profile?state=demo` → `/tmp/cafemood-ios-simulator-us026-profile.png`
    (G2: avatar, live 4/6/0 stat tiles, shortcut rows, action buttons).
  - `--/settings` → `/tmp/cafemood-ios-simulator-us026-settings.png` (G3:
    live "Guest session" email value, live "Quiet" default vibe, danger-toned
    Delete account row).
  - `--/settings/notifications` →
    `/tmp/cafemood-ios-simulator-us026-notifications.png` (G4: five toggles
    in the calm default state, intro + footer copy).
- Sign out and delete verified in jest (session cleared, all stores cleared,
  confirm guard blocks accidental deletes). Interactive tap-through remains
  part of the human manual pass per decision 0012 / backlog #2.
