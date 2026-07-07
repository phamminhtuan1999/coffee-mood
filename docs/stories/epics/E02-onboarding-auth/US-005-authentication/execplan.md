# Exec Plan

## Goal

Implement the US-005 first authentication slice: premium auth surfaces, equal
guest entry, email form states, and non-sensitive session persistence.

## Scope

In scope:

- Authentication screen after the feature intro carousel.
- Continue with Apple, Google, Email, and Guest entry points.
- Email sign-in/sign-up toggle, forgot-password affordance, validation message,
  and designed error state.
- Local session marker persistence for guest, provider, and email modes.
- Documentation of the provider/token boundary.

Out of scope:

- Real Supabase Auth API calls.
- OAuth redirect handling.
- Password reset email delivery.
- Secure token persistence.
- Settings sign-out UI, which belongs to US-026.

## Risk Classification

Risk flags:

- Auth.
- External systems.
- Public contracts.
- Cross-platform.
- Weak proof.

Hard gates:

- Auth.
- External provider behavior.

## Work Phases

1. Discovery of the existing onboarding flow, product docs, story packet, and
   proposed stack decision.
2. Boundary decision for local session shell versus real provider wiring.
3. Implementation of auth and email surfaces in the first-run route.
4. Session persistence through Expo SQLite localStorage.
5. Static validation and iOS simulator smoke proof.
6. Harness story, decision, and trace updates.

## Stop Conditions

Pause for human confirmation if:

- Real OAuth/provider behavior is required before Supabase credentials exist.
- Credentials, refresh tokens, or user records need to be stored.
- The validation plan would need to skip static proof or platform proof.
