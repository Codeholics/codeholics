# Proposal

## Why

Move the GitHub project showcase off the homepage sidebar into a dedicated Featured Projects page. The page will bring together Codeholics repositories and manually curated recommendations, organized so visitors can discover useful repositories by category.

## What Changes

- Add a dedicated, full-width Featured Projects page at `/projects/`, with a `Projects` navigation link.
- Show selected Codeholics repositories in a My Projects section.
- Add curated recommendation categories, initially managed by manually supplying GitHub repository links; resolve those links to repository metadata at build time.
- Present curated repositories in category-based lists inspired by the supplied reference, while keeping project cards accessible, responsive, and readable in both themes.
- Remove the GitHub projects panel from the homepage sidebar.

## Capabilities

### New Capabilities
- `ui/github-projects`: Present Codeholics and curated GitHub repositories on a dedicated, accessible Featured Projects page.

### Modified Capabilities
- None.

## Impact

- Affects `astro/src/pages/index.astro`, a new `/projects/` page, the app-bar navigation, and Astro components/data for GitHub project cards and curated categories.
- Adds build-time GitHub REST API requests for selected and manually configured repository URLs. `GITHUB_TOKEN` remains optional and server-only; unavailable repositories are reported and omitted without failing the build.
- Updates focused GitHub project tests, browser tests, and `astro/README.md`. No new package dependencies or browser-side GitHub requests are expected.
