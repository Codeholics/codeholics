# Tasks

## 1. Shared site metadata and default share image

- [x] 1.1 Add a branded 1200x630 PNG or JPEG under `astro/public/assets` and replace the missing default share image reference; verify the asset's actual dimensions, format, successful preview response, and image content type.
- [x] 1.2 Add typed metadata props and meaningful Codeholics defaults to `astro/src/layouts/Layout.astro`; emit one HTML title, description, canonical link, Open Graph tag set, and matching `summary_large_image` Twitter card set while preserving favicons and the Facebook app ID; verify raw homepage HTML contains the expected values exactly once and requires no JavaScript.
- [x] 1.3 Derive page URLs from `Astro.site` and the current pathname, normalize local share-image URL separators, preserve absolute HTTPS image origins, and emit only accurate known image dimensions; verify focused cases for query/fragment exclusion, backslash paths, external image URLs, and thumbnails with dimensions unlike the default.
- [x] 1.4 Add the shared-metadata and asset assertions to focused tests using existing Node/Playwright tooling, without changing production content for fixtures; verify homepage and a representative listing page pass and metadata safely encodes special characters.
- [x] 1.5 Document site defaults, recommended share image dimensions, and canonical-host behavior in `astro/README.md`; verify the guidance names the shipped asset and agrees with generated homepage metadata.

## 2. Published post metadata

- [x] 2.1 Wire `astro/src/pages/posts/[slug].astro` to pass the typed post title, `getPostDescription(post)`, optional thumbnail, and article type into the layout; verify the self-taught hacker post emits its authored title, summary, thumbnail URL, and its own canonical route.
- [x] 2.2 Add focused tests for posts without summaries or thumbnails, blank optional values, special-character titles, and the existing backslash-authored thumbnail; verify plain-text description fallback, the shared image fallback, matching Open Graph/Twitter values, and reachable existing local share assets without false image dimensions.
- [x] 2.3 Add regression assertions for post routes, draft exclusion, rendered content, post-card thumbnails, and favicon preservation; verify the relevant targeted tests pass without publication or presentation changes.
- [x] 2.4 Extend post image guidance in `astro/README.md` to explain thumbnail reuse for social previews and fallback behavior; document deployment checks and Facebook Sharing Debugger re-scraping with cache limitations, and verify the example fields and URLs match the implemented behavior.

## 3. Deployment-origin verification and integration

- [x] 3.1 Extend `astro/scripts/verify-site-url.mjs` to inspect generated homepage and post canonical, Open Graph, and local image URLs under the default and overridden `SITE_URL`; retain the invalid-URL failure check, document the verification command alongside the related guidance, and verify `npm run test:site-url` passes.
- [x] 3.2 Run the focused social-sharing Playwright tests and relevant existing route/RSS tests, then leave a successful default-origin production build using `npm run build`; verify no unrelated route, feed, or asset regressions and record the command outcomes.
- [x] 3.3 Provide a deployment handoff identifying one homepage URL, one post URL, and their image URLs to inspect before requesting a fresh Facebook scrape; verify the handoff distinguishes locally verified output from live deployment checks and platform-controlled cache behavior.

## Verification Results

- `npm run test:e2e -- tests/social-sharing.spec.ts tests/link.spec.ts tests/rss.spec.ts`: 8 tests passed.
- `npm run test:social-sharing`: passed escaping, external HTTPS imagery, blank/missing optional metadata, MDX excerpts, and draft exclusion; temporary fixture sources and generated post routes were removed.
- `npm run test:site-url`: default and overridden homepage/post canonical and image URLs passed alongside RSS checks; invalid URL rejected.
- Final `npm run build` with no `SITE_URL` override: succeeded, 241 pages built, inline-code lint passed. Final homepage and RSS contain no test fixtures or alternate deployment host.
- Editor diagnostics for changed implementation and test files: no errors. `git diff --check` and strict OpenSpec validation passed.
- Deployment handoff is documented in `astro/README.md` with the homepage, hacker post, and their image URLs. Live deployment and Facebook re-scraping were not performed.
