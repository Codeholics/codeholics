# Proposal

## Why

Astro posts cannot currently turn Mermaid code fences into diagrams, leaving technical content dependent on external images or unrendered diagram source. Build-time Mermaid rendering keeps diagrams versioned with their Markdown and produces static, deployable output.

## What Changes

- Render `mermaid` fenced code blocks in Astro Markdown and MDX posts as inline SVG during site builds.
- Preserve the `mermaid` fence language through the site's code-fence normalization step so the renderer receives it.
- Add the build-time browser dependency required by Mermaid rendering.
- Require Astro post metadata to use YAML frontmatter compatible with the content collection schema.

## Capabilities

### New Capabilities
- `content/mermaid-diagrams`: Render Mermaid diagrams authored in Astro post Markdown during static-site builds.

### Modified Capabilities
- None.

## Impact

- `astro/astro.config.mjs`
- `astro/src/lib/markdown-code.mjs`
- `astro/package.json` and lockfile dependencies
- Markdown and MDX posts under `astro/src/content/posts/`
- Build environments must install the Playwright Chromium browser before building the site.