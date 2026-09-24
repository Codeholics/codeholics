# Proposal

## Why

The Astro app bar currently hard-codes white or near-white text and icon treatments even when the site resolves to light mode. Because the header surface becomes light in that mode, navigation links and header controls can lose contrast and become difficult to read.

## What Changes

- Define a light-mode readability requirement for the Astro app bar so brand text, primary navigation links, utility icons, and search controls remain readable on a light header surface.
- Keep the current light header aesthetic instead of switching the navbar to a dark surface in light mode.
- Introduce dedicated header-specific light-mode tokens and interaction states so hover, focus, and input states remain visible without relying on dark-mode colors.
- Preserve existing dark-mode behavior, theme-toggle behavior, navigation structure, and desktop/mobile layout behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui/site-navigation`: Add light-mode app-bar contrast requirements for brand, navigation links, header controls, and search UI.

## Impact

- Affected code: `astro/src/components/Header.appbar.astro`, `astro/src/styles/global.css`, and any shared header utility classes used for search, icons, and interactive states.
- Affected behavior: light-mode readability of the brand, primary navigation, theme toggle, search trigger/input/button, social icons, and top-level mobile header controls.
- Dependencies/systems: Astro client-side theme selection, existing app-bar structure, and header-specific CSS tokens and state styles.
