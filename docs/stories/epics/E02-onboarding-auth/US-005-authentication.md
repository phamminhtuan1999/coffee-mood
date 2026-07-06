# US-005 Authentication: providers, email, guest mode

## Status

planned

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
- Provider wiring per decision 0008 (Supabase Auth) - confirm/supersede that decision before implementation.

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
- Commands / Queries / API / Tables: to be defined when the story is selected
  and the data model exists.
- Auth hard gate: expand this packet to docs/templates/high-risk-story/ folder (execplan/overview/design/validation) when selected for implementation.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-005 --unit 1 --integration 1 --e2e 0 --platform 0`.

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
