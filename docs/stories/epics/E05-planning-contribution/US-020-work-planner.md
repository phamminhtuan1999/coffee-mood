# US-020 Work session planner and results

## Status

implemented

## Lane

normal

## Product Contract

Remote workers enter a work window and constraints and get ranked work-spot cards with confidence indicators and arrival advice.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Inputs: start/end time, Wi-Fi, outlets, quiet level, parking; Find Work Spots CTA; not calendar-app styled.
- Result cards per planning.md: photo, name, work score, Wi-Fi/outlet confidence, noise, recommended arrival, parking note; best-overall reason line.
- Actions: View Detail, Save, Directions.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: E3 - Work Session Planner (includes results: 'Best for your session' cards with work score, Wi-Fi/outlet/noise stats, arrival tips)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Earlier gap note was wrong - E3 contains planner inputs AND results on one scrolling screen.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- One screen at `src/app/work.tsx` (route `/work`) matching E3: serif title,
  the session card (italic spoken sentence, Start/End time fields, need chips),
  the Find Work Spots CTA, and - after generating - the "Best for your session"
  results below on the same scroll. Not calendar-app styled: times are
  tap-to-cycle presets (8/9/10 AM starts, 12/1/3 PM ends), no pickers, and the
  italic sentence restates the window conversationally.
- Data lives in `src/data/work-planner.ts`: need options, time presets,
  `sessionSentence`, and `findWorkSpots` - a deterministic ranker over the pin
  fixtures plus work-specific confidence profiles (no AI/availability service,
  consistent with decision 0013). Met needs push a spot up and unmet needs push
  it down, so the ranking visibly answers the constraints: with the default
  needs (Wi-Fi/Outlets/Parking) Hearth wins on parking; dropping Parking
  promotes Marigold.
- Result cards mirror the E3 anatomy: tone photo swatch, name + meta, work
  score badge ("WORK" tile on `surface.matchScore`), three confidence stat
  tiles (Wi-Fi / Outlets / Noise, positive ink vs caution ink), and the
  arrival + parking tip line. A best-overall reason line (per planning.md's
  "Best overall: ..." example) renders in the ✦ summary-card idiom above the
  list.
- Actions per card: View Detail routes to `/cafe/[id]`; Save is live through
  the shared saved store (decision 0014, `quickToggleSave`, label flips to
  "Saved"); Directions stays inert until the map provider lands (decision
  0010) - no new deferral decision needed, both behaviors are already durable.
- Entry is deep-link only (`/work`, QA override `?state=results` renders the
  ranked results on load) until the US-027 Plan tab adds the durable entry -
  same provisional-entry situation as decision 0016 notes for routes.

## Harness Delta

- None. No new store, no new decisions (Directions inert per 0010, saves live
  per 0014, deterministic ranking per 0013's AI deferral).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-020 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/work-planner.test.ts` (options, sentence, ranking, stats) |
| Integration | Input → generate → re-rank → detail/save flows in `src/app/__tests__/work-planner.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 30 suites, 227 tests passing (13 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`; Metro had died since US-019 and was restarted):
  - `--/work` → `/tmp/cafemood-ios-simulator-us020-planner.png` (E3 inputs:
    session sentence, Start 9:00 AM / End 12:00 PM fields, Wi-Fi/Outlets/
    Parking selected + Very quiet unselected, Find Work Spots CTA).
  - `--/work?state=results` → `/tmp/cafemood-ios-simulator-us020-results.png`
    ("Best for your session", best-overall reason line for Hearth, ranked
    cards with 7.8/8.7 work badges, Good/Many/Calm confidence tiles, arrival
    tip, View Detail / Save / Directions row).
- Directions is the deferred provider layer (decision 0010). Interactive
  tap-through remains part of the human manual pass per decision 0012 /
  backlog #2.
