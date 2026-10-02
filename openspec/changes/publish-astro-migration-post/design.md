# Design

## Context

See `proposal.md` for motivation. Current behavior treats the migration post as draft (`status: "draft"`), so content loading excludes it and RSS tests assert its absence. Publishing this post requires coordinated editorial updates in post frontmatter/body plus corresponding verification updates, without changing RSS generation or post filtering logic.

## Goals / Non-Goals

**Goals:**
- Publish the migration post by moving it out of draft state.
- Ensure post copy reads as published content (remove draft framing and replace draft-oriented language).
- Align RSS verification with the published state so automated checks validate expected inclusion.

**Non-Goals:**
- Modifying `src/lib/posts.ts` draft-filter logic.
- Changing RSS endpoint structure, canonical URL logic, or item serialization.
- Broad editorial rewrites of unrelated posts.

## Decisions

1. **Publish via content metadata change only**  
   Remove draft state in the post frontmatter rather than adding code flags or exceptions.  
   - Alternative considered: keep draft state and special-case RSS inclusion. Rejected because it conflicts with existing draft semantics.

2. **Treat this as editorial + test alignment, not behavior change**  
   Keep `skip_specs: true` because system behavior already supports this outcome (published posts appear, drafts do not).  
   - Alternative considered: modify `content/rss-feed` capability. Rejected because requirements remain unchanged.

3. **Update regression expectation in RSS test**  
   Replace the assertion that the migration slug is excluded with an assertion that it is present after publication.  
   - Alternative considered: delete the specific assertion entirely. Rejected because we want explicit coverage of the publication decision.

## Risks / Trade-offs

- [RSS cache or stale dev output can mask publication updates] -> Mitigate by validating feed output from a fresh build/test run.
- [Editorial wording drift could leave “draft” language in published copy] -> Mitigate with a targeted pass over summary, lead note, and closing paragraph.
- [Future edits might reintroduce draft status unintentionally] -> Mitigate by keeping explicit RSS test coverage for this post slug.

## Migration Plan

1. Edit migration post frontmatter/body to remove draft state and draft framing text.
2. Update RSS test expectation to assert migration slug inclusion.
3. Run targeted test/build validation for RSS output and post rendering.
4. Review generated feed entry and post page content for publication quality.

## Open Questions

- None.
