# Proposal

## Why

The Astro site currently hard-codes the production canonical URL, which makes dev-targeted builds emit production absolute URLs in RSS and any future canonical surfaces. That makes it awkward to deploy preview or dev builds to a different host while keeping generated URLs consistent with the actual deployment target.

## What Changes

- Add a build-time site URL capability for the Astro site that reads the canonical deployment URL from an environment variable.
- Keep the current production URL as the default when no build-time override is provided.
- Update RSS behavior so feed item links and other absolute URLs use the resolved build-time canonical URL instead of a hard-coded constant.
- Document the build command and environment variable needed for dev-targeted builds.

## Capabilities

### New Capabilities
- `deployment/site-url`: Configure the Astro site's canonical URL at build time with an environment variable and a production fallback.

### Modified Capabilities
- `content/rss-feed`: Feed absolute URLs should use the resolved build-time canonical site URL rather than assuming the production host.

## Impact

- Affected code: `astro/site.config.mjs`, `astro/astro.config.mjs`, `astro/src/pages/rss.xml.js`, and related documentation/tests.
- Affected behavior: builds targeting a dev host can emit correct absolute URLs without changing source files.
- No new external dependencies are expected.
