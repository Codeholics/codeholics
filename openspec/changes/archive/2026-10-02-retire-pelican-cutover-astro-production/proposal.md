# Proposal

## Why

Codeholics now treats Astro as the production site, but repository automation and documentation still operate as if Pelican is the active stack. This split increases maintenance overhead and creates deployment ambiguity.

## What Changes

- **BREAKING** Remove Pelican as a supported build and deployment path from this repository.
- **BREAKING** Switch CI and deployment workflows to build and ship Astro artifacts only.
- **BREAKING** Remove Pelican-specific project files and docs references after migration parity checks pass.
- Define a required migration gate that confirms all legacy Pelican post content is present in Astro before destructive removals.
- Adopt a break-and-reindex cutover policy (no legacy URL compatibility requirement).

## Capabilities

### New Capabilities
- `deployment/astro-production-cutover`: Defines the required behavior for Astro-only production build/deploy, migration gating, and hard retirement of Pelican paths in this repository.

### Modified Capabilities
- None.

## Impact

- Affected automation: `.github/workflows/build.yml`, `.github/workflows/deploy.yml`.
- Affected documentation: root `README.md`, `.github/copilot-instructions.md`, and any operational docs that still describe Pelican as active production.
- Affected legacy files/directories likely include `pelicanconf.py`, `publishconf.py`, `tasks.py`, `themes/pelican-bootstrap-5/`, Pelican dependency/manifests tied only to legacy build flow, and Pelican-specific `content/` handling paths (post-migration verification required first).
- Operational behavior change: old Pelican-style URLs are not preserved; downstream reindexing is expected after cutover.
