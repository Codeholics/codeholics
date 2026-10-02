# Proposal

## Why

The Astro navbar currently exposes topic links and utility controls, but it dropped the social links that were present in the old Pelican navbar. Restoring those links brings back established site affordances and makes the header a more complete entry point for readers who want to follow or subscribe outside the site itself.

## What Changes

- Add icon-based social links for X, Facebook, Github, and RSS to the right side of the desktop navbar.
- Add the same social links to the mobile navigation panel so desktop and mobile readers both have access to the same destinations.
- Reuse the existing social URLs from the legacy Pelican configuration, including the legacy RSS feed URL.
- Preserve the current topic-based primary nav and existing search, theme toggle, and hamburger behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui/site-navigation`: extend the header navigation requirement to include a social-link group on desktop and in the mobile panel, with the legacy X, Facebook, Github, and RSS destinations.

## Impact

- `astro/src/components/Header.appbar.astro`
- Potential shared social-link data/helpers if implementation consolidates desktop and mobile social rendering
- Legacy social URLs currently sourced from `pelicanconf.py`
