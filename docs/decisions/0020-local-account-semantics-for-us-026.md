# 0020 Local Account Semantics for US-026

Date: 2026-07-09

## Status

Accepted

## Context

US-026 ships the profile hub, settings, and notification preferences. The
acceptance criteria require "Sign out works" and a confirm-guarded delete
account flow - both auth/audit hard-gate territory in the intake checklist.
But the app has no backend: auth is the local demo session from US-005
(providers presentational per decision 0008), and all user data lives in
device localStorage stores (decisions 0011/0014).

The accepted story packet explicitly narrowed the scope to this local demo
model ("audit/security flag at implementation"), which is why the work runs
in the normal lane with stronger validation instead of the high-risk
template.

## Decision

- Sign out clears the local auth session only (`clearAuthSession`) and
  returns to the map root. The first-run gate in `src/app/index.tsx` now
  checks the session before the taste profile, so a signed-out visitor lands
  on splash/auth again while their taste answers and saves survive for the
  next sign-in.
- Delete account is guarded by an explicit in-screen confirm step (title
  "Delete account?", destructive copy, "Delete everything" vs "Keep my
  account") and clears every local store: auth session, taste profile, saved
  store, notification preferences. On this device-only build, local data IS
  the account, so this is a faithful delete.
- Notification preferences persist locally
  (`cafemood.notification-prefs.v1`, calm defaults: discovery toggles on,
  social toggles off). Actual push delivery via Expo Notifications + a
  provider remains deferred external-systems work and must expand to the
  high-risk template (and confirm or supersede decision 0008) before
  implementation.
- Profile identity stays the G2 demo persona (Jamie Rivera); Edit profile is
  inert until a profile-editing data model exists. Countable values (saves,
  collections, session email, default vibe, collections visibility) derive
  live from the local stores.

## Alternatives Considered

1. High-risk lane with full execplan: rejected - the human-accepted packet
   already narrowed scope to local demo semantics; no provider, contract, or
   cross-role surface changes.
2. Sign out also clearing taste/saves: rejected - destroys user data on a
   reversible action; delete account is the explicit destructive path.
3. OS-level Alert.alert for the confirm: rejected - the in-screen overlay
   keeps the designed warm idiom and is testable with RNTL.

## Consequences

Positive:

- Sign out and delete behave truthfully within the local data model and are
  fully test-covered, including the confirm guard.

Tradeoffs:

- No real account lifecycle (revocation, server-side erasure) until a backend
  exists; delete is device-local by definition.

## Follow-Up

- Real auth/notification providers re-enter through the high-risk lane and
  revisit 0008.
