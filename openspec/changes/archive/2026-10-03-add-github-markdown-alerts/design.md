# Design

## Context

Astro renders post Markdown and MDX through a unified processor before placing it inside the `.theme-prose` reading surface. Existing prose styles treat all blockquotes as quoted, italic text. The site already centralizes light and dark colors in CSS variables in `astro/src/styles/global.css`.

## Goals / Non-Goals

**Goals:**
- Support GitHub-style alert blockquotes without changing ordinary quote behavior.
- Give every supported alert type a clear label and readable themed treatment.
- Keep authored source compatible with GitHub's alert notation.

**Non-Goals:**
- Support fenced `:::note`-style directives.
- Add custom alert types or Markdown syntax beyond GitHub's five standard alert types.
- Change the existing light/dark mode selection behavior or restyle unrelated prose elements.

## Decisions

### Transform alert markers during Markdown processing
- **Decision:** Add a maintained Unified-compatible Markdown transformer that recognizes GitHub alert blockquotes before HTML is rendered.
- **Rationale:** Transformation at the Markdown stage supports both `.md` and `.mdx` posts and avoids client-side parsing or hydration.
- **Alternative considered:** Detect alerts with client-side JavaScript. Rejected because readers would see ordinary quotes until scripts run and static output would not carry the semantics.

### Preserve unsupported input as ordinary quotation
- **Decision:** Only the five GitHub alert types receive special rendering; unknown markers remain unchanged blockquote content.
- **Rationale:** Authors can use normal bracketed quotation text without turning content typos into build failures.
- **Alternative considered:** Reject unsupported markers at build time. Rejected because it makes a presentational extension unnecessarily brittle.

### Style alerts with existing theme roles
- **Decision:** Add alert-specific classes that consume the existing light/dark CSS variable system.
- **Rationale:** This preserves readable contrast in both themes and avoids introducing a parallel palette.
- **Alternative considered:** Hard-code per-alert colors in transformed post markup. Rejected because it cannot adapt cleanly to theme changes.

## Risks / Trade-offs

- [A transformer is incompatible with Astro's MDX pipeline] -> Select a maintained Unified plugin and validate both Markdown and MDX during implementation.
- [Alert styling is overridden by prose blockquote rules] -> Scope alert selectors more specifically and verify both theme modes.
- [Alert markup changes in a dependency upgrade] -> Verify generated HTML structure with a focused fixture or build-output check.

## Migration Plan

1. Select and install a compatible Markdown alert transformer.
2. Add it to the existing Markdown processing pipeline.
3. Add light/dark alert styling to the shared prose theme.
4. Document alert syntax and validate generated output for each supported type and an ordinary quote.

## Rollback Plan

Remove the alert transformer and alert-specific styles; alert sources will fall back to ordinary blockquotes without changing post content.