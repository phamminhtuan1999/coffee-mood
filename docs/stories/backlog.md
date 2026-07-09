# Story Backlog

Populated from the CafeMood Map spec (intake #1, 2026-07-06). US-001 through
US-021 are `implemented` (E04 complete; E05 in progress with only US-022
left); US-022 through US-028 remain `planned`. Design
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
| E05-planning-contribution | Routes, work/date planners, check-in, clips | Batch 4 | US-019..022 | in progress (US-019..021 done) |
| E06-library-profile | Saved, collections, taste, profile, states, tabs | Batch 5 | US-023..027 | planned |
| E07-qa-demo-polish | Full QA, prototype wiring, demo polish | Batch 6 | US-028 | planned |

Suggested implementation order: E03 and E04 are complete and E05 is underway
(US-019 through US-021 done); continue with US-022, then E06 and E07.
Deferred provider work (map provider per decision 0010, AI provider per
decision 0013, client-side saves per decision 0014, share provider per decision
0015, route nav/save/share per decision 0016) must expand to the high-risk
template and confirm or supersede decision 0008 before real provider
implementation.
