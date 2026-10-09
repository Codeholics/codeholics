# Design

## Context

See [proposal.md](./proposal.md) for motivation. The shared Astro layout already emits Open Graph metadata, but defaults to `# Codeholics`, `Default subtitle`, a missing `/assets/og-default.png`, and a hard-coded homepage URL. All page routes currently invoke the layout without metadata props, and the HTML title is fixed.

Post collection data already declares `title`, `summary`, and `thumbnail`. `getPostDescription` in `astro/src/lib/posts.ts` provides summary-first description generation with a plain-text body excerpt fallback. The returned post retains a typed `entry.data` even though the separate `frontmatter` record is loosely typed.

`astro/site.config.mjs` configures the canonical origin through `SITE_URL`; the production fallback is `https://www.codeholics.com`. Existing `deployment/site-url` requirements already cover that behavior. `publicAssetUrl` supports a development-only asset origin, which must not become the canonical social URL source. One existing thumbnail is authored with backslashes.

The existing Playwright setup builds the app and serves preview on port 3000. Node-based site URL checks already build with default, override, and invalid URL configurations. `content/post-images` requirements cover visible thumbnails and Markdown images, which must remain unchanged.

## Goals / Non-Goals

**Goals:**
- Keep metadata generation centralized in the server-rendered layout.
- Wire published posts to existing typed content data and description logic.
- Make images and page identity correct for production and alternate deployment builds.
- Validate actual generated HTML and served assets, not just source strings.

**Non-Goals:**
- No new frontmatter field, mandatory thumbnail, or stricter metadata publishing gate.
- No automatic per-post image generation, crawler-specific runtime service, or external preview API.
- No changes to post URLs, content publication rules, card rendering, article bodies, or unrelated SEO features.
- No custom copy for every tag/category/listing page; those retain meaningful site defaults with correct route URLs.
- No guarantee of a particular Facebook layout or automatic updates to already published shares.

## Decisions

### 1. A typed layout contract owns the metadata

Define focused props for title, description, optional share image, and Open Graph type (`website` or `article`). Replace placeholder defaults with Codeholics identity and a description aligned with the homepage's existing introductory copy. Emit HTML title/description, canonical link, `og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:site_name`, and matching Twitter card metadata once in the head. Preserve favicon and existing Facebook app metadata.

Astro's normal attribute/text serialization will escape authored values. Do not construct metadata using raw HTML injection.

**Alternative:** Duplicate tags in each page. Rejected because it makes defaults and cross-platform consistency harder to maintain.

### 2. Use existing post data without expanding the authoring model

The post route will pass `post.entry.data.title`, `getPostDescription(post)`, the optional thumbnail, and `article` to the layout. Empty thumbnails use the default image. Use the typed collection entry rather than adding casts to the loose frontmatter record.

**Alternative:** Add separate social title, description, and image fields. Deferred because the existing fields satisfy this request and extra authoring rules are unnecessary.

### 3. Derive canonical URLs from Astro's configured site

Resolve the current pathname against `Astro.site`; do not copy the hard-coded production URL or derive canonical identity from localhost/request origins. Exclude query strings and fragments and preserve the built route path and existing trailing-slash behavior. Fail clearly if the required configured site is unavailable rather than emitting a success-shaped localhost fallback.

Resolve local image paths against the same configured site, normalizing backslashes to URL separators for metadata. Leave absolute HTTPS image URLs intact. Do not use the development-only asset origin for canonical social image URLs. Keep this normalization scoped to metadata; do not rewrite visible image rendering or authored posts.

**Alternative:** Keep accepting an arbitrary per-page URL prop. Rejected because no current caller uses it and derived route URLs prevent the homepage default from leaking into every post.

### 4. Ship one branded raster fallback

Add a static 1200x630 PNG or JPEG under `astro/public/assets` and point the layout's default at that actual asset. The user supplied `astro/public/images/Codeholics-Hero.webp` for this purpose. Preserve the original and derive `astro/public/assets/og-default.png` using the existing image tooling, resized with a centered cover fit. This does not require a redesign or per-post image pipeline.

Reuse supplied post thumbnails as-is. Advertise 1200x630 dimensions only for the known default asset, or use verified dimensions for another image; never label all thumbnails with the default size. Raster output avoids depending on social crawler SVG support.

**Alternative:** Use a favicon as the fallback or generate every post card at build time. Rejected because a favicon is too small for a dependable large preview and a generation pipeline adds unnecessary complexity.

### 5. Test crawler-facing output using existing tooling

Add focused Playwright tests that inspect raw response HTML without JavaScript dependency. Cover the homepage, a published post with summary/thumbnail, and a post without optional metadata. Use isolated fixtures or a controlled test build when necessary to cover special-character escaping, external HTTPS images, and legacy backslash paths without altering production content.

Verify tag uniqueness, matching values, page-specific canonical URLs, large-image card type, image response content types, and actual fallback dimensions. Extend the existing site URL verifier to check built homepage and post metadata under default and override origins, retaining its invalid URL assertion. Keep tests focused rather than introducing a new runner.

**Alternative:** Only test browser-rendered UI or source templates. Rejected because social crawlers consume initial HTML and image responses, not the visible article UI.

## Risks / Trade-offs

- [Facebook retains cached metadata] -> Document deployed URL validation and Sharing Debugger re-scraping; explain existing-share limitations.
- [Supplied thumbnails have variable sizes or future broken paths] -> Validate existing referenced local share images and avoid false dimension declarations; document image accessibility and recommended artwork dimensions.
- [External images depend on another host] -> Preserve authored HTTPS URLs and verify URL handling locally without depending on third-party availability in tests.
- [Shared layout changes affect every route] -> Keep defaults valid and test representative listing routes, favicon preservation, and unchanged post presentation.
- [Preview runs locally while canonical metadata uses deployment origin] -> Map local asset paths to the preview server for availability tests, while asserting deployment-host values in metadata.

## Migration Plan

1. Implement layout metadata, post wiring, the fallback asset, targeted tests, and related documentation together.
2. Run the focused tests, build, and default/override site URL verification.
3. Deploy through the existing Astro workflow; verify live homepage/post HTML and image responses before requesting a new Facebook scrape.
4. Roll back the change as a unit if needed. No data migration or route rollback is required, though social platforms may continue serving cached previews.
