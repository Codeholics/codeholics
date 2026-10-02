# Proposal

## Why

AI-assisted post drafting in this repository has repeatedly produced Astro posts with incomplete front matter, especially missing `summary`. That inconsistency reduces post-listing quality and creates avoidable editorial cleanup work.

## What Changes

- Add a warning-only metadata enforcement workflow for AI-assisted Astro post generation.
- Define required metadata keys for Astro posts as repository standards: `title`, `date`, `category`, `tags`, `slug`, and `summary`.
- Emit clear per-file warnings when required metadata is missing or empty, without blocking publishing or build workflows.
- Scope enforcement to AI-assisted authoring flows only; manual-only authoring remains unchanged by default.

## Capabilities

### New Capabilities
- `content/ai-post-metadata-enforcement`: Defines warning-only validation behavior for required Astro post front matter during AI-assisted content generation.

### Modified Capabilities
- None.

## Impact

- Affected area: Astro content authoring workflow for posts under `astro/src/content/posts`.
- No behavior change to runtime rendering, routing, or existing build outputs.
- No dependency or API additions required for the planning phase.
