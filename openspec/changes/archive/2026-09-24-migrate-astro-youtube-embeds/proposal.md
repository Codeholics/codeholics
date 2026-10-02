# Proposal

## Why

The Astro site still contains migrated posts that use Pelican's `{% youtube <id> %}` liquid tag syntax, which Astro does not render as an embed. Those posts need an Astro-native YouTube embedding path that preserves each post's existing video ID while fitting the current Astro content pipeline.

## What Changes

- Add Astro MDX support and the `astro-embed` dependency so Astro posts can render native YouTube embeds.
- Migrate the Astro posts that still contain `{% youtube <id> %}` to MDX and replace each liquid tag with an Astro YouTube embed component while preserving the original video ID.
- Update Astro post loading, raw-content access, and search indexing to support both `.md` and `.mdx` post sources without changing existing slugs or draft behavior.
- Update Tailwind content scanning so MDX-authored post content remains covered by the current styling pipeline.

## Capabilities

### New Capabilities
- `content/youtube-embeds`: Support Astro-authored posts embedding YouTube videos with the existing per-post YouTube IDs preserved in the Astro site output.

### Modified Capabilities
- None.

## Impact

- Affected Astro configuration and dependencies: `astro/package.json`, `astro/astro.config.mjs`
- Affected Astro content pipeline: `astro/src/lib/posts.ts`, `astro/src/pages/search.html.astro`, `astro/tailwind.config.cjs`
- Affected Astro content files: the migrated video posts in `astro/src/content/posts/` that still contain `{% youtube <id> %}`
