# Story Backlog

Populated from the CafeMood Map spec (intake #1, 2026-07-06). All stories are
`planned`; none are selected for implementation yet. Design source: extracted
handoff under `docs/design/project/` (see `docs/product/overview.md`); cloud
original on [claude.ai/design](https://claude.ai/design/p/c1d6d55d-c7e3-4bc5-b67a-6b50416f5dbd?file=CafeMood+Complete+App.dc.html).

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
| E01-design-system | Tokens, component kit, map pin + sheet shells | Batch 0 | US-001..003 | sliced |
| E02-onboarding-auth | Splash, welcome, intro, auth, location, taste | Batch 1 | US-004..007 | sliced |
| E03-map-discovery | Map home, sheet, search, AI finder, filters, states | Batch 2 | US-008..013 | sliced |
| E04-cafe-detail-save | Detail, gallery, insight, save, share | Batch 3 | US-014..018 | sliced |
| E05-planning-contribution | Routes, work/date planners, check-in, clips | Batch 4 | US-019..022 | sliced |
| E06-library-profile | Saved, collections, taste, profile, states, tabs | Batch 5 | US-023..027 | sliced |
| E07-qa-demo-polish | Full QA, prototype wiring, demo polish | Batch 6 | US-028 | sliced |

Suggested implementation order: E01 first (everything depends on tokens and
components), then E02/E03 in parallel-ish, E04, E05, E06, E07 last. High-risk
stories (US-005 auth, US-008 map provider, US-011 AI provider) must expand to
the high-risk template and confirm decision 0008 before implementation.
