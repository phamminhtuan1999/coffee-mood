# Story Backlog

Populated from the CafeMood Map spec (intake #1, 2026-07-06). US-001 through
US-030 are `implemented` — every planned story has shipped (E07 QA complete;
E08 live AI + map complete). Design
source: extracted handoff under `docs/design/project/` (see
`docs/product/overview.md`); cloud original on
[claude.ai/design](https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html).

Design gaps: none as of 2026-07-06. A closer audit showed several "gaps" were
false (B3 includes the AI Result, E3/E4 include their results, Section H is the
system-state catalog); the seven genuinely missing screens were generated into
`docs/design/project/CafeMood Missing Screens.dc.html` (B5, B6, D4, D5, D6,
E5, G4) using the same tokens and idioms. All design files are synced to the
claude.ai "CafeMood Map" project (see `docs/product/overview.md`); re-sync via
DesignSync after any design change in the repo.

Story packets were created up front at the user's request so every screen
cluster carries its design link; treat `planned` packets as candidates, not
commitments.

## Epics

| Epic | Description | Spec source | Stories | Status |
| --- | --- | --- | --- | --- |
| E01-design-system | Tokens, component kit, map pin + sheet shells | Batch 0 | US-001..003 | implemented |
| E02-onboarding-auth | Splash, welcome, intro, auth, location, taste | Batch 1 | US-004..007 | implemented |
| E03-map-discovery | Map home, sheet, search, AI finder, filters, states | Batch 2 | US-008..013 | implemented |
| E04-cafe-detail-save | Detail, gallery, insight, save, share | Batch 3 | US-014..018 | implemented |
| E05-planning-contribution | Routes, work/date planners, check-in, clips | Batch 4 | US-019..022 | implemented |
| E06-library-profile | Saved, collections, taste, profile, states, tabs | Batch 5 | US-023..027 | implemented |
| E07-qa-demo-polish | Full QA, prototype wiring, demo polish | Batch 6 | US-028 | implemented |
| E08-live-providers | Real provider integrations (AI, map, cafes) | Deferral trail | US-029..031 | implemented |

Suggested implementation order: all epics are complete. E07 (US-028 full-app
QA) passed with two polish defects found and fixed (see
`epics/E07-qa-demo-polish/US-028-qa-summary.md`). In E08: US-029 (live AI
finder via a Supabase Edge Function calling Groq, decision 0022 superseding
the Gemini pick in 0021 after a billing-gated free-tier 429) is implemented
and live-verified; US-030 (live map home via react-native-maps / Apple Maps,
decision 0023 superseding 0010's Mapbox proposal — no accounts, Expo Go
preserved) is implemented and simulator-verified; US-031 (real cafes on the
map home from the keyless OpenStreetMap Overpass API around the device
location, decision 0024, fixtures as fallback) is implemented and
live-verified. Remaining deferred provider
work (directions/navigation per decision 0010, backend persistence of saves
per decision 0014, share provider per decision 0015, route nav/save/share per decision
0016, date plan providers per decision 0017, contribution media/pipeline per
decision 0018, collection editing extensions per decision 0019, local account
semantics and notification delivery per decision 0020) must expand to the
high-risk template and confirm or supersede decision 0008 before real
provider implementation.
