# Proposal

## Why

The Projects page loads a 2,011,068-byte PNG even though a genuine 93,582-byte WebP of the developer-desk artwork is already available. On the shared development page, the light theme also retains near-white hero text and dark-only image overlays, making the introduction difficult to read and the artwork transition visibly abrupt.

## What Changes

- Serve the existing full-size WebP as the decorative hero image. Verify the actual WebP response and decoded dimensions, not just its filename; this asset is 1983 by 793, while the current PNG and image attributes are 1920 by 768.
- Bind hero title, introduction, eyebrow, divider, and blending treatment to the site's existing light/dark palette. Preserve the artwork itself, the dark-theme atmosphere, and the approved violet/lavender/slate colors in root `Design.md`.
- Make desktop and mobile overlay gradients follow the active page background rather than retaining hard-coded dark stops in light mode. Protect the text area from varying artwork brightness.
- Verify the entire Projects page in both themes: hero, repository cards and metadata, category tabs, empty/populated panels, links, hover, and keyboard focus. Limit any additional corrections to confirmed Projects-page theme defects.
- Extend the existing Playwright coverage to assert WebP delivery, explicit light/dark behavior, meaningful text contrast, theme switching, and responsive layout. Keep the existing navigation, safe repository links, static metadata, and keyboard behavior.
- Document the canonical artwork and theme behavior in the existing Featured Projects documentation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/github-projects`: require real WebP hero delivery, explicitly theme-aware hero blending and text, and light/dark coverage of the full Projects page. Replace the existing unconditional dark-gradient desktop wording with theme-aware blending while retaining the approved unboxed composition.

## Impact

- Implementation targets: `astro/src/pages/projects/index.astro`, `astro/tests/github-projects.spec.ts`, and the Featured Projects section of `astro/README.md`.
- Reuse `astro/public/images/projects/cyberpunk_developer_desk_under_moonlight_fullsize.webp`, `publicAssetUrl`, the existing layout options, and the existing shared theme variables.
- Related component styles may change only if both-theme verification demonstrates a coupled problem in `GithubProjects.astro`, `GithubProjectCard.astro`, or `CuratedProjects.astro`.
- No new dependencies, client-side framework, theme script, image generation pipeline, or site-wide palette changes. Keep the PNG source asset unless a separate cleanup is approved.
- This focused implementation plan is independent of the broad, review-only `review-site-implementation` change; it does not start that review or modify its artifacts.

## Non-goals

- Redesigning the site palette, fonts, repository content, category behavior, or page structure.
- Replacing or recoloring the artwork, changing the global theme selector, or removing unrelated assets.
- Implementing fixes during this planning workflow.
