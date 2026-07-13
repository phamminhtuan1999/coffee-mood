# Harness Backlog

Use this file when an agent discovers a missing harness capability but should
not change the operating model immediately.

## Template

```md
## Missing Harness Capability

### Title

Short name.

### Discovered While

Task or story that exposed the gap.

### Current Pain

What was hard, repeated, ambiguous, or unsafe?

### Suggested Improvement

What should be added or changed?

### Risk

Tiny, normal, or high-risk.

CLI value: `--risk tiny`, `--risk normal`, or `--risk high-risk`.

### Status

proposed | accepted | implemented | rejected
```

## Items

The durable backlog is authoritative. This committed copy keeps the same items
available to `harness-cli import brownfield` in a fresh clone.

## Missing Harness Capability

### Title

Authorize Claude Design MCP and deepen story design links

### Discovered While

CafeMood spec intake

### Current Pain

The original design URL was unavailable without interactive authentication, so
the initial story packets could reference screens only by project URL and name.

### Suggested Improvement

Import the design handoff and replace name-based references with concrete local
screen references.

### Risk

tiny

### Status

implemented

### Predicted Impact

Stories link directly to concrete design screens; implementation agents stop
hand-searching the design file by name.

### Actual Outcome

Resolved via the CoffeeMood handoff export: the local design files and concrete
frame labels are linked from the story packets.

## Missing Harness Capability

### Title

AGENTS.md references missing .codex/skills/harness-intake-griller skill

### Discovered While

CafeMood spec intake

### Current Pain

AGENTS.md requires a project-scoped skill path that is not available in every
fresh clone, leaving agents with a dead instruction path.

### Suggested Improvement

Commit the skill folder or update AGENTS.md to point to the installer-managed
location.

### Risk

tiny

### Status

proposed

### Predicted Impact

Intake instructions become followable on any clone.

## Missing Harness Capability

### Title

harness-cli story update cannot refresh notes

### Discovered While

CafeMood design handoff integration

### Current Pain

Story rows created with cloud-first notes cannot be refreshed to cite the local
handoff because `story update` does not support notes or contract changes.

### Suggested Improvement

Add `--notes` and `--contract` options to `story update`.

### Risk

tiny

### Status

proposed

### Predicted Impact

Durable story rows stay consistent with packet content after source-of-truth
changes.

## Missing Harness Capability

### Title

Untracked harness.db drifts across clones (story rows, verify commands)

### Discovered While

E01 proof-gap pass

### Current Pain

Fresh clones can report stale story status and lose verification commands,
forcing agents to reconcile durable rows against story Markdown manually.

### Suggested Improvement

Teach `harness-cli import` to refresh story status, proof flags, and verification
commands from story packets, or track a seedable database export.

### Risk

tiny

### Status

proposed

### Predicted Impact

The matrix stays trustworthy on any clone without manual row reconciliation.
