# US-032 Wire Directions and View Photos

## Status

implemented

## Lane

normal

## Product Contract

The cafe preview sheet's View Photos opens the cafe's gallery (US-015
surface). Directions — on the sheet, the cafe detail sticky bar, and the
saved library quick actions — opens the OS maps app at the cafe's real
coordinates; the detail's "Open in Google Maps" opens the Google Maps web
search for those coordinates. No provider, key, or account involved
(decision 0025 supersedes decision 0010's directions deferral).

## Origin

User bug report after US-031: "the direction and view photo button dont
work". Triage: sheet View Photos was a US-028 QA wiring gap (button had no
onPress while the gallery existed and the detail screen's link worked);
Directions was the recorded 0010 deferral whose rationale expired when
US-031 gave pins real geography.

## Relevant Product Docs

- `docs/product/discovery.md` (sheet actions)
- `docs/product/cafe-detail.md` (detail actions)

## Acceptance Criteria

- Sheet View Photos routes to `/cafe/<id>/gallery` for the selected cafe
  (fixture or live; live cafes land on the gallery's empty state until a
  photo source exists per decision 0024).
- Sheet + detail + saved-library Directions open `maps://?daddr=<lat>,<lng>`
  (Apple Maps) on iOS, `geo:` on Android, web fallback elsewhere.
- Detail "Open in Google Maps" opens the Google Maps web search URL.
- Failures (no URL handler) are swallowed; the screen never breaks.
- Add to Route, Share providers, and route-level Start Navigation stay as
  recorded (decisions 0015/0016).

## Validation

| Layer | Proof |
| --- | --- |
| Unit | `directions.test.ts`: platform URL builders + Linking failure swallow |
| Integration | Sheet: View Photos → gallery push, Directions → maps URL (map-discovery-states suite); Detail: Directions + Open in Google Maps → Linking (cafe-detail suite) |
| Platform | `maps://?daddr=...` launched Apple Maps from Expo Go on the iPhone 15 Pro (`/tmp/cafemood-ios-simulator-us032-directions.png`, "◀ Expo Go" breadcrumb); Maps' own first-run location dialog needs one human tap — tap-through remains backlog #2 |

## Evidence

- 52 suites / 347 jest tests green (Node 24), tsc clean, eslint 0 errors.
- Wiring: `cafe-bottom-sheet-shell.tsx` gained `onDirections`/`onViewPhotos`
  props (half row + expanded row); map home passes gallery route + real
  coordinates; cafe detail sticky Directions + Open in Google Maps wired;
  saved library quick action wired via pin lookup.
- `src/utils/directions.ts`: platform-aware URL builders + safe openers.
