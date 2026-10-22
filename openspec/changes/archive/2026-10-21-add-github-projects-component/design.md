# Design

## Context

The production site is an Astro static build. The homepage is `astro/src/pages/index.astro`, the app-bar links are defined in `astro/src/components/Header.appbar.astro`, and shared light/dark presentation is driven by the site's existing theme styles. The current in-progress implementation fetches metadata for a fixed set of Codeholics repositories and places cards in the homepage sidebar. The supplied reference instead shows a dedicated page with a My Projects section and category-based curated recommendations.

## Goals / Non-Goals

**Goals:**
- Render both Codeholics repositories and curated recommendations on a dedicated `/projects/` page titled Featured Projects.
- Keep selected repositories and category assignments manually configurable and deterministically ordered.
- Resolve curated GitHub repository links to current metadata at build time, using the same repository-card presentation as My Projects.
- Preserve the site's theme behavior, responsive layout, accessibility, and static output.

**Non-Goals:**
- Fetch repository data in the browser or add client-side hydration.
- Replace or reuse the legacy Pelican helper in the retired production path.
- Add a CMS, repository discovery/search, persistent caching infrastructure, pagination, or a new UI dependency.

## Decisions

1. **Keep curated sources manually authored as GitHub repository URLs.** Maintain the Codeholics repository list and curated category/link list as build-time project data. A curator adds a GitHub repository URL and assigns it to a category; repository names, descriptions, language, stars, and forks come from GitHub metadata rather than being duplicated in the curated data. This keeps initial curation simple while allowing the category content to evolve later without designing a CMS now.

2. **Parse curated URLs into repository slugs and call only GitHub's API origin.** Accept canonical GitHub repository links, normalize a trailing slash or `.git` suffix, and extract the owner/repository slug before constructing the fixed `https://api.github.com/repos/{owner}/{repo}` endpoint. Reject invalid or non-repository URLs with a clear build warning; do not fetch arbitrary URLs. This avoids coupling the configuration to API-shaped URLs and prevents a configured link from redirecting server-side requests to an unrelated host.

3. **Separate data loading from page presentation.** Keep the ordered Codeholics sources, curated categories, and metadata-loading boundary separate from reusable repository cards. The full-width page has a My Projects section and a curated recommendations section. Category controls switch the visible curated list, matching the reference's category-tab interaction; use lightweight browser behavior rather than introducing a UI framework.

4. **Make repository requests independently non-fatal and deterministic.** Fetch configured repositories concurrently while retaining configured order and category grouping. Validate API status and required response fields, warn with the repository URL/name on invalid or failed requests, and omit only the unavailable card. Continue building the page and remaining categories when individual repositories fail.

5. **Keep optional credentials server-side.** When `GITHUB_TOKEN` is set, send it only in build-time GitHub API authorization headers. Never serialize it into props, markup, logs, or client code. Without it, use the public API; authentication remains optional and no workflow secret is required.

6. **Use the existing Astro and theme conventions for the visual treatment.** Build a full-width page with semantic sections, responsive project cards, category controls, and visible keyboard focus. Follow the reference's dark bordered cards and metadata hierarchy while using the site's theme styles so light and dark modes remain readable. Include safe external-link attributes on repository links.

## Risks / Trade-offs

- [The larger curated collection may hit GitHub's unauthenticated rate limit] → Fetch only manually selected repositories, allow an optional token, make requests concurrently, and omit failed entries with clear build warnings rather than failing the whole build.
- [A token could accidentally leak from build-time code] → Keep all fetch and token handling in Astro server frontmatter; test generated HTML and client assets for token absence.
- [A malformed curated URL could create a broken or unsafe request] → Parse and validate only GitHub repository URLs, then construct requests against the fixed GitHub API origin.
- [One failed recommendation could make a category look incomplete] → Preserve its category and source order, display other available entries, and report omitted repositories during the build.

## Migration Plan

No data migration or dependency installation is required. Add the dedicated page and navigation, move the existing My Projects presentation out of the homepage sidebar, and provide the curated category/link data through the build-time source. Deploy through the existing static build. Rollback consists of removing the page/navigation and restoring the prior homepage placement if desired; the rest of the site is unaffected.
