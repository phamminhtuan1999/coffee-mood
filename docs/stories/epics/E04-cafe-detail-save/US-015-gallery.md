# US-015 Photo and video gallery

## Status

implemented

## Lane

normal

## Product Contract

Pinterest-feel masonry gallery with vibe-tab filters and tap-to-detail, per cafe-detail.md.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- Tabs: Interior, Drinks, Seating, Outdoor, Work Setup, Date Vibe.
- Masonry grid, warm overlays, soft radius, photo vibe tags (Cozy, Bright, Crowded, Laptop-friendly, Aesthetic, Outdoor).
- Photo detail state on tap.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: C2 - Photo Gallery
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- UI surfaces: Photo / Video Gallery Screen (`src/app/cafe/[id]/gallery.tsx`
  per frame C2) plus a tap-to-detail overlay (dimmed backdrop, enlarged
  photo, caption, vibe tag, close). The detail route moved to
  `src/app/cafe/[id]/index.tsx` so the gallery nests under `/cafe/[id]/gallery`.
- Header: back button, cafe name, "N photos · N clips" from the gallery
  fixture. Six pill tabs filter the grid (design's demo reshuffle replaced
  with real per-tab filtering).
- Masonry: `splitMasonryColumns` appends each photo to the shorter column;
  photos are tone blocks with cream tag pills (bottom-left), soft radius.
- Fixtures in `src/data/gallery-fixtures.ts`: Mostra covers all six tabs
  (17 photos); Marigold/Terrace partial; Hearth empty (limited-data cafe),
  which exercises the empty state ("No photos in this vibe yet." - derived
  copy, no product-doc contract for gallery-empty).
- Entry: detail screen's View Photos text action is now live; `?tab=` and
  `?photo=` deep-link params open a specific tab or photo (also used for
  simulator QA).
- Known nit for human QA: a `?tab=` deep link to a late tab doesn't
  auto-scroll the tab row to show the selection.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-015 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Component/logic tests for this story's surfaces |
| Integration | Wired-flow test once navigation targets exist |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) |
| Release | Not yet defined |

## Harness Delta

- Verify command configured: `npm run lint && npx tsc --noEmit &&
  npx jest gallery cafe-detail`.

## Evidence

- `npm run lint` passed; raw `npx tsc --noEmit` passed.
- 16 new jest tests pass: fixture contract (valid tabs/tags, unique ids,
  Mostra covers all six tabs, Hearth empty), masonry column balancing,
  and screen behavior (header counts, six tabs with Interior default,
  tab filtering, tap-to-detail open/close, tab switch closes the overlay,
  `?tab=`/`?photo=` deep links, empty state, back navigation), plus the
  detail screen's View Photos -> `/cafe/mostra/gallery` wiring test.
  Full suite: 135 tests.
- `scripts/bin/harness-cli story verify US-015` passed.
- iPhone 15 Pro simulator smoke via Expo Go on iOS 17.2 (decision 0012):
  masonry grid with tag pills (Interior tab), photo-detail overlay via
  `?tab=Date%20Vibe&photo=mostra-date-1`, and the Hearth empty state all
  rendered within safe areas. Screenshots:
  `/tmp/cafemood-ios-simulator-us015-gallery.png`,
  `/tmp/cafemood-ios-simulator-us015-photo-detail.png`,
  `/tmp/cafemood-ios-simulator-us015-empty.png`.
- Interactive tap-through (tab taps, photo open/close, back) is covered by
  jest; the human manual pass per decision 0012 remains the outstanding
  interaction proof (backlog #2).
