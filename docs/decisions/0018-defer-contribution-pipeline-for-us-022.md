# 0018 Defer Media And Check-In Submission Pipeline For US-022

Date: 2026-07-09

## Status

Accepted

## Context

US-022 ships the two contribution surfaces (Section F): the check-in vibe
report (five tactile questions with option chips; Submit Vibe Report) and the
add-vibe-clip screen (photo/video upload target, seven vibe tags, optional
note; Post Clip). planning.md's contract notes flag the real implications:
check-ins and vibe clips are the community data source feeding vibe scores and
confidence, and user-generated media implies storage and moderation concerns
(external systems + data model).

None of that infrastructure exists in this slice:

- Media capture needs an image/video picker (`expo-image-picker` or camera
  APIs) - not installed.
- Media upload needs storage, a moderation path, and a provider decision -
  decision 0008 keeps un-scoped provider additions out of UI slices.
- Check-in submissions need a schema and an aggregation pipeline before they
  can feed the vibe scores in `discovery.md` / `cafe-detail.md`; today those
  scores come from fixtures.

`query tools` registers none of these capabilities, so per the harness rule an
absent capability is a clean skip. Because no provider behavior ships, the
external-systems hard gate is not tripped; the deferral itself is this durable
record.

## Decision

US-022 implements both screens fully interactive client-side:

- The vibe report (`/cafe/[id]/check-in`) is tactile and complete: all five
  questions answer via chips, Submit Vibe Report enables only when every
  question is answered, and submitting swaps to an in-place thanks state. The
  submission is ephemeral client state - nothing is persisted or transmitted,
  and no schema is invented ahead of the community backend.
- The vibe clip screen (`/cafe/[id]/clip`) ships photo-first: the dashed
  upload target, tag chips, and note field are all present and the tags/note
  are live local state, but the upload target and Post Clip are inert until
  the media provider lands.

## Alternatives Considered

1. Install `expo-image-picker` and wire local-only media selection - pulls a
   native permission surface (photo library) into a UI slice with nowhere to
   send the media; the picker belongs with the upload/moderation work.
2. Persist vibe reports to localStorage - invents a client-side schema for
   data whose real home is the community backend; unlike saves (0014), no
   in-app surface consumes reports yet, so persistence would be dead weight.
3. Hide Post Clip / the upload target until providers land - breaks the F2
   visual contract and the photo-first framing.

## Consequences

Positive:

- Both contribution surfaces are demoable and testable in Expo Go with no new
  dependencies or permission prompts; the sub-20-second tactile flow is pinned
  by tests.

Tradeoffs:

- Submitted reports vanish on restart and do not affect vibe scores until the
  pipeline lands.
- The upload target and Post Clip do nothing until the media provider lands,
  consistent with the other deferred actions.

## Follow-Up

- The community-backend story adds the check-in schema, submission pipeline,
  and score aggregation, and expands to the high-risk template (external
  systems + data model + moderation) per the backlog's provider rule.
- The media story adds capture (`expo-image-picker`), upload, storage, and
  moderation, then wires the upload target and Post Clip.
- Profile/tab stories (US-026/027) add durable entries to both screens; until
  then they are deep-link only.
