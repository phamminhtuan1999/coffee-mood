# 0009 US-005 Auth Session Boundary

Date: 2026-07-07

## Status

Accepted

## Context

US-005 is the first authentication story. The product contract requires Apple,
Google, email, and guest entry points, plus session persistence. Decision 0008
lists Supabase Auth as proposed, but it is not accepted and the repo has no
Supabase project URL, anon key, redirect contract, or backend environment
boundary yet.

Implementing real OAuth or password auth without that contract would create
misleading provider behavior and token-storage risk.

## Decision

US-005 implements the app-facing authentication surfaces and a typed,
non-sensitive session shell:

- Apple, Google, email, and guest entry points are visible in the onboarding
  flow.
- Guest mode is equal-weight and persists as a local session marker.
- Email mode validates email/password shape locally and persists only the email
  identity marker after a successful client-side form submit.
- Provider entry points persist the selected provider marker only; no OAuth
  token exchange, password submission, refresh token, or Supabase API call is
  performed in this slice.
- Session persistence uses Expo SQLite localStorage for non-sensitive metadata.
  Future real tokens must use a secure storage/provider adapter design before
  being introduced.

Real Supabase Auth wiring remains a separate high-risk boundary that must define
environment variables, redirect URLs, provider configuration, token storage,
error contracts, and integration tests before external auth behavior ships.

## Alternatives Considered

1. Install Supabase and wire provider calls immediately. Rejected because no
   accepted environment/provider contract exists.
2. Keep US-005 UI-only with no persistence. Rejected because the story requires
   sessions to persist across launches.
3. Store email/password locally. Rejected because passwords are sensitive and
   must not be stored by the client shell.

## Consequences

Positive:

- The onboarding flow can progress through auth and guest mode without blocking
  discovery.
- No credentials or tokens are stored in this prototype slice.
- The external-provider boundary stays explicit for the next auth integration
  task.

Tradeoffs:

- Apple/Google/email buttons do not yet authenticate with real providers.
- Future Supabase work must replace the local provider markers with real
  provider/session adapters and tests.

## Follow-Up

- Add a future high-risk Supabase Auth integration story when project
  credentials, redirect URLs, and provider configuration exist.
