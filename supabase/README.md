# Supabase (US-029: live AI finder)

One stateless Edge Function, `ai-finder`, calls Groq (OpenAI-compatible chat
completions, JSON mode) to rank the curated cafe candidates (decisions
0008/0022). The Groq key never enters the app bundle or this repo.

## Where the keys go

| Value | Where | Why |
| --- | --- | --- |
| `GROQ_API_KEY` | Supabase function secrets (deployed) / `supabase/functions/.env` (local serve) | Server-side only per decision 0008 |
| `GROQ_MODEL` (optional) | Same as the key | Overrides the model; defaults to `llama-3.3-70b-versatile` |
| `EXPO_PUBLIC_SUPABASE_URL` | repo-root `.env` | Public project URL, safe in the bundle |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | repo-root `.env` | Public anon key, safe in the bundle |

Both `.env` files are gitignored; the committed `.env.example` twins show the
shape. With no `.env`, the app runs in demo mode (deterministic finder).

## Setup

1. Create a Supabase project (dashboard) and grab the URL + anon key from
   Project Settings → API into the repo-root `.env`.
2. Get a Groq API key (console.groq.com — free tier, no card).
3. Deploy + set the secret (needs the Supabase CLI, `brew install supabase/tap/supabase`):

   ```sh
   supabase link --project-ref <your-project-ref>
   supabase secrets set GROQ_API_KEY=<your-key>
   supabase functions deploy ai-finder --no-verify-jwt
   ```

   (`--no-verify-jwt` because the app calls with the anon key and the
   function holds no user data; tighten later when real auth lands.)

   Or deploy via the dashboard: Edge Functions → create `ai-finder` → paste
   `supabase/functions/ai-finder/index.ts` → set Verify JWT off → set the
   `GROQ_API_KEY` secret.

4. Or run locally instead: copy `supabase/functions/.env.example` to
   `supabase/functions/.env`, paste the key, then
   `supabase functions serve ai-finder --env-file supabase/functions/.env`
   and point `EXPO_PUBLIC_SUPABASE_URL` at `http://127.0.0.1:54321`.
5. Restart Metro (`npx expo start`) so the new env is picked up.

## Contract

`POST /functions/v1/ai-finder` with
`{ prompt, profile | null, candidates[] }` → `{ bestMatchId, why[3] }`.
Any provider failure returns non-200, which the app maps to the designed
"CafeMood AI is taking a coffee break." state.
