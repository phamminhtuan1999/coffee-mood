# 0009 Testing Framework: jest-expo + React Native Testing Library

Date: 2026-07-07

## Status

Accepted

## Context

E01 stories (US-001..003) are implemented with lint, tsc, story verify, and
iOS simulator smoke evidence, but every story validation table expects unit
proof and the repo has no test runner. Decision 0008 covers the app stack but
is silent on testing. Closing the E01 weak-proof gap requires picking and
installing a test framework, which is a durable dependency choice.

## Decision

Use `jest-expo` (Expo's official Jest preset) with
`@testing-library/react-native` for unit and component tests. Test files live
next to nothing special: `src/**/__tests__/*.test.ts(x)`. The `test` npm
script runs `jest`.

## Alternatives Considered

1. Vitest — faster runner, but React Native/Expo support is second-class and
   needs custom transform configuration for native modules and Expo packages.
2. No framework (keep deferring) — leaves every implemented story at weak
   proof and pushes the gap into E03+ where logic complexity grows.

## Consequences

Positive:

- Unit proof becomes recordable for all implemented and future stories.
- jest-expo tracks Expo SDK versions, so upgrades stay aligned with the app.

Tradeoffs:

- Jest is slower than Vitest for pure-TS logic tests.
- Component tests render against mocked native modules, not real platform
  behavior; platform smoke remains a separate proof layer.

## Follow-Up

- Backfill unit proof for US-004..010 surfaces when those stories' proof gaps
  are scheduled.
- Wired-flow integration tests remain owned by the navigation/wiring stories,
  not E01.
