# Proposal

## Why

The current header (astro/src/components/Header.astro) is functional but dated. Modernizing the navbar improves usability and alignment with contemporary web patterns: a prominent app-bar with iconography, a persistent theme toggle, and an animated hamburger that transforms to an X. This enhances discoverability, accessibility, and perceived polish for readers and contributors.

## What Changes

- Replace the existing Header with an App-bar style component featuring:
  - Left: brand logo + site title
  - Center: compact primary navigation (icons + labels on large screens)
  - Right: utility icons (search, theme toggle) and a responsive hamburger that animates to an X on mobile
  - Sticky/top elevation option and small shadow when scrolled
  - Improved keyboard and screen-reader accessibility (focus states, aria-expanded, skip-links)
- Add lightweight JS for hamburger animation and theme persistence (prefers-color-scheme + localStorage fallback)
- Add icons (SVG or an inline icon set) and a CSS utility for subtle motion (transform + opacity)
- Update styles in existing Tailwind-based CSS; minimal Tailwind config tweaks only if needed

## Capabilities

### New Capabilities
- `ui/site-navigation`: Implements a modern, accessible site navigation component (app-bar) with theme toggle and responsive behavior.
  - Covers: markup, accessible keyboard behavior, theme persistence contract, and mobile menu animation.

### Modified Capabilities
- _none_ — This change is purely a UI/UX enhancement; no backend API or data model requirements are changing.

## Impact

- Files affected (primary):
  - `astro/src/components/Header.astro` (replace/augment)
  - `astro/src/layouts/Layout.astro` (ensure body classes and font links remain compatible)
  - `astro/src/styles/global.css` (small additions for motion and focus)
  - Potential new helper file: `astro/src/components/ThemeToggle.tsx` or inline component
- Tech: Astro components, Tailwind utility classes, small vanilla JS module for menu toggle and theme persistence
- Risks: Accessibility regressions if aria/state not mirrored correctly; visual jank if animations are heavy on low-end devices


