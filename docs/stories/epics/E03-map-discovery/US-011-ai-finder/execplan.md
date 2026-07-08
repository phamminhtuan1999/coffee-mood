# Exec Plan

## Goal

Ship the complete finder-to-result AI experience as a provider-ready surface
while keeping external AI work explicit and deferred (decision 0013).

## Scope

In scope:

- Controlled prompt input with submit affordance per frame B3.
- Suggestion chips that fill the prompt and run the finder.
- Deterministic fixture-backed matcher (prompt tokens + taste profile boost).
- Thinking state, result card (best match, why-bullets, alternatives with
  better-for labels, actions, confidence line), Refine Search, and the
  AI-unavailable fallback with Browse Map CTA.
- Unit tests for matcher and screen states (decision 0011).
- Manual iPhone 15 simulator smoke with screenshot (decision 0012).

Out of scope:

- AI SDKs, provider calls, backend, or credentials.
- Persisted saved cafes and route planning.
- Search result changes (US-010) and remaining system states (US-013).

## Risk Classification

Risk flags:

- External systems: AI provider gate is touched but integration is
  intentionally deferred (decision 0013).
- Public contracts: the Ask AI surface changes from stub to full experience.
- Existing behavior: replaces the US-008 stub screen.

Hard gates:

- External provider behavior is avoided in this slice; see decision 0013.

## Work Phases

1. Discovery: product docs, US-011 packet, frame B3, decisions 0008/0010/0013,
   existing fixtures and kit components.
2. Design: record fixture matcher contract and B3 derivations in design.md.
3. Validation planning: jest cases, lint, tsc, story verify, simulator smoke.
4. Implementation: matcher module, theme token, screen rewrite, kit CTA hook.
5. Verification: run checks, manual simulator pass, record proof flags.
6. Harness update: packet evidence, durable row, decision row, trace.

## Stop Conditions

Pause for human confirmation if:

- Any AI SDK, credential, or backend becomes required.
- The result contract needs data the fixtures cannot express.
- Validation requirements need to be weakened beyond the known simulator
  interaction limitation (backlog #2).
