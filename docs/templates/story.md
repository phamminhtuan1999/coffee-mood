# US-XXX Story Title

## Status

planned

## Lane

tiny | normal | high-risk

## Product Contract

Describe the behavior this story must make true.

## Relevant Product Docs

- `docs/product/...`

## Acceptance Criteria

- Criterion 1.
- Criterion 2.
- Criterion 3.

## Design Notes

- Commands:
- Queries:
- API:
- Tables:
- Domain rules:
- UI surfaces:

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id <id> --unit 1 --integration 1 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Automated jest tests for this story's surfaces (decision 0009) |
| Integration | |
| E2E | |
| Platform | Manual iPhone 15 simulator smoke (390x844, safe areas), recorded in Evidence with a screenshot (decision 0010) |
| Release | |

Per decision 0010, `implemented` requires both the automated checks and the
manual simulator pass; neither substitutes for the other.

## Harness Delta

Document any harness updates made or proposed because of this story.

## Evidence

Add commands, reports, screenshots, or links after validation exists.
