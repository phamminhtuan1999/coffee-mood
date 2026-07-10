# Validation

## Proof Strategy

Dual proof per decision 0012:

1. Credential-free gate (jest under Node ≥20): coordinate/region fixture
   contract unit-tested; the Index screen suite re-run against the mocked
   map proves pins, states, and overlays survived the canvas swap.
2. Platform proof: iPhone 15 Pro Expo Go smoke showing real Apple Maps
   tiles under the existing pins/overlays, plus the `?discovery=` states
   still rendering. The story does not reach `implemented` until this pass
   is recorded here with screenshots.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Every `cafeMapPins` entry has finite lat/lng inside `MAP_HOME_REGION`; region center/deltas contain all pins with padding; legacy pixel-offset fields removed |
| Integration | Index renders MapView (mocked) with one marker per visible cafe + cluster; pin press still selects cafe/sheet; loading shows skeleton and hides markers; empty/denied/offline cards unchanged; filter badge unchanged |
| E2E | US-028 walkthrough once scheduled |
| Platform | iPhone 15 Pro Expo Go: real map tiles + pins, pan/zoom by hand, `?discovery=loading/empty/denied/offline` unchanged |
| Performance | Markers limited to 5 curated pins; no `tracksViewChanges` churn concerns at this scale |
| Logs/Audit | N/A — no provider calls or secrets |

## Fixtures

- Curated San Diego coordinates on the four cafes + cluster pin
  (North Park / South Park / University Heights, matching `meta` strings).
- `MAP_HOME_REGION` exported constant used by screen and tests.
- Jest mock for `react-native-maps` in `jest-setup.ts` (View-based stubs).

## Commands

```text
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"
node_modules/.bin/tsc --noEmit
node_modules/.bin/eslint .
node_modules/.bin/jest src/data/__tests__/map-pins.test.ts src/app/__tests__/map-discovery-states.test.tsx
npx expo start --ios   # then deep-link QA params + xcrun simctl screenshots
```

## Acceptance Evidence

- Credential-free gate (2026-07-10): tsc clean; eslint 0 errors (2
  pre-existing warnings: generated `.expo` types + the established
  `require()` in jest-setup); 49 suites / 332 jest tests green (Node 24),
  including the unchanged `map-discovery-states` Index suite against the
  mocked map and 4 new `map-pins` fixture-contract tests.
- Platform pass (2026-07-10, iPhone 15 Pro, Expo Go, Metro Node 24 —
  real Apple Maps tiles with San Diego North Park streets/I-805 in every
  shot):
  - `/tmp/cafemood-ios-simulator-us030-live-map.png` — live map home:
    selected Mostra pin with 9.1 score badge + "+3" cluster pin as
    geographic markers, search bar, vibe chips, Ask AI + location FABs,
    preview sheet, tab bar all intact.
  - `/tmp/cafemood-ios-simulator-us030-offline.png` — `?discovery=offline`:
    "You're offline" card over the live map, discovery pins paused.
  - `/tmp/cafemood-ios-simulator-us030-denied.png` — `?discovery=denied`:
    "Location is off." card with Choose/Enable Location CTAs over the live
    map, pins visible above.
  - `/tmp/cafemood-ios-simulator-us030-empty.png` — `?discovery=empty`:
    "No cafe vibes found nearby." + Expand Search over the live map with
    zero markers.
  - Loading skeleton covered by jest (screen-space overlay unchanged);
    cold-start timing makes a loading screenshot flaky, consistent with
    prior stories.
- QA note: `?discovery=denied`/`empty` seed initial state, so they need an
  Index remount — deep-link to another tab first, then to
  `--/?discovery=<state>` (offline applies on any render).
