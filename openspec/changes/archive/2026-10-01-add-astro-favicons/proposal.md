# Proposal

## Why

Add PNG favicon variants for the Astro site to improve browser and platform compatibility. The Astro site already includes favicon.svg and favicon.ico; providing 16x16 and 32x32 PNG versions ensures consistent rendering in browsers, pinned tabs, and some platforms that prefer PNG assets.

## What Changes

- Add derived PNG files to astro/public/: `favicon-32x32.png` and `favicon-16x16.png` (generated from the existing `favicon.svg`).
- Update `astro/src/layouts/Layout.astro` to include explicit <link> tags for the 32x32 and 16x16 PNGs using publicAssetUrl().
- No changes to the Pelican site or theme files; this change is scoped to the Astro site only.

## Capabilities

### New Capabilities
- None. This change updates static assets and template references only.

### Modified Capabilities
- None.

Note: this is a non-behavioral, assets-only change; set `skip_specs: true` if validation requires it.

## Impact

- Files added: `astro/public/favicon-32x32.png`, `astro/public/favicon-16x16.png` (derived from `astro/public/favicon.svg`).
- File modified: `astro/src/layouts/Layout.astro` (add PNG <link> elements).
- No API, infrastructure, or runtime behavior changes.


