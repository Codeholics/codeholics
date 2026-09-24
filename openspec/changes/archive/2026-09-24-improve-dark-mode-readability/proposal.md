# Proposal

## Why

The Astro site already supports light, dark, and auto theme selection, but several reading surfaces still rely on hard-coded light-mode utility classes or incomplete dark-token coverage. That can leave post pages readable only in parts, with dark backgrounds paired against text, links, or content treatments that do not consistently adapt for long-form reading.

## What Changes

- Define a dark-mode readability capability for the Astro site with required contrast treatment for page backgrounds, content surfaces, headings, body copy, muted metadata, links, and code blocks.
- Require article pages and other long-form reading surfaces to use a dedicated dark content palette instead of relying on light-only utility classes or partial dark overrides that can produce unreadable text.
- Require the theme to keep dark-mode colors coherent across shared UI surfaces such as the app bar, post cards, search UI, and syntax-highlighted/code content.
- Preserve existing light-mode behavior and existing theme-toggle behavior while making dark mode visibly readable and distinct.

## Capabilities

### New Capabilities
- `ui/dark-mode-readability`: Defines the observable dark-theme color and contrast behavior for content-heavy pages and shared theme surfaces.

### Modified Capabilities
- None.

## Impact

- Affected code: `astro/src/styles/global.css`, `astro/src/layouts/Layout.astro`, `astro/src/components/PostCard.astro`, and `astro/src/pages/posts/[slug].astro` plus any other Astro page/components that hard-code light-only surface/text utilities.
- Affected styling surfaces: article/post containers, post listing cards, app-bar/search UI, markdown prose, links, blockquotes, and code blocks.
- Dependencies/systems: Astro/Tailwind styling in the `astro/` app and the existing client-side theme preference logic in the layout and header components.
