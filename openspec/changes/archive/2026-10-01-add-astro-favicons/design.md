# Design

## Context

The Astro site already contains `public/favicon.svg` and `public/favicon.ico`. The Pelican theme references PNG favicons, but the Astro layout currently exposes the SVG and ICO only. Browsers and some platforms expect raster PNG assets at common paths (`/favicon-32x32.png`, `/favicon-16x16.png`).

## Goals / Non-Goals

**Goals:**
- Provide 16x16 and 32x32 PNG favicon files derived from `favicon.svg`.
- Update `astro/src/layouts/Layout.astro` to reference the new PNGs using publicAssetUrl().

**Non-Goals:**
- Changing Pelican site files or theme templates.
- Altering existing `favicon.svg` or `favicon.ico` beyond deriving PNGs.

## Decisions

1. Derive PNGs from the existing SVG rather than hand-authoring PNG files. Rationale: single source of truth (SVG) and predictable rasterization across sizes.
   - Tool options considered:
     - ImageMagick (`convert`/`magick`): available in many environments, simple: `magick convert -background none favicon.svg -resize 32x32 favicon-32x32.png`.
     - sharp (Node): programmatic control (`npx sharp ...`) and consistent output in Node toolchains.
   - Chosen approach: use ImageMagick if available, falling back to a Node `sharp` script when CI/dev environments prefer Node-only tools. Provide commands in tasks.

2. Place PNGs in `astro/public/` so Astro serves them at the site root and `publicAssetUrl()` resolves to them.

3. Modify `astro/src/layouts/Layout.astro` to add explicit link tags:
   - `<link rel="icon" type="image/png" sizes="32x32" href={publicAssetUrl('/favicon-32x32.png')} />`
   - `<link rel="icon" type="image/png" sizes="16x16" href={publicAssetUrl('/favicon-16x16.png')} />`

## Risks / Trade-offs

- Rasterization differences across tools may produce slightly different pixel results; mitigate by providing both ImageMagick and sharp commands in tasks and selecting one in CI.
- If `favicon.svg` contains non-square art, resizing may crop/scale unexpectedly; review output visually during implementation.

## Migration Plan

1. Generate PNGs and add them to the repository under `astro/public/`.
2. Update `Layout.astro` to reference PNGs (and keep existing svg and ico links).
3. Run a local `npm run dev` and visually verify favicons in multiple browsers.

## Open Questions

- None that block implementation. If a preferred rasterization tool is mandated by CI, note it in tasks.
