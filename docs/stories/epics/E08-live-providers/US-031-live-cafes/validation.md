# Validation

## Proof Strategy

Dual proof per decision 0012:

1. Credential-free gate: unit tests for the Overpass response mapping
   (naming, coordinates, tag→need mapping, deterministic scores, drop
   unnamed, cap, failure→null) with mocked fetch; map-home integration test
   with the live-cafes module mocked both ways (live pins render + fixture
   fallback); full existing suite stays green (fixture mode).
2. Live proof: iPhone 15 Pro simulator with a simulated location
   (`xcrun simctl location set`) showing real OSM cafes as pins on the live
   map, plus a live cafe's limited-data detail screen. Recorded here before
   `implemented`.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Overpass mapping: named-only, node/way coords, Wi-Fi/Outdoor/Specialty tags, meta distance ordering + cap 20, stable hash scores, malformed JSON / non-200 / abort → null |
| Integration | Map home: live pins replace fixtures + no cluster pin; fetch failure → fixtures + cluster; chips/filters operate on live pins; detail renders limited mode for osm- ids and error for unknown ids |
| E2E | Human tap-through (backlog #2) |
| Platform | Simulator smoke with simulated location: real cafes on map, live limited detail |
| Performance | 12 s fetch abort; 3 s location race; ≤20 markers |
| Logs/Audit | Nothing logged; no location or place data persisted |

## Fixtures

- Canned Overpass JSON (node + way, with/without name/wifi/outdoor) in the
  unit test.
- Simulated location for the smoke: San Diego North Park 32.7466,-117.1297.

## Commands

```text
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"
node_modules/.bin/tsc --noEmit && node_modules/.bin/eslint .
node_modules/.bin/jest src/utils/__tests__/live-cafes.test.ts src/app/__tests__/map-live-cafes.test.tsx
xcrun simctl location <UDID> set 32.7466,-117.1297   # then deep-link smoke
```

## Acceptance Evidence

- Credential-free gate (2026-07-10): tsc clean; eslint 0 errors; 51 suites /
  341 jest tests green (Node 24) — 6 new live-cafes unit tests (mapping,
  determinism, cap, failure→null, cached lookups, limited detail), 4 new
  map-home integration tests (live pins replace fixtures + no cluster,
  fixture fallback, permission-denied center fallback, QA-override skip),
  and the fixture Index suite unchanged under a null-returning mock.
- Live pass (2026-07-10, iPhone 15 Pro, simulated location 32.7466,-117.1297
  via `xcrun simctl location`, location permission granted to Expo Go):
  - `/tmp/cafemood-ios-simulator-us031-live-cafes.png` — map home with real
    OSM cafes: **Subterranean Coffee Boutique** ("30th Street · 0.1 mi")
    selected with Specialty Coffee/Outdoor/Aesthetic tags from real OSM data
    and the honest live summary; additional live pins (8.2, 8.4) on the real
    map.
  - `/tmp/cafemood-ios-simulator-us031-live-detail.png` — live cafe detail
    in the designed limited mode: "Community data" meta, limited notice,
    estimate scores, real facts, 1/1 hero pager.
  - Direct deep link to a live detail with a cold cache renders the designed
    error state with Try Again (graceful; verified incidentally after a hot
    reload wiped the in-memory cache).
- Live Overpass probe recorded in execplan (16 named cafes, tag coverage).
