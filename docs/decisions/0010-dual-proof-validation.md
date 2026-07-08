# 0010 Dual Proof: Automated Tests Plus Manual Simulator Smoke

Date: 2026-07-07

## Status

Accepted

## Context

Before decision 0009 the only per-story completion proof was a manual smoke
pass on the iPhone 15 simulator. With jest-expo in place there is a risk that
automated tests quietly become the whole proof and the manual device pass
stops happening. The user directed (intervention #3) that automation is
additive: manual testing on the simulator stays the proof that an implemented
feature is complete.

## Decision

A story may be marked `implemented` only when both hold:

1. Automated checks pass: lint, typecheck, and the story's jest tests
   (the story `verify_command` should run all three).
2. A manual smoke pass on the iPhone 15 simulator (390x844, safe areas) was
   performed for the story's surfaces and recorded in the story Evidence
   section, normally with a screenshot path.

Neither proof substitutes for the other. Automated tests run against mocked
native modules and cannot see real rendering; the manual pass cannot protect
against regressions the way tests do. The `--platform` proof flag records the
manual simulator pass; the `--unit`/`--integration` flags record automated
proof. A visually neutral change (pure refactor, docs) does not require a
fresh simulator pass, but any change that can affect rendering or interaction
does.

## Alternatives Considered

1. Automated tests replace manual smoke once coverage is strong - rejected by
   the user; mocked rendering misses real device behavior.
2. Automate the simulator pass (Maestro/Detox) - possible later; blocked today
   by the simulator tap-gesture gap (backlog #2) and out of scope for this
   rule.

## Consequences

Positive:

- Every implemented story keeps a real-rendering proof and a regression net.
- Evidence sections stay comparable across stories (screenshot + test run).

Tradeoffs:

- Implementation passes cost a simulator session even for small stories.

## Follow-Up

- Revisit automating the platform layer if the simulator interaction gap
  (backlog #2) is resolved.
