# Overview

## Current Behavior

The first-run flow reaches a location-primer handoff directly after the feature
intro or guest welcome path. There is no authentication screen, email form, or
session persistence.

## Target Behavior

Users see a premium authentication step after the feature intro with Apple,
Google, Email, and Guest choices. Guest remains equally visible. Email opens a
dedicated sign-in/sign-up form with validation and forgot-password state.
Choosing any supported auth path stores a non-sensitive local session marker and
continues to the location-primer handoff.

## Affected Users

- First-time app users.
- Guest users who want discovery without signup.
- Returning users with a local session marker on the device.

## Affected Product Docs

- `docs/product/onboarding.md`
- `docs/decisions/0009-us005-auth-session-boundary.md`

## Non-Goals

- Real provider authentication.
- Supabase project configuration.
- Secure token storage.
- Settings sign-out.
- Location permission behavior.
