# Proposal

## Why

The Astro site currently relies on default markdown highlighting behavior, which does not reliably highlight all fenced code languages used in existing posts. This causes inconsistent code readability and weakens both the light/dark reading experience and technical content quality.

## What Changes

- Add an explicit Astro markdown highlighting configuration based on Shiki, with a defined language/theme strategy instead of implicit defaults.
- Add language alias normalization so legacy fence tags (such as uppercase language names) resolve to supported grammars without requiring bulk content edits.
- Add a presentation layer for code blocks (for example line emphasis and copy affordances) while preserving existing prose and dark-mode readability behavior.
- Define validation expectations so unsupported or malformed fence tags are detectable during content and build workflows.

## Capabilities

### New Capabilities
- `ui/code-highlighting`: Define how markdown/MDX fenced code is normalized, highlighted, themed, and presented in Astro pages.

### Modified Capabilities
- `ui/dark-mode-readability`: Clarify dark-mode requirements for syntax token contrast and enhanced code-block UI states introduced by the new highlighting system.

## Impact

- **Affected code**: `astro/astro.config.mjs`, markdown/MDX processing configuration, post rendering styles in `astro/src/styles/global.css`, and potentially post page rendering wrappers.
- **Dependencies**: Likely adds markdown/highlighting ecosystem packages (for example a code-block presentation plugin and related rehype/remark utilities).
- **Content compatibility**: Existing posts in `astro/src/content/posts` continue to render without mass fence-label edits through alias normalization.
- **Build behavior**: Markdown compilation and visual output of code blocks change in a controlled way; no runtime API changes are expected.
