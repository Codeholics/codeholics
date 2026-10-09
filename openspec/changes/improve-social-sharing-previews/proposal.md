# Proposal

## Why

Shared links currently present generic Codeholics metadata rather than a post's title, summary, and image. The shared Astro layout also points to a missing default image and a hard-coded homepage URL, preventing informative, reliable link previews.

## What Changes

- Render server-generated Open Graph and Twitter card metadata for the homepage and published posts.
- Use each post's title, existing description helper, and optional thumbnail, with a real branded default share image for the homepage and posts without thumbnails.
- Resolve page and image URLs against Astro's configured canonical site URL, honoring the existing build-time `SITE_URL` override.
- Add canonical links, meaningful HTML titles and descriptions, site identity, and article type for post pages.
- Verify generated metadata and image availability, and document image authoring and Facebook cache refresh steps.

## Capabilities

### New Capabilities

- `frontend/social-sharing`: Crawler-readable social preview metadata with page-specific post information, valid absolute URLs, and dependable share images.

### Modified Capabilities

None. Existing `deployment/site-url` behavior is reused, and existing `content/post-images` card and body behavior is preserved.

## Impact

- Shared metadata in `astro/src/layouts/Layout.astro` and post metadata wiring in `astro/src/pages/posts/[slug].astro`.
- Existing `getPostDescription` helper, canonical site configuration, and `thumbnail` frontmatter.
- A default share asset under `astro/public`, targeted tests using existing Node/Playwright tooling, and directly related authoring documentation.
- No new production framework or dependency is expected. No URL migration, changes to publication filtering, or redesign of post cards is included.
- Social platforms control preview rendering and cache lifetime; correct deployed metadata enables richer previews but cannot force existing Facebook shares to update.
