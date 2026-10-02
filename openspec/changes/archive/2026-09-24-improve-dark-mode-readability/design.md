# Design

## Context

See `proposal.md` for motivation and `specs/ui/dark-mode-readability/spec.md` for the behavioral contract. The Astro site already has the right structural pieces for theming: `src/layouts/Layout.astro` resolves `light`/`dark`/`auto`, toggles `html.dark`, and `src/styles/global.css` defines CSS variables plus some dark-mode overrides. The readability gap comes from uneven adoption of those theme roles. Some shared surfaces still hard-code light-first Tailwind classes such as `bg-white`, `text-slate-900`, and `text-slate-700`, while long-form markdown rendering depends on partial `.prose` dark overrides and not every surface participates in the same token system.

Observed integration points:
- `Layout.astro` applies theme state at initial render and should remain the source of truth for dark-mode activation.
- `global.css` already defines a strong starting dark palette (`--bg`, `--page-text`, `--page-heading`, etc.) and dark-mode overrides for `.prose`, `.bg-white`, and common slate utilities.
- `PostCard.astro` and `src/pages/posts/[slug].astro` still encode core reading surfaces with light-mode utility classes, making content readability depend on override coverage.
- Search and several content pages already use semantic helper classes such as `theme-page-title`, `theme-page-copy`, `theme-surface`, and `theme-search-input`, which can be expanded instead of inventing a second theme system.

## Goals / Non-Goals

**Goals:**
- Make the existing Astro dark theme reliably readable on post pages and other content-heavy surfaces.
- Consolidate the chosen dark palette into the existing global CSS variable/theme helper system.
- Ensure cards, prose content, links, metadata, and code treatments read as one coherent dark theme.

**Non-Goals:**
- Replacing the current `light`/`dark`/`auto` theme-selection behavior.
- Changing Pelican theme files or aligning the legacy site in this change.
- Reworking layout, navigation structure, or typography beyond the color/readability fixes needed for dark mode.

## Decisions

### Keep global.css as the single source of truth for dark palette roles

Use the existing `:root` and `html.dark` token model in `astro/src/styles/global.css` rather than splitting palette definition across Tailwind config and ad hoc component classes. The recommended dark palette is:

| Role | Value |
|---|---|
| Page background | `#0b1220` |
| Surface background | `#0f172a` |
| Heading text | `#f8fafc` |
| Body text | `#e2e8f0` |
| Muted text | `#94a3b8` |
| Accent/link | `#a78bfa` |
| Accent hover | `#c4b5fd` |
| Code background | `#020617` |
| Code text | `#cbd5e1` |
| Subtle border | `rgba(148, 163, 184, 0.18)` |

This matches the site's existing violet/slate direction, keeps contrast high for long-form reading, and reuses the architecture already present in `global.css`.

**Alternatives considered:**
- Push the palette into Tailwind config only. Rejected because the site already depends on runtime CSS variables and `html.dark`, and duplicating theme roles would make maintenance harder.
- Use a harsher pure-black/white palette. Rejected because it reduces reading comfort and gives less separation between page and card surfaces.

### Convert content-heavy components to semantic theme classes instead of relying on light-first utility overrides

Post cards, post pages, and similar reading surfaces should use theme helper classes (`theme-surface`, `theme-page-title`, `theme-page-copy`, and new helpers where needed) rather than depending on broad dark overrides for `bg-white` and `text-slate-*`. This makes the intended dark-mode treatment explicit at the component level while still keeping the palette centralized.

**Alternatives considered:**
- Keep existing component classes and continue adding broader dark overrides for utility classes. Rejected because it is brittle and makes regressions likely when new components use different utility combinations.
- Restyle only the post detail page. Rejected because listing cards, search results, and other shared surfaces would continue to drift.

### Treat prose and code rendering as first-class themed surfaces

Markdown prose should receive complete dark-mode treatment for paragraph text, headings, links, blockquotes, inline code, fenced code blocks, horizontal rules, and table borders. The existing `.prose` overrides are a good start but need to fully align with the chosen palette so technical posts do not regress into mixed light/dark presentation.

**Alternatives considered:**
- Limit the change to container backgrounds and top-level text colors. Rejected because the readability complaint centers on actual post content, not just the shell around it.

## Risks / Trade-offs

- **Helper classes may overlap with existing utility-based styling** -> Mitigation: standardize the main reading surfaces first and reduce reliance on generic `html.dark .text-slate-*` compatibility rules where explicit helpers replace them.
- **Some markdown-rendered elements may still inherit unexpected colors from Tailwind typography defaults** -> Mitigation: audit the `.prose` token overrides against representative posts with links, lists, blockquotes, and code samples.
- **No visual regression suite exists for theme changes** -> Mitigation: validate the Astro site locally on representative surfaces including the homepage cards, a post detail page, and search results in dark mode.

## Migration Plan

1. Update `astro/src/styles/global.css` with the finalized dark token values and any additional helper classes needed for themed reading surfaces.
2. Replace hard-coded light-first classes in Astro content components/pages with semantic theme helpers or explicit dark-aware classes.
3. Validate representative Astro pages in dark mode, especially a post detail page and content cards with links and metadata.
4. Roll back by reverting the Astro theme/style changes if the new palette introduces regressions.
