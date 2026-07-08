# US-014 Cafe detail screen with scores and states

## Status

implemented

## Lane

normal

## Product Contract

Detail screen answers 'is this cafe right for my mood' with carousel, score cards, amenity details, AI summary, editorial sections, and action row - plus loading/error/limited-data states.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- All content blocks per cafe-detail.md in order; Mostra Coffee reference renders (scores 9.1/8.8/6.5/7.2).
- Actions: Save, Directions, Share, Add to Route, View Photos, Open in Google Maps.
- Skeleton loading, error-with-retry, and limited-data notice states included.
- Long cafe names and missing images handled.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: C1 - Cafe Detail; Section H - 'Cafe detail' loading skeleton card, error state cards
  - `docs/design/project/CafeMood App Screens.dc.html`
    - Frames: 03 - Cafe Detail (early MVP reference)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Detail states exist as Section H pattern cards; compose them onto the C1 layout at implementation time. 'Limited vibe data' copy lives in docs/product/cafe-detail.md.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Cafe Detail Screen (`src/app/cafe/[id].tsx`, dynamic route
  per frame C1); Detail Loading / Error / Limited Data States composed from
  the Section H pattern cards.
- Content blocks in order: hero carousel (paged tone slides, dots, "n / N"
  counter, glass back/share/save buttons), name + Open pill + meta, vibe
  tag chips, four score cards colored by `scoreTone` (>=8.5 great, >=7
  good, else crowded), AISummaryCard vibe summary, details facts card,
  why-it-matches bullets, People love / Watch out for chip columns,
  best-time bar chart (terracotta highlights, new `surface.roastedSoft`
  token for idle bars), similar-cafes rail (navigates to sibling details),
  Share / View Photos / Open in Google Maps text actions, sticky
  save/Directions/Add to Route bar.
- Detail fixtures in `src/data/cafe-details.ts` keyed by pin id; Hearth is
  the organic limited-data cafe (sparse facts, no editorial sections, no
  photos - exercises the notice and the missing-image placeholder).
- Long names wrap to two lines beside the status pill; missing images render
  a placeholder block with no carousel chrome.
- Provider-backed actions (Directions, Add to Route, Share, View Photos,
  Open in Google Maps) are presentational until their stories/providers
  land (US-015 gallery, US-018 share, US-019 routes; decisions 0008/0010).
- Entry points: map-home sheet name row (`onOpenDetail` on
  CafeBottomSheetShell) and similar-cafes rail; `?state=loading|error|limited`
  QA deep-link param for simulator smoke (same pattern as `?discovery=`).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-014 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Verify command configured: `npm run lint && npx tsc --noEmit &&
  npx jest cafe-detail cafe-details map-discovery-states`.

## Evidence

- `npm run lint` passed; raw `npx tsc --noEmit` passed.
- 18 new jest tests pass: fixture contract (Mostra 9.1/8.8/6.5/7.2, detail
  record per pin, resolvable similar links, limited fixture shape),
  scoreTone thresholds, and screen states (skeletons then content, QA
  loading hold, all blocks and six actions, save toggle, similar-cafe
  navigation, unknown-id error + retry loop, QA error, organic and QA
  limited notice with hidden editorial sections, missing-image
  placeholder), plus the sheet-name -> /cafe/mostra wiring test in the map
  states suite. Full suite: 119 tests.
- `scripts/bin/harness-cli story verify US-014` passed.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 (decision 0012)
  using the `?state=` QA param: full Mostra detail (hero, scores with tone
  colors, summary, facts, sticky action bar), loading skeletons, error with
  Try Again, and the Hearth limited-data notice with photo placeholder all
  rendered within safe areas. Screenshots:
  `/tmp/cafemood-ios-simulator-us014-detail.png`,
  `/tmp/cafemood-ios-simulator-us014-loading.png`,
  `/tmp/cafemood-ios-simulator-us014-error.png`,
  `/tmp/cafemood-ios-simulator-us014-limited.png`.
- Hero bottom scrim from the prototype was dropped after smoke review: a
  flat band reads worse than none without a gradient primitive.
- Interactive tap-through (carousel swipe, save toggle, retry, similar-cafe
  hop, sheet entry) is covered by jest; the human manual pass per decision
  0012 remains the outstanding interaction proof (backlog #2).
