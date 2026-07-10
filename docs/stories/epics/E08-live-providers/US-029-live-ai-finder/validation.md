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

- Credential-free gate: pending this story's implementation run.
- Live pass: BLOCKED on human-provided `EXPO_PUBLIC_SUPABASE_URL`,
  `EXPO_PUBLIC_SUPABASE_ANON_KEY` (app `.env`) and `GEMINI_API_KEY`
  (Supabase secrets / `supabase/functions/.env`). Record curl output and
  simulator screenshot here when done.
