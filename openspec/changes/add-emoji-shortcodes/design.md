# Design

## Context

The site uses a shared Astro Unified processor for Markdown and MDX. Its Remark
pipeline currently normalizes fenced-code languages and transforms GitHub alert
blockquotes; Mermaid and Pretty Code then run as Rehype transforms. See
[`proposal.md`](./proposal.md) for the authoring motivation.

## Goals / Non-Goals

**Goals:**
- Convert recognized GitHub-compatible gemoji aliases in authored prose.
- Preserve existing Markdown, MDX, alert, Mermaid, and code-highlight behavior.
- Verify rendered output for supported aliases and literal fallback contexts.

**Non-Goals:**
- Add an emoji picker, emoji autocomplete, or client-side editor tooling.
- Convert arbitrary colon-delimited text or unsupported aliases.
- Replace literal Unicode emoji already authored in content.

## Decisions

### Transform aliases in the Remark stage
- **Decision:** Add a maintained gemoji-compatible Remark plugin to the shared
  Markdown processor, after the existing code-language normalizer and before
  existing alert processing.
- **Rationale:** A Markdown AST transform applies consistently to both Markdown
  and MDX before HTML rendering and leaves client-side code unnecessary.
- **Alternative considered:** Perform browser-side replacement. Rejected because
  static output would retain source aliases and readers could see unprocessed
  text before scripts run.

### Preserve literal text outside supported prose
- **Decision:** Limit conversion to recognized aliases in prose; unknown aliases
  and code nodes stay unchanged.
- **Rationale:** This avoids corrupting technical examples and lets authors use
  colon-delimited identifiers without build-time failures.
- **Alternative considered:** Treat every colon-delimited token as an emoji.
  Rejected because unknown aliases are common in code and prose.

### Validate through generated content fixtures
- **Decision:** Extend the existing build-output regression approach with
  temporary Markdown and MDX fixtures.
- **Rationale:** It verifies the configured Astro pipeline, not just a plugin in
  isolation, while keeping fixture content out of published posts.
- **Alternative considered:** Test only the transformer AST. Rejected because it
  would not prove Astro renders the transformed output correctly.

## Risks / Trade-offs

- [A shortcode transformer changes adjacent Markdown text] -> Include inline
  prose, unknown aliases, and code-context assertions in the regression check.
- [A plugin conflicts with current Remark transforms] -> Preserve their order
  and run the complete production build.
- [An alias is unsupported by the selected gemoji catalog] -> Preserve it as
  literal text and document that only recognized aliases convert.

## Migration Plan

1. Add the selected Remark dependency and register it in the shared processor.
2. Add Markdown/MDX generated-output regression coverage.
3. Document supported authoring behavior and run the production build.

Rollback by removing the transformer and its tests; existing shortcode source
will render literally again without content migration.
