# Proposal

## Why

The Astro migration post is still marked as draft and therefore excluded from normal site surfaces, including RSS. We need to finalize the editorial copy and publish it now so migration communication is visible to readers.

## What Changes

- Publish `astro/src/content/posts/migrating-codeholics-from-pelican-to-astro.md` by removing draft state.
- Finalize editorial copy in that post:
  - remove the explicit draft note,
  - update draft-oriented language in summary and closing sections to published wording.
- Update RSS feed verification in `astro/tests/rss.spec.ts` so the migration post is expected to appear once published.
- No feed engine, routing, or content-loading logic changes.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- None. This is a content publication/editorial update and test expectation adjustment; no spec-level behavior changes are introduced.

This change will set `skip_specs: true` in `.openspec.yaml`.

## Impact

- Affected content: `astro/src/content/posts/migrating-codeholics-from-pelican-to-astro.md`
- Affected verification: `astro/tests/rss.spec.ts`
- Affected process: OpenSpec change metadata (`skip_specs`) to reflect non-spec-level scope.
