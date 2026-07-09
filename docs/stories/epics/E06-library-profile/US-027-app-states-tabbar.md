# US-027 App-wide states and bottom tab bar

## Status

implemented

## Lane

normal

## Product Contract

Every surface has designed empty/loading/error states (per the library-profile.md catalog) and the 5-tab bottom bar ties the app together.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Six empty states, five loading patterns, five error states with the exact copy.
- Bottom tab bar: Map, Search, Saved, Routes, Profile; clear selected states; safe-area correct.
- Offline state surfaces saved cafes.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: Section H - System States (6 empty-state cards, 4 loading skeletons, 4 error cards); tab bar in context on B1 / D2 / G2
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: B5 - tab bar in context
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - Section H is the app-wide state catalog. States are design cards, not full frames; compose per-surface at implementation time.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- State catalog in `src/data/system-states.ts`: the Section H designed copy
  verbatim for the 6 empty + 4 loading + 4 error cards, extended to the
  product doc's five-pattern contracts with a saved-library loading skeleton
  and a save-failed error card (crafted in the same idiom). Several surfaces
  already composed their states in earlier stories (US-011/013/014
  discovery/detail states; the D2 saved empty state keeps its product-doc
  copy per US-023) - the catalog is the app-wide contract those compositions
  answer to.
- Reusable cards: `EmptyStateCard` (existing) and the new `ErrorStateCard`
  (H error anatomy: soft ! badge, serif title, helpful copy, outline CTA).
  Loading uses the existing `LoadingSkeleton`.
- QA gallery at `/system-states` (deep-link only): renders the entire
  catalog for smokes and the US-028 walkthrough.
- Offline (AC 3): the map home's `?discovery=` QA override gained `offline` -
  the map keeps only saved-store pins ("saved cafés still work"), the sheet
  yields to the H offline card, and View saved hops to `/saved`. Real
  connectivity detection needs a network provider and stays future work; the
  state is fully composed and test-covered behind the override.
- Tab bar: shared `AppTabBar` (`src/components/ui/app-tab-bar.tsx`) with the
  five contract tabs (Map `/`, Search `/search`, Saved `/saved`, Routes
  `/route`, Profile `/profile`), SF-symbol icons, selected state (espresso
  ink + bold vs muted), safe-area padding, and push navigation. It replaces
  the provisional `MapTabBar` on the map home (the placeholder Taste tab
  becomes Profile per the contract; taste re-editing now lives behind
  Profile → Taste profile) and lands on all five tab-root screens. The route
  planner's Generate CTA bar now sits above the tab bar.

## Harness Delta

- None. No new stores or decisions (offline detection remains provider work
  noted in the catalog; screens keep their existing state compositions).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-027 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/system-states.test.ts` (6/5/5 counts, unique ids, exact designed copy); `src/components/ui/__tests__/app-tab-bar.test.tsx` (five tabs, selected state, route pushes, inert active tab) |
| Integration | `src/app/__tests__/system-states.test.tsx` (gallery renders whole catalog); offline override in `map-discovery-states.test.tsx` (saved pins only, offline card, View saved → /saved) |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 46 suites, 321 tests passing (9 new; route-planner
  and saved-library suites updated for the shared bar).
- Simulator smoke (iPhone 15 Pro, iOS 17.2, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/?discovery=offline` → `/tmp/cafemood-ios-simulator-us027-offline.png`
    (H offline card + View saved CTA over the map, tab bar with Map
    selected).
  - `--/system-states` → `/tmp/cafemood-ios-simulator-us027-states.png`
    (catalog gallery: 6 empty · 5 loading · 5 error).
  - `--/saved?state=demo` → `/tmp/cafemood-ios-simulator-us027-tabbar.png`
    (5-tab bar on the saved library, Saved selected in bold ink).
- Interactive tab tap-through remains part of the human manual pass per
  decision 0012 / backlog #2.
