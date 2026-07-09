# US-022 Check-in vibe report and vibe clip

## Status

implemented

## Lane

normal

## Product Contract

Post-visit users file a sub-20-second tactile vibe report and can optionally attach a photo/video vibe clip with tags.

## Relevant Product Docs

- `docs/product/planning.md`

## Acceptance Criteria

- Five quick questions with option chips per planning.md; Submit Vibe Report CTA.
- Vibe clip: upload photo/short video, vibe tags, optional note, Post Vibe Clip; photo-first, minimal friction.
- Reports feed vibe scores and confidence (documented when schema lands; user media implies storage + moderation flags).

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Complete App.dc.html`
    - Frames: F1 - Vibe Report; F2 - Add Vibe Clip
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Durable decision `docs/decisions/0018-defer-contribution-pipeline-for-us-022.md`:
  both surfaces ship fully interactive client-side, but media capture/upload/
  storage/moderation and the check-in submission pipeline that feeds vibe
  scores stay deferred (no picker installed, no schema invented ahead of the
  community backend). The upload target and Post Clip are inert; submitted
  reports are ephemeral client state.
- Check-in (`src/app/cafe/[id]/check-in.tsx`, frame F1): visited-cafe header
  (tone swatch + "You visited" + serif name, pin lookup with a graceful
  "This café" fallback), "How was the vibe?" + the design's "30 seconds"
  subtitle, and the five planning.md questions as chip rows - noise
  (Quiet/Medium/Loud), work-friendly (Bad/Okay/Great), Wi-Fi
  (Unknown/Good/Bad), photo vibe (Not really/Nice/Very aesthetic), crowd
  (Empty/Comfortable/Crowded). Submit Vibe Report enables only when all five
  are answered, then swaps in-place to a thanks card ("Vibe logged - thank
  you") with a Done action back.
- Vibe clip (`src/app/cafe/[id]/clip.tsx`, frame F2): back + "Add a vibe
  clip" header, the 300px dashed photo-first upload target (+ circle, "Upload
  photo or short video", "Up to 30 seconds · vertical works best"), the seven
  planning.md vibe tags as live multi-select chips, the optional note field
  (italic F2 placeholder), and Post Clip (design copy; planning.md calls it
  Post Vibe Clip). Upload target and Post Clip are the deferred layer.
- Question/tag/copy data lives in `src/data/contribute.ts` with
  `isReportComplete` gating the submit.
- QA deep links: `/cafe/mostra/check-in` (+ `?state=done` for the thanks
  state) and `/cafe/mostra/clip`. Entry is deep-link only until the
  profile/tab stories (US-026/027) add durable entries.

## Harness Delta

- Durable decision 0018 recorded. No test-harness changes (ephemeral state,
  no persistence).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-022 --unit 1 --integration 1 --e2e 0 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/contribute.test.ts` (question/tag contract, completion gate) |
| Integration | Answer → enable → submit → thanks and tag/note/back flows in `src/app/__tests__/contribute.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep links below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 34 suites, 251 tests passing (12 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/cafe/mostra/check-in` →
    `/tmp/cafemood-ios-simulator-us022-checkin.png` (F1: visited header, all
    five chip questions, disabled Submit Vibe Report).
  - `--/cafe/mostra/check-in?state=done` →
    `/tmp/cafemood-ios-simulator-us022-checkin-done.png` (thanks card with
    Done action).
  - `--/cafe/mostra/clip` → `/tmp/cafemood-ios-simulator-us022-clip.png`
    (F2: dashed upload target, seven vibe tags, note field, Post Clip).
- Media capture/upload and the score-feeding pipeline are the deferred
  provider layer (decision 0018). Interactive tap-through remains part of the
  human manual pass per decision 0012 / backlog #2.
