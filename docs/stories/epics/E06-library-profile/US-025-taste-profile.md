# US-025 Taste profile screen

## Status

implemented

## Lane

normal

## Product Contract

'Your cafe taste' visualizes taste stats and favorites with warm charts - personal, not dashboard-like - and links to recommendations.

## Relevant Product Docs

- `docs/product/library-profile.md`

## Acceptance Criteria

- Stats and sections per library-profile.md (42% Work-friendly example set).
- Pulls from onboarding answers and check-in history when available.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: G1 - Taste Profile
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- One screen at `src/app/taste.tsx` (route `/taste`) matching G1: back
  button, serif "Your café taste", subtitle, the stat card (segmented tone
  bar + 2-col legend), favorite vibes chips, favorite neighborhoods card,
  recently visited thumb rail, and the ✦ recommendation card.
- Data in `src/data/taste-profile-view.ts`, split by what can honestly be
  derived today (per library-profile.md, derived stats / visit history /
  recommendation persistence are future data-model work):
  - Stat bar: the product-doc example set (42/28/18/12) as fixture.
  - Subtitle: live save count ("Built from N saves and your taste answers";
    zero-save variant invites saving). The design's "14 visits" needs visit
    history that doesn't exist yet - fixture truth over design placeholder.
  - Favorite vibes: derived from the US-007 onboarding answers (cafe types +
    priorities mapped to vibe phrases, deduped, capped at 6); G1 defaults
    render when no answers exist or onboarding was skipped.
  - Favorite neighborhoods: derived live from the saved store (pin meta
    prefix, ranked, top 3); empty state invites saving.
  - Recently visited: G1 demo thumbs (tap-through to `/cafe/[id]`) until
    visit history lands (check-in submissions are deferred per 0018).
  - Recommendation: static Golden Hour Coffee line per decision 0013.
- QA override `?state=demo` derives the live sections from the demo library.
- Entry: deep link `/taste` until the US-026 profile row links it.

## Harness Delta

- None. No new store, no new decisions (AI-derived stats stay deferred per
  0013; visit history per 0018's contribution-pipeline deferral).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-025 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/taste-profile-view.test.ts` (stats contract, subtitle, vibe derivation, neighborhood ranking) |
| Integration | Live/demo/onboarding-driven rendering + navigation in `src/app/__tests__/taste-profile.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep link below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 40 suites, 298 tests passing (11 new).
- Simulator smoke (iPhone 15 Pro, iOS 17.2, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/taste?state=demo` → `/tmp/cafemood-ios-simulator-us025-taste.png`
    (stat bar + legend, vibes chips derived from the simulator's persisted
    US-007 onboarding answers, neighborhoods ranked from the demo library,
    recently visited rail). The onboarding-driven chips on device double as
    proof of the "pulls from onboarding answers" criterion.
- Interactive tap-through remains part of the human manual pass per decision
  0012 / backlog #2.
