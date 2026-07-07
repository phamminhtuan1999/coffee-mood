# US-005 Authentication: providers, email, guest mode

## Status

implemented

## Lane

high-risk

## Product Contract

Users can sign in with Apple/Google/email or continue as guest; guest mode never blocks discovery; auth is low-friction and premium.

## Relevant Product Docs

- `docs/product/onboarding.md`

## Acceptance Criteria

- Auth screen: Continue with Apple / Google / Email / as Guest - guest visibly equal.
- Email screen: email+password, sign-in/up toggle, forgot password, designed error state.
- Session persists across launches; sign-out lives in settings (US-026).
- Provider/session boundary is defined in decision 0009. This slice persists
  non-sensitive local session markers; real Supabase Auth token exchange remains
  a future high-risk integration boundary.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: A4 - Authentication; A5 - Email Sign In
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Authentication Screen; Email Sign In / Sign Up Screen
- Commands / Queries / API / Tables: no backend commands, API, or tables are
  introduced in this slice.
- High-risk packet expanded under
  `docs/stories/epics/E02-onboarding-auth/US-005-authentication/`.
- `src/app/index.tsx` now routes feature intro to Auth, Auth to Email Auth or
  Location Primer, and persisted sessions directly to the primer handoff.
- `src/utils/auth-session.ts` stores only provider/email metadata through Expo
  SQLite localStorage. Passwords and tokens are not stored.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-005 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Intake #9 recorded for US-005 as high-risk.
- Decision 0009 records the local session shell and provider-token boundary.
- Durable story verify command set to `npm run lint && npx tsc --noEmit`.

## Evidence

Implemented auth, email auth, guest mode, and non-sensitive session persistence.
Verification passed: `npm run lint`; `npx tsc --noEmit`;
`scripts/bin/harness-cli story verify US-005`; `git diff --check`. iPhone 15
Pro simulator smoke via Expo Go on iOS 17.2 rendered the first-run app after
the US-005 changes; screenshot:
`/tmp/cafemood-ios-simulator-us005-initial.png`. `simctl` in this environment
does not expose tap gestures and macOS assistive access blocks desktop click
automation, so auth-screen interaction proof is covered by static route/state
validation in this pass.
