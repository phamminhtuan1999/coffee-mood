# CafeMood Map

A map-first, visual-first mobile app for discovering coffee shops by **vibe,
not just rating** — for work, dates, photos, quiet time, or café-hopping
routes.

> **Status: documentation & design phase.** The product spec is decomposed,
> all screens are designed, and 28 stories are queued. Implementation has not
> started — the app currently renders a placeholder screen.

## Where Things Stand

| Area | State |
| --- | --- |
| Product contracts | 7 docs in `docs/product/` (overview, design system, 5 domains) |
| Design | 100% screen coverage in `docs/design/project/` (4 `.dc.html` files); mirrored to the claude.ai "CafeMood Map" design project |
| Stories | 28 planned across epics E01–E07 (`docs/stories/epics/`) |
| Tech stack | Proposed, not accepted — `docs/decisions/0008-cafemood-tech-stack.md` |
| Implementation | Not started; E01 (design tokens + component kit) is the first slice |

## Design Source

The visual contract lives in `docs/design/project/`:

- **CafeMood Complete App.dc.html** — 27 labeled frames (onboarding → map
  discovery → café detail → collections → planning → profile) plus a
  system-states catalog (Section H).
- **CafeMood Missing Screens.dc.html** — gap-fill frames (sheet states,
  create/edit collection, share card, replace stop, notification prefs).
- **CafeMood Design System.dc.html** — "Ambient Editorial Map" tokens and
  components (see `docs/product/design-system.md` for the written contract).

These are HTML/CSS prototypes: read the source, match the output — don't copy
their internals. The repo copy is authoritative; the claude.ai project is a
synced mirror.

## Working in This Repo

This project uses **Harness**: every change enters through feature intake and
leaves a durable trace. Agents (and humans) should read `AGENTS.md` first,
then:

```bash
scripts/bin/harness-cli init               # first time: create harness.db
scripts/bin/harness-cli import brownfield  # seed from committed markdown
scripts/bin/harness-cli query matrix       # behavior-to-proof control panel
```

The CLI binary is not committed. Fresh clones restore it with the harness
installer (see `scripts/README.md`), which also verifies checksums.

Key reading order: `AGENTS.md` → `docs/HARNESS.md` → `docs/FEATURE_INTAKE.md`
→ `docs/product/overview.md` → the story you're picking up.

## App Development

Expo SDK 57 / React Native 0.86 / TypeScript / expo-router, with routes in
`src/app` per the [src directory convention](https://docs.expo.dev/router/reference/src-directory/).

```bash
npm install
npx expo start        # i = iOS simulator, a = Android, w = web
```

The suggested production stack (NativeWind or Tamagui, Mapbox, Supabase,
server-side AI via Edge Functions) is **proposed only** — see decision 0008.
Do not install stack dependencies until the story that needs them is selected.

## Repository Map

```text
src/               app code (routes in src/app, ui kit in src/components/ui)
docs/product/      product contracts (the living spec)
docs/design/       design handoff — .dc.html prototypes + support files
docs/stories/      epics E01–E07, 28 story packets with design references
docs/decisions/    durable decision records
docs/templates/    story / decision / validation templates
scripts/           harness CLI (schema in scripts/schema/)
```

## License

See [LICENSE](LICENSE).
