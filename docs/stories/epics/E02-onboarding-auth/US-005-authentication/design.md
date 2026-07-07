# Design

## Domain Model

`AuthSession` is a local app-facing session marker:

- `provider`: `guest`, `apple`, `google`, or `email`.
- `email`: optional normalized email for email mode.
- `createdAt`: ISO timestamp for local persistence.

The marker is not a security credential and does not represent a verified
identity.

## Application Flow

```text
Splash -> Welcome -> Feature Intro -> Auth -> Location Primer
Auth -> Continue as Guest -> Location Primer
Auth -> Continue with Email -> Email Auth -> Location Primer
Welcome -> Explore as Guest -> Location Primer
Stored session -> Location Primer
```

## Interface Contract

The initial app surface is a local route state machine in `src/app/index.tsx`.
Auth actions produce local `AuthSession` values through
`src/utils/auth-session.ts`.

Email validation is client-side only:

- Email must contain `@` and `.`.
- Password must be at least 8 characters.
- Password is never persisted.

## Data Model

No backend tables or user records are created. Session metadata is serialized to
Expo SQLite localStorage under a versioned app key.

## UI / Platform Impact

The auth screen follows frames A4 and A5 from
`docs/design/project/CafeMood Complete App.dc.html`:

- Centered brand mark.
- Short premium auth copy.
- Stacked Apple, Google, Email buttons.
- Equal visible guest action.
- Soft card email form with toggle, forgot password, and message/error state.

## Observability

Harness evidence is captured through story verification, simulator smoke proof,
and trace records. Product analytics are out of scope.

## Alternatives Considered

1. Real Supabase Auth in US-005. Rejected until provider credentials, redirect
   URLs, and secure token storage are defined.
2. UI-only auth. Rejected because the story requires session persistence.
