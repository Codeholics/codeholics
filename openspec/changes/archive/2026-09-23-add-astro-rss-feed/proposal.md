# Proposal

## Why

The Astro navbar currently points its RSS icon at the legacy Pelican feed instead of an Astro-generated feed. Adding a native Astro RSS endpoint removes that dependency, keeps subscriptions aligned with published Astro posts, and gives the site a clear foundation for richer feed support later.

## What Changes

- Add an Astro-native RSS endpoint at `/rss.xml` that publishes excerpt-based items for non-draft Astro posts.
- Generate feed item metadata from the existing Astro post source, including title, publication date, canonical post URL, and a generated excerpt when no authored summary is available.
- Configure the Astro site with a canonical `site` URL so feed items resolve to absolute links.
- Repoint the navbar RSS icon from the old Pelican feed URL to the new Astro feed endpoint.
- Keep full-content RSS out of scope for now; defer it to a later change after content cleanup and feed-shape validation.

## Capabilities

### New Capabilities
- `content/rss-feed`: Provide an Astro-generated RSS feed for published site posts at a stable feed URL.

### Modified Capabilities
- `ui/site-navigation`: update the RSS social-link destination so the navbar points to the Astro-native feed instead of the legacy Pelican feed.

## Impact

- `astro/package.json`
- `astro/astro.config.mjs`
- New feed endpoint under `astro/src/pages/`
- `astro/src/lib/posts.ts` or nearby helpers for feed-safe excerpt generation
- `astro/src/components/Header.appbar.astro`
