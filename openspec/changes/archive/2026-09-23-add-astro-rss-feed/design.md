# Design

## Context

See proposal.md for motivation. The Astro project currently has no feed endpoint, no canonical `site` configured in `astro.config.mjs`, and its navbar RSS icon still points to the Pelican feed URL. Post loading already runs through `astro/src/lib/posts.ts`, which filters drafts and sorts posts by date, making it the natural source for feed items.

## Goals / Non-Goals

**Goals:**
- Ship a first-party Astro RSS feed at `/rss.xml`.
- Reuse the current Astro post source and draft filtering logic.
- Provide feed-safe excerpt descriptions without requiring mass frontmatter edits.
- Repoint the RSS navbar icon to the new local feed endpoint.

**Non-Goals:**
- Deliver full-content RSS in this change.
- Migrate old posts to authored summary frontmatter as part of the feed rollout.
- Add feed styling, autodiscovery tags, or multi-feed variants unless they fall out naturally from the implementation.

## Decisions

1. Endpoint-based feed generation
   - Use `@astrojs/rss` with a dedicated endpoint such as `src/pages/rss.xml.js`.
   - Why: it is Astro’s supported path for static feed generation and matches the project’s file-based routing model.
   - Alternative considered: hand-build XML. Rejected because it recreates behavior the Astro package already solves.

2. Reuse post loader plus feed helper
   - Reuse `loadPosts()` for post selection, then add a small helper to derive feed-ready excerpt text from summary or Markdown content.
   - Why: this avoids duplicating draft filtering and date sorting while keeping feed-specific formatting concerns isolated.
   - Alternative considered: import all markdown again inside the feed endpoint. Rejected because it would duplicate source-selection logic and increase drift risk.

3. Excerpt-based descriptions
   - Feed item descriptions should prefer `summary` frontmatter when present and fall back to generated plain-text excerpts from post markdown.
   - Why: only a small fraction of existing posts define summaries today, and excerpt-based output is a practical first step that avoids the complexity of sanitizing full post HTML.
   - Alternative considered: full-content RSS immediately. Rejected because it would require extra handling for relative links, embedded images, and legacy content cleanup.

4. Canonical site URL assumption
   - Use `https://www.codeholics.com` as the canonical Astro site URL unless explicitly changed later.
   - Why: the existing Pelican feed and current public links already use that domain, so it is the most grounded default for absolute feed URLs.
   - Alternative considered: leave `site` unset and emit relative links. Rejected because feed readers expect stable absolute item URLs.

## Risks / Trade-offs

- Excerpts may be uneven across older posts -> Keep the fallback generation simple and deterministic, and treat richer per-post summaries as future editorial cleanup.
- Feed endpoint can drift from post routing -> Generate item links from the same slug model used by `/posts/[slug]`.
- Canonical URL coupling -> Record the `https://www.codeholics.com` assumption in the change so it can be revisited if deployment topology changes.

## Migration Plan

1. Add `@astrojs/rss` and configure the Astro site URL.
2. Implement the RSS endpoint using published Astro posts and excerpt-based descriptions.
3. Repoint the navbar RSS social link to `/rss.xml`.
4. Build the site and verify the generated feed exists and uses absolute links.
