# Proposal

## Why

Authors need concise, GitHub-compatible callouts for important information without adopting a second fenced-directive syntax. GitHub-style alerts keep source Markdown readable in repositories while making notes, warnings, and cautions visually distinct on published posts.

## What Changes

- Recognize GitHub-style blockquote alerts written as `> [!TYPE]` in Astro Markdown and MDX posts.
- Render the supported alert types (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION`) as accessible, themed callout blocks.
- Preserve ordinary blockquotes and unrecognized alert markers as standard blockquote content.
- Document the supported authoring syntax and validate rendered alert output in light and dark themes.

## Capabilities

### New Capabilities
- `content/github-markdown-alerts`: Render GitHub-style Markdown alerts in published Astro posts.

### Modified Capabilities
- None.

## Impact

- Astro Markdown/MDX processing configuration and dependencies
- `astro/src/styles/global.css` theme tokens and prose styles
- Astro authoring documentation and post-content validation