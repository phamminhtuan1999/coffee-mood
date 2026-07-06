# Stories

Stories are work packets. They turn product intent into bounded implementation
and validation work.

Current packets: 28 planned stories across epics E01–E07 (CafeMood Map spec).
See `backlog.md` for the epic table and `scripts/bin/harness-cli query matrix`
for durable status. None are selected for implementation yet.

## Normal Story

Use `docs/templates/story.md` for normal feature work.

Suggested path:

```text
docs/stories/epics/E01-domain-name/US-001-short-story-title.md
```

## High-Risk Story

Use `docs/templates/high-risk-story/` when the feature intake classifies work as
high-risk.

Suggested path:

```text
docs/stories/epics/E02-risky-domain/US-012-risky-story-title/
  execplan.md
  overview.md
  design.md
  validation.md
```

## Status Flow

```text
planned -> in_progress -> implemented
                  |
                  v
               changed
                  |
                  v
               retired
```
