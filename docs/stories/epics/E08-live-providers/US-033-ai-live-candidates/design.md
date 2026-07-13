# Design

## Domain Model

- `getCachedLiveCafes(): CafeMapPin[]` (new, `live-cafes.ts`) exposes the
  module's `lastLivePins` — the map home's last successful Overpass fetch.
  Empty until the map loads real cafes.
- No new persisted state; the cache is the existing US-031 session cache.

## Application Flow

`runLiveAiFinder(prompt, profile)` in `ai-finder-client.ts`:

1. Return `null` if Supabase env is unset (caller keeps the deterministic
   demo matcher) — unchanged.
2. `const liveCafes = getCachedLiveCafes()`; `useLive = liveCafes.length > 0`.
3. Candidate set:
   - live: `liveCafes.slice(0, 12)` mapped to
     `{ id, name, meta, keywords: tags, baseScore: parseFloat(score) }`.
   - fixture fallback: `aiCafes` mapped as today.
4. POST to the unchanged Edge Function; on `bestMatchId`:
   - live: find the winning `CafeMapPin`, adapt to `AiCafe` — real name/meta,
     `tone` (the `CafeMapPinTone` union equals `AiTone`), `whyItMatches` =
     the model's `why`, `alternatives` = up to three other candidate pins
     with `betterFor` = their highest-scoring label.
   - fixture: `{ ...match, whyItMatches: why }` — unchanged.
5. Any failure / unknown id / empty why → `{ status: "unavailable" }`
   (0013), unchanged.

The finder screen and result card are untouched: they already render whatever
`AiCafe` the client returns.

## Interface Contract

- Edge Function request/response shape is unchanged; only the *contents* of
  `candidates` differ (real ids/names instead of fixture ids). The function
  validates `bestMatchId ∈ candidateIds` regardless of source.
- No new client env or secret.

## Data Model

None. In-memory reuse of the US-031 cache.

## UI / Platform Impact

- iOS Expo Go; live smoke uses a simulated location so the map warms the
  cache, then the finder names a real cafe.
- Jest: existing `ai-finder-client` tests never warm the cache, so they hit
  the fixture branch and stay green; a new test warms the cache via a mocked
  Overpass fetch (`fetchLiveCafes`) then asserts live candidates + mapping.

## Observability

- No new logging. Real cafe names travel to Groq inside the existing request;
  nothing is persisted or logged client-side.

## Alternatives Considered

1. Finder fetches its own live cafes (own location prompt): more robust on a
   cold cache but duplicates location logic and risks a second permission
   prompt; rejected for this slice (map cache is warm in the normal flow).
2. Send all ≤20 cached cafes: fine, but 12 nearest keeps the prompt tight
   and the model focused; chosen.
3. Replace fixtures entirely: would break the deterministic demo and its
   tests; rejected — fixtures stay as the cold-cache/demo fallback.
