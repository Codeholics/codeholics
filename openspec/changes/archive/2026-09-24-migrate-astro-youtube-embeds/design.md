# Design

## Context

See `proposal.md` for motivation. The current Astro site imports only `src/content/posts/*.md` in both `src/lib/posts.ts` and `src/pages/search.html.astro`, derives slugs by trimming the `.md` suffix, and builds excerpts from raw Markdown text. Six migrated Astro posts still contain Pelican-era `{% youtube <id> %}` tags, which do not map to Astro components and are currently incompatible with the existing content pipeline. The repo does not yet include MDX support or an Astro embed package.

## Goals / Non-Goals

**Goals:**
- Render YouTube videos in migrated Astro posts without changing the posts' current slugs or YouTube IDs
- Introduce a reusable Astro embed dependency that can support future non-YouTube embed work
- Keep the existing published-post, draft-filtering, and search-index behavior working across both Markdown and MDX post files
- Limit the content migration to the known Astro posts that still carry Pelican YouTube tags

**Non-Goals:**
- Rebuild all Astro posts as MDX when they do not need embeds
- Preserve Pelican liquid-tag syntax inside Astro Markdown files
- Introduce a generalized shortcode parser for arbitrary legacy Pelican plugins
- Change the layout or visual styling of non-embed posts

## Decisions

### Use `astro-embed` as the embed package
- **Decision:** Install `astro-embed` rather than the YouTube-only package.
- **Rationale:** The immediate need is YouTube, but the package choice should not force another dependency change if the migration later needs Vimeo, social, or gist embeds.
- **Alternative considered:** `@astro-community/astro-embed-youtube` is smaller but narrows the dependency to a single provider, which does not match the stated future-flexibility goal.

### Use MDX for the affected posts instead of a custom Markdown shortcode bridge
- **Decision:** Enable `@astrojs/mdx` and migrate only the YouTube-tagged Astro posts to `.mdx`.
- **Rationale:** Astro components can be used directly in MDX, which makes the embed authoring explicit and avoids inventing a custom parser for Pelican liquid-tag syntax.
- **Alternative considered:** A Markdown processor plugin that translates `{% youtube ... %}` into Astro-compatible output would preserve the old syntax, but it would create custom compatibility logic that only exists for legacy tags and would still need search/excerpt handling.

### Expand the post content pipeline to support both `.md` and `.mdx`
- **Decision:** Update post module discovery, raw-content loading, and slug resolution to treat Markdown and MDX posts as the same logical collection.
- **Rationale:** Only a subset of posts needs MDX, so the loader must handle mixed formats without changing route generation, excerpt fallbacks, or draft behavior.
- **Alternative considered:** Converting the full post corpus to MDX would simplify the globbing rules but expands the migration surface for no user-facing gain.

### Normalize raw-text extraction around MDX syntax
- **Decision:** Extend the raw-content cleanup used for excerpts and search so it strips MDX imports and component markup in addition to Markdown formatting.
- **Rationale:** The current search code reads raw source text; without extra normalization, search results for migrated posts would leak implementation syntax instead of clean reader-facing text.
- **Alternative considered:** Ignoring raw-text cleanup and relying only on frontmatter summaries would leave summary-less posts with degraded search excerpts.

## Risks / Trade-offs

- **Mixed `.md` and `.mdx` content increases loader complexity** -> Mitigation: keep one shared loading and raw-text normalization path so route generation, draft filtering, and excerpts stay aligned.
- **MDX imports can pollute search/excerpt text if cleanup misses a pattern** -> Mitigation: explicitly strip import lines and embed component tags in the shared text-normalization helper and the search-page copy of that logic.
- **Converting files from `.md` to `.mdx` could accidentally alter slugs if suffix handling is inconsistent** -> Mitigation: derive slugs from the basename without assuming a single extension.

## Migration Plan

1. Add `@astrojs/mdx` and `astro-embed`, then wire MDX into `astro.config.mjs`.
2. Update the Astro post loaders, raw-content helpers, and search index generation to discover `.md` and `.mdx` posts together.
3. Update Tailwind content globs to include MDX-authored post content.
4. Rename the six Astro posts that still contain YouTube liquid tags from `.md` to `.mdx`.
5. Replace each `{% youtube <id> %}` tag with the Astro YouTube component while preserving the same `<id>` value in the new markup.
6. Validate that the migrated posts still resolve under the same slugs and that search excerpts remain reader-facing text.
