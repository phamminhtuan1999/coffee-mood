# US-018 Share cafe card

## Status

implemented

## Lane

normal

## Product Contract

One tap generates a premium, story-shareable cafe card (photo, name, vibe tag, aesthetic score, AI summary, branding) with copy/share/send actions.

## Relevant Product Docs

- `docs/product/cafe-detail.md`

## Acceptance Criteria

- Card matches design; renders as an image for the share sheet.
- Actions: copy link, share image, send to friend.

## Design Reference

- Handoff source (extracted from `CoffeeMood-handoff.zip`):
  - `docs/design/project/CafeMood Missing Screens.dc.html`
    - Frames: D6 - Share Cafe Card (story-format card: photo, serif name, vibe tag, aesthetic score badge, AI one-liner, CafeMood branding; Copy Link / Share Image / Send to Friend)
- Cloud original: https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html
- Note: Gap resolved 2026-07-06.
- The `.dc.html` prototypes are the visual contract: read the HTML/CSS
  source directly (per `docs/design/README.md`), match output
  pixel-perfectly, do not copy prototype internals.

## Design Notes

- Durable decision `docs/decisions/0015-defer-share-provider-for-us-018.md`:
  the Share Cafe Card surface ships in full, but Copy Link / Share Image /
  Send to Friend stay inert until a clipboard / view-shot / share provider
  lands (no such capability is installed or registered - a clean skip per
  AGENTS.md; mirrors the US-011 / US-017 deferrals and extends decision 0008).
- `ShareCafeCard` (frame D6) is a standalone story-format card: tone-gradient
  hero with the vibe tag pill and score badge, serif name, location, AI
  one-liner row (latte ✦ + tagline), and the CafeMood Map branding row. Built
  as its own view so a future view-shot capture can rasterize it without the
  sheet chrome.
- `ShareCafeSheet` (frame D6) is the full-screen overlay: dimmed backdrop,
  "Share this cafe" heading, the centered card, and a bottom actions sheet with
  the three share actions (icon + label).
- Card content lives in `src/data/share-card.ts`, derived from the pin fixtures
  (name, neighborhood → "… · San Diego", first vibe tag, score, tone) plus a
  share-specific tagline (Mostra mirrors the D6 reference; cafes without a
  dedicated line fall back to their pin vibe, so any cafe stays shareable).
- The cafe detail Share action (the text action row and the hero glass button)
  opens the overlay; the three actions call an inert handler (no state change),
  consistent with Directions / Add to Route / Open in Google Maps.
- Copy uses the app-wide unaccented "cafe" ("Share this cafe"), consistent with
  the US-011 precedent.
- QA deep-link override `?sheet=share` opens the overlay on load for
  deterministic simulator smoke (extends the existing `?sheet=save|create`).

## Harness Delta

- Durable decision 0015 recorded. No test-harness changes needed (the share
  surface has no persistence).

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-018 --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | `src/data/__tests__/share-card.test.ts`, `src/components/ui/__tests__/share-cafe-sheet.test.tsx` |
| Integration | Detail Share action → overlay open/close in `src/app/__tests__/cafe-detail.test.tsx` |
| E2E | Covered by US-028 full-flow QA walkthroughs |
| Platform | iOS simulator smoke (390x844, safe areas) via deep link below |
| Release | Not yet defined |

## Evidence

- Unit/lint/type gate: `rtk proxy npx tsc --noEmit`, `rtk proxy npm run lint`,
  `rtk proxy npx jest` - 24 suites, 191 tests passing (10 new).
- Simulator smoke (iPhone 15 Pro, iOS 18.x, Expo Go via Metro
  `exp://127.0.0.1:8081`):
  - `--/cafe/mostra?sheet=share` →
    `/tmp/cafemood-ios-simulator-us018-share.png` ("Share this cafe" heading,
    story card with Aesthetic tag + 9.1 score + name + "North Park · San
    Diego" + tagline + CafeMood Map branding, and the Copy Link / Share Image
    / Send to Friend actions row).
- "Renders as an image for the share sheet" and the three actions' real
  behavior are the deferred provider layer (decision 0015); the card is built
  capture-ready. Interactive tap-through remains part of the human manual pass
  per decision 0012 / backlog #2.
