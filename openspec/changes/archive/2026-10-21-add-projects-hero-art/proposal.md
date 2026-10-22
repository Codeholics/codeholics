# Proposal

## Why

The Featured Projects page currently uses a text-only hero, while the supplied concept uses the Codeholics developer-desk artwork to establish its visual identity. Adding the artwork with CSS blending and glow effects will bring the implemented page closer to the concept while keeping the page title and introduction readable.

## What Changes

- Add the supplied developer-desk image to the Featured Projects hero, using the existing project image asset.
- Style the hero to match the concept: text on the left, artwork on the right, a dark gradient blend between them, and subtle neon color accents without an enclosing box.
- Start the hero directly beneath the navbar and size the desktop artwork region to its natural proportions so the scene is not cropped into a short horizontal strip.
- Keep the hero responsive, cropping or stacking the image appropriately on narrow screens without hiding or obscuring its text.
- Preserve accessible text contrast and avoid duplicating decorative image content for screen readers.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/github-projects`: Add visual and responsive behavior requirements for the Featured Projects page hero artwork.

## Impact

- Affects `astro/src/pages/projects/index.astro` and its styles.
- Uses the supplied 1920-by-768 full-size artwork at `astro/public/images/projects/cyberpunk_developer_desk_under_moonlight_fullsize.png`. The attachment has PNG content despite its `.webp` filename, so the public asset uses its actual format's extension.
- No new dependencies, API behavior, or route changes are expected.
