# Tasks

## 1. GitHub Metadata and Curated Sources

- [x] 1.1 Implement the server-only GitHub metadata loader for selected Codeholics repositories, including optional `GITHUB_TOKEN` authorization, response validation, stable ordering, per-repository warnings, and omission of failed entries; verify successful, unsuccessful, malformed, and thrown-request cases with mocked API responses.
- [x] 1.2 Add focused metadata tests and a project test command; verify `npm run test:github-projects` passes and token values are not returned as rendered metadata.
- [x] 1.3 Add manually maintained curated repository URLs grouped by category; parse only GitHub repository URLs into owner/repository identifiers and verify invalid or non-repository URLs are rejected without requesting arbitrary hosts.
- [x] 1.4 Extend focused metadata tests to verify curated repository details are fetched at build time, remain associated with their configured category and order, and fail independently; verify `npm run test:github-projects` passes.

## 2. Featured Projects Page

- [x] 2.1 Build a full-width `/projects/` page titled Featured Projects with distinct My Projects and curated category sections; verify a production build renders both sections and the category controls show the selected list.
- [x] 2.2 Add a Projects primary-navigation link, move the GitHub projects section off the homepage sidebar, and verify navigation and homepage placement with focused browser tests.
- [x] 2.3 Add or update browser tests for project links, category keyboard access and selected state, narrow/wide layouts, and light/dark readability; verify `npm run test:e2e -- tests/github-projects.spec.ts` passes.
- [x] 2.4 Document the Featured Projects page, curated repository-link configuration, and optional build-time `GITHUB_TOKEN` behavior in `astro/README.md`; verify the documented behavior matches the implementation.

## 3. Integration Verification

- [x] 3.1 Run the focused metadata tests, GitHub projects browser test, and production build; inspect the generated page and assets to confirm repository cards are statically rendered, category links work, no homepage sidebar panel remains, and no GitHub token or browser-side API request is emitted.
