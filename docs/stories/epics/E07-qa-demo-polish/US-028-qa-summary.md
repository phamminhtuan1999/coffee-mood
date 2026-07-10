# US-028 QA Summary (2026-07-10)

Full-app walkthrough on iPhone 15 Pro (Expo Go, Metro Node 24), every screen
reached by deep link and screenshotted (`/tmp/qa28-*.png`), plus the full
credential-free gate (tsc, eslint, 49 suites / 332 jest tests).

## Counts

- **Screens**: 23 route files (22 screens + root layout) across map home,
  search, AI finder, filters, cafe detail/gallery/insights/check-in/clip,
  route planner/detail/replace, work, date, saved, collection detail/edit,
  taste, profile, settings, notifications, system-states.
- **Components**: 23 shared UI components in `src/components/ui` (+ search
  content module), all theme-token styled.
- **Live providers**: 2 — Groq AI finder (US-029, re-verified live in this
  walkthrough with real why-bullets) and Apple Maps map home (US-030).

## Flow walkthroughs

| Flow | Result |
| --- | --- |
| First-time (splash → welcome → intro → auth → location → taste) | Not re-walked: the session-first gate skips onboarding for the active guest session, and clearing it needs an interactive sign-out tap (backlog #2). Covered by US-004..007 evidence + jest. |
| Core discovery (map → pin → sheet → detail → gallery → insights) | Pass — live Apple Maps, markers, sheet, detail 1/8 hero, masonry gallery, review insights. |
| AI recommendation (Ask AI → prompt → live result) | Pass — live Groq result (Marigold & Oak; "Quiet atmosphere / Has Wi-Fi / Good for work"). |
| Search (suggested + recents + mini-map + results) | Pass. |
| Route (planner → detail → replace stop) + work + date planners | Pass — generated route, insight, stops, alternatives with disabled-until-selected Replace. |
| Profile (saved → collections → edit → taste → profile → settings → notifications) + check-in/clip + system states | Pass — empty saved/collection states this session (populated states covered by US-023/024 evidence). |
| App-wide states (`?discovery=` offline/denied/empty, Section H gallery) | Pass (re-verified in US-030 over the live map). |

## Defects found and fixed

1. **Collection edit privacy switch visually inverted**
   (`src/app/collection/[id]/edit.tsx`): rendered knob-left + gray when the
   collection was private — reads as OFF while the a11y state said checked,
   and contradicted the notifications screen's switch idiom (on = right +
   espresso). Fixed to knob-right + `text.espresso900` when private,
   matching notifications.
2. **Profile settings icon rendered as colored emoji**
   (`src/data/profile.ts`): bare `⚙` gets iOS emoji presentation, breaking
   the monochrome glyph row style (✦ ♥ ➝). Fixed with the U+FE0E text
   presentation selector.

## Known gaps / risks (accepted, tracked)

- **Dev-only**: rapid sequential `exp://` deep links can crash Expo Go with
  "Tried to register two views with the same name AIRMap"
  (react-native-maps re-registration during bundle re-evaluation). Cold
  start + paced links avoid it; production bundles unaffected.
- `?discovery=denied` / `empty` seed initial state and need an Index remount
  (deep-link to another tab first) — recorded in US-030 validation.
- Interactive tap-through passes (auth transitions, sheet drag, filter
  apply-by-touch) remain pending human manual QA — backlog #2 / decision
  0012's simulator tap gap.
- Onboarding re-walk needs a signed-out session (interactive) — same item.
- Clip "Post Clip" accepts submission without media by design: the media
  pipeline is deferred (decision 0018) and the upload target is
  presentational.

## Engineering notes

- No off-token colors or one-off styles observed anywhere in the walkthrough;
  switches now share one idiom; row icon glyphs are uniform.
- The Expo Go dev-tools bubble (blue gear, top-right of every screenshot) is
  a dev overlay, not app UI.
- All demo flows work fully offline-deterministic except the live AI finder
  and Apple Maps tiles (both degrade gracefully: coffee-break state / cached
  tiles).
