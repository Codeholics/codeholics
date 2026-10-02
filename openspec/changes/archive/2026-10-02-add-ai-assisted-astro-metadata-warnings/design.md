# Design

## Context

See `proposal.md` for motivation. The current Astro collection schema in `astro/src/content.config.ts` marks `category`, `tags`, `slug`, and `summary` as optional, and existing post utilities in `astro/src/lib/posts.ts` already tolerate missing fields by deriving fallbacks. Repository expectations for editorial quality now require those fields for AI-assisted drafts, but operationally the workflow should warn only, not fail.

## Goals / Non-Goals

**Goals:**
- Define a single warning-only metadata check contract for AI-assisted draft generation.
- Align warnings to repository-required front matter keys: `title`, `date`, `category`, `tags`, `slug`, `summary`.
- Keep existing publish/build behavior unchanged when warnings exist.
- Provide warning output that identifies file path and missing/empty fields.

**Non-Goals:**
- Changing Astro runtime schema from optional to required fields.
- Blocking builds or publication on metadata validation failures.
- Enforcing body-writing style, article structure, or category-specific templates.
- Auto-editing legacy posts to backfill metadata.

## Decisions

### Decision: Use warning-only enforcement with no exit-code failure
- **Choice:** Treat missing metadata as warnings only.
- **Why:** User explicitly requested warning-only behavior to avoid disruption while standards adoption is still incomplete.
- **Alternatives considered:**
  - **Hard-fail on missing metadata:** Rejected because most legacy posts currently miss `summary`, making immediate adoption too disruptive.
  - **No validation:** Rejected because it would continue inconsistent AI-generated output.

### Decision: Scope automatic checks to AI-assisted generation flow
- **Choice:** Run checks automatically only when AI helps generate a post; allow optional manual invocation.
- **Why:** Preserves existing manual authoring workflow while improving AI draft quality where metadata gaps are recurring.
- **Alternatives considered:**
  - **Run on every post-edit path:** Rejected as too broad for current adoption stage.
  - **Run only when publishing:** Rejected because feedback arrives too late in the drafting loop.

### Decision: Validate repository standards, not framework schema
- **Choice:** Keep Astro content schema optional and enforce stricter repository rules in the AI workflow layer.
- **Why:** Avoids breaking existing content and route/render behavior that currently handles missing metadata gracefully.
- **Alternatives considered:**
  - **Make collection schema required:** Rejected due to large legacy remediation cost.
  - **Per-post custom rules by category:** Rejected because current request is metadata-only, repository-wide.

## Risks / Trade-offs

- **[Warnings may be ignored]** -> Mitigation: Standardize warning format and include all missing keys per file to reduce ambiguity.
- **[Policy drift between workflow and content schema]** -> Mitigation: Keep required key list centralized in enforcement logic and referenced in change spec.
- **[Legacy inconsistency persists]** -> Mitigation: Keep enforcement warning-only now, and allow future tightening after backlog reduction.

## Migration Plan

1. Introduce the AI-assisted metadata warning check and required key list.
2. Integrate warning output into AI post-generation flow without changing success/failure semantics.
3. Validate against representative posts with complete and incomplete front matter.
4. Rollback path: disable workflow invocation while leaving content and runtime behavior untouched.
