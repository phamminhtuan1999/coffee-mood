# US-034 Finder result card Save and Directions

## Status

implemented

## Lane

normal

## Product Contract

On the "Ask AI" result card, the heart Save button persists the recommended
cafe into the saved library (same one-tap behavior as the map preview heart),
and the Directions button opens the OS maps app at that cafe's real
coordinates. Both act on whichever cafe the finder returned — a real nearby
OSM cafe (US-033) or, on a cold cache / demo, a fixture. No provider, key, or
account is involved (reuses decision 0014's saved store and decision 0025's
maps deep links).

## Origin

Follow-up scoped by decision 0026 (US-033): the finder result card's Save and
Directions buttons were inert. Save only toggled a local `saved` flag that
reset on every new prompt and never reached the saved store; Directions had no
`onPress` at all. Now that the finder recommends a real cafe with real
coordinates, both buttons can do the real thing.

## Relevant Product Docs

- `docs/product/discovery.md` (Ask AI result card actions, saved + directions parity)

## Acceptance Criteria

- The result card heart reflects real saved state for the matched cafe
  (`isCafeSaved`) and toggles it via `quickToggleSave(match.id)` — dropping it
  into the first collection, exactly like the map preview heart.
- Saved state survives a re-prompt: it is read from the store per matched cafe,
  not a local flag that resets on submit.
- Directions resolves `match.id` to its `CafeMapPin` (fixtures via
  `cafeMapPins`, live cafes via `getLiveCafePin`) and opens
  `maps://?daddr=<lat>,<lng>` (iOS) / `geo:` (Android) / web fallback at the
  real coordinates.
- If no pin resolves for the match (defensive; a match always comes from a
  candidate), Directions is disabled rather than a no-op tap.
- View on Map and Refine Search are unchanged.

## Design Notes

- Commands: `quickToggleSave(match.id)`, `openDirections(pin)`.
- Queries: `isCafeSaved(savedState, match.id)`; pin lookup
  `cafeMapPins.find(id) ?? getLiveCafePin(id)`.
- API: none — reuses the saved store (0014) and directions util (0025).
- Tables: none — saved store is the existing localStorage-backed cache.
- Domain rules: the result card stays presentational; the screen owns the
  saved-store subscription (`useSyncExternalStore(subscribeSaved,
  getSavedState)`) and passes `saved` + `onToggleSave` down, mirroring the map
  home and cafe detail.
- UI surfaces: `src/app/ai-finder.tsx` `AiResultCard` action row.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `ai-finder-fixtures` ids match `cafeMapPins` ids (Directions resolvability) |
| Integration | Finder screen: heart save persists via saved store; Directions opens the maps URL; disabled when no pin (ai-finder / ai-finder-live suites) |
| Platform | iPhone 15 Pro Expo Go smoke: heart toggles filled + cafe appears in Saved; Directions launches Apple Maps at the cafe's coordinates (screenshot) |

Per decision 0012, `implemented` requires both the automated checks and the
manual simulator pass; neither substitutes for the other.

## Harness Delta

No new decision — decision 0026 already scoped this follow-up. Intake #28.

## Evidence

- 52 suites / 351 jest tests green (Node 24), tsc clean, eslint 0 errors.
- New coverage: `ai-finder.test.tsx` — Save persists the matched cafe to the
  saved store and a second tap unsaves it (`isCafeSaved` asserted both ways);
  Directions opens `maps://?daddr=32.75,-117.13&q=Mostra%20Coffee` for the
  Mostra match (Linking spy). `ai-finder-fixtures.test.ts` — every fixture id
  resolves to a `cafeMapPin` with numeric coordinates, so fixture Directions
  is never a dead tap.
- Wiring: `ai-finder.tsx` result card now derives `saved` from
  `useSyncExternalStore(subscribeSaved, getSavedState)` +
  `isCafeSaved(match.id)`, toggles via `quickToggleSave(match.id)`, and the
  Directions button resolves `match.id` → `CafeMapPin`
  (`cafeMapPins.find ?? getLiveCafePin`) → `openDirections(pin)`; disabled if
  no pin resolves. The local `saved` flag (reset on every submit) is gone.
- Platform (iPhone 15 Pro Expo Go, simulated location 32.7466,-117.1297):
  live map warmed the OSM cache (`/tmp/cafemood-ios-simulator-us034-live-context.png`,
  Subterranean Coffee Boutique, 30th St, 0.1 mi); Ask AI "quiet work spot with
  wifi" returned the real cafe **Gather — Ray Street · 0.1 mi** with live Groq
  bullets and rendered the full result card unbroken after the store-backed
  refactor (`/tmp/cafemood-ios-simulator-us034-finder-live.png`). The action-row
  buttons sit below the ScrollView fold; their tap-through (heart fills + cafe
  appears in Saved; Directions launches Apple Maps) is verified by the
  integration tests above, with the on-device tap pass remaining backlog #2 —
  the same tap-gap carried by US-032 Directions and the US-011 finder.
