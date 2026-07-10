# Design

## Domain Model

- Candidate: the curated `AiCafe` fixtures (id, name, meta, keywords,
  baseScore). The model ranks only these candidates — it cannot invent cafes,
  which keeps the result mappable onto the existing UI fixtures (tones,
  alternatives).
- Live result: `{ bestMatchId, why: string[] }` from Gemini. The client maps
  `bestMatchId` back onto the fixture cafe and overrides its `whyItMatches`
  with the generated bullets (capped at 3); alternatives/tones stay fixture.

## Application Flow

1. Finder screen submit → `runLiveAiFinder(prompt, profile)`.
2. Client returns `null` when `EXPO_PUBLIC_SUPABASE_URL` or
   `EXPO_PUBLIC_SUPABASE_ANON_KEY` is absent → caller uses the deterministic
   `runAiFinder` (unchanged demo mode, and what jest exercises).
3. Otherwise POST `${SUPABASE_URL}/functions/v1/ai-finder` with
   `{ prompt, profile, candidates }` (anon key as `Authorization: Bearer` +
   `apikey`), 8s abort timeout.
4. Edge Function calls Gemini `gemini-2.5-flash:generateContent` with
   `responseMimeType: application/json` + a response schema enforcing
   `{ bestMatchId, why[] }`; key from `Deno.env.get("GEMINI_API_KEY")`.
5. Any failure (network, non-200, unknown id, malformed JSON, timeout) →
   `{ status: "unavailable" }` → the designed fallback state per 0013.

## Interface Contract

Request DTO: `{ prompt: string, profile: { cafeTypes, priorities, distance,
price } | null, candidates: { id, name, meta, keywords, baseScore }[] }`.
Response DTO: `{ bestMatchId: string, why: string[] }`; errors are plain
`{ error: string }` with non-200 status. CORS headers included for web.

## Data Model

None. No tables, no persistence; the function is stateless and the candidate
data travels with each request.

## UI / Platform Impact

- No visual changes: the US-011 result surface renders live bullets in place
  of fixture bullets. Works in Expo Go (plain fetch, no native SDK).
- Secrets: `GEMINI_API_KEY` in Supabase function secrets (deployed) or
  `supabase/functions/.env` (local serve, gitignored). App `.env` carries
  only public values (`EXPO_PUBLIC_*`); `.env*` is gitignored with
  `.env.example` committed.

## Observability

Edge Function logs errors (status + provider error body) to the Supabase
function log stream; no user content is persisted.

## Alternatives Considered

1. Client-side Gemini SDK call — forbidden by decision 0008 (key would ship
   in the bundle).
2. Sending only the prompt and letting the model free-generate a cafe —
   rejected: unmappable to the designed result surface and invites
   hallucinated venues.
3. Deterministic fallback on live failure instead of the unavailable state —
   rejected: 0013 already contracts provider failure to the coffee-break
   state, and silently faking an AI answer would misrepresent the feature.
