# Proposal

## Why

The Astro desktop app-bar shifts its centered navigation when the search control is opened because the desktop search form expands inline inside the header layout. This makes the header feel unstable and conflicts with the navigation spec's goal of a modern, usable desktop app-bar.

## What Changes

- Update the desktop search interaction so opening search does not change the header's overall layout width or move the inline primary navigation.
- Preserve the existing desktop search affordance, keyboard behavior, and access to the `/search.html` page while changing the presentation strategy.
- Keep the mobile search flow unchanged unless a shared implementation detail requires a non-visible refactor.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui/site-navigation`: refine desktop search behavior so utility controls remain accessible without shifting the desktop navigation layout when search is opened.

## Impact

- Affected code: `astro/src/components/Header.appbar.astro`, `astro/src/styles/global.css`
- Affected behavior: desktop app-bar search presentation and layout stability
- No API or dependency changes expected
