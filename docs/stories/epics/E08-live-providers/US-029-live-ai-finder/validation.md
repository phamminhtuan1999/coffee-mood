# Validation

## Proof Strategy

Two layers, honestly separated:

1. Credential-free proof (runs in CI/jest today): the client's env gating,
   request shape, response mapping, and failure→unavailable behavior are
   unit/integration tested with a mocked `fetch`; the screen keeps its
   existing deterministic tests for the unconfigured mode.
2. Live proof (needs the human's Supabase project + Gemini key): curl the
   deployed/served function, then a simulator smoke of the finder returning
   a real Gemini result. The story does not reach `implemented` until this
   pass is recorded here.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Client returns null when env unset; builds correct URL/headers/body; maps bestMatchId→fixture cafe with generated bullets; unknown id / bad JSON / non-200 / timeout → unavailable |
| Integration | Finder screen: unconfigured → deterministic result (existing suite); configured mock → live bullets render; configured failure → coffee-break state |
| E2E | US-028 walkthrough once live |
| Platform | iPhone 15 Pro smoke with real env (`--/ai-finder?prompt=...`) after keys land |
| Performance | 8s client abort; function timeout surfaces as unavailable |
| Logs/Audit | Function logs provider failures; no user content persisted |

## Fixtures

- Candidate set: the four `aiCafes` fixtures (mostra, marigold, terrace,
  hearth) travel in the request, so live and demo modes rank the same world.
- Mocked Gemini success: `{ bestMatchId: "marigold", why: [3 bullets] }`.

## Commands

```text
rtk proxy npx jest src/utils/__tests__/ai-finder-client.test.ts src/app/__tests__/ai-finder-live.test.tsx
# live (after keys):
supabase functions serve ai-finder --env-file supabase/functions/.env
curl -s -X POST http://127.0.0.1:54321/functions/v1/ai-finder \
  -H "Authorization: Bearer $ANON" -H "Content-Type: application/json" \
  -d '{"prompt":"quiet work spot","profile":null,"candidates":[...]}'
```

## Acceptance Evidence

- Credential-free gate (2026-07-10): tsc clean, 48 suites / 328 jest tests
  green (Node 20), lint clean. Demo-mode simulator smoke unchanged
  (`/tmp/cafemood-ios-simulator-us029-demo-mode.png`).
- Provider: switched Gemini → Groq (decision 0022) after Gemini's free tier
  returned a billing-gated 429; contract and app code unchanged.
- Live pass (2026-07-10, Groq `llama-3.3-70b-versatile` via the deployed
  Supabase function):
  - `curl POST /functions/v1/ai-finder` → `HTTP 200`
    `{"bestMatchId":"marigold","why":["Known for quiet","Has wifi and
    outlets","Nearby at 0.5 mi"]}` (~1.0s).
  - Simulator smoke (iPhone 15 Pro, Expo Go, Metro with live `.env`):
    `--/ai-finder?prompt=quiet%20work%20spot%20with%20wifi%20and%20outlets`
    → `/tmp/cafemood-ios-simulator-us029-live.png` — Marigold & Oak best
    match with the live Groq bullets ("Quiet after 2pm", "Has outlets",
    "Has wifi"), distinct from the deterministic fixture bullets.
- Note: the live curl also validated the failure path earlier in the session
  (404 → deploy, retired model → 404, Gemini 429/503 → provider-error 502),
  each mapping to the app's AI-unavailable state as designed.
