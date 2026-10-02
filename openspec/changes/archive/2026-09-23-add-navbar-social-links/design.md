# Design

## Context

See proposal.md for motivation. The current Astro header already centralizes the topic navigation in `Header.appbar.astro`, but the right side only contains search, theme toggle, and the mobile hamburger. The legacy Pelican navbar rendered a separate social icon group using URLs defined in `pelicanconf.py`, so this change is mostly about restoring that behavior in the new Astro layout without crowding the mobile top bar.

## Goals / Non-Goals

**Goals:**
- Restore X, Facebook, Github, and RSS links in the Astro navbar using the existing legacy URLs.
- Render the social links in the desktop header and in the opened mobile panel.
- Keep the current topic navigation and utility controls intact.
- Minimize drift by sourcing social-link metadata from a single shared definition.

**Non-Goals:**
- Add an Astro-native feed route or change the RSS destination away from the legacy feed URL.
- Redesign the overall header layout or rework the search/theme interactions.
- Introduce a social profile management system or move these URLs into a new configuration layer as part of this change.

## Decisions

1. Shared social-link definition
   - Define the social entries once in the header component (or a nearby helper) and reuse them for both the desktop social cluster and the mobile panel rendering.
   - Why: desktop/mobile parity is already a known source of drift in this header area, and the implementation should avoid a second duplicated link list.
   - Alternative considered: hardcode separate social groups for desktop and mobile. Rejected because it increases maintenance cost for no behavioral gain.

2. Desktop-right, mobile-panel placement
   - Place socials on the right side of the desktop navbar near the existing utilities, and place the same icons in the mobile panel instead of the collapsed mobile top bar.
   - Why: the desktop header has room for a compact icon row, while the mobile top bar is already constrained by theme toggle and hamburger controls.
   - Alternative considered: put socials directly in the mobile top bar. Rejected because it would overcrowd the small-screen header and compete with higher-priority controls.

3. Reuse legacy URLs as-is
   - Keep the Pelican X, Facebook, Github, and RSS URLs unchanged for this change, including the external RSS feed URL.
   - Why: these values are already the site's known social destinations, and preserving them keeps this work scoped to presentation rather than infrastructure.
   - Alternative considered: pair the navbar work with an Astro feed implementation. Rejected because feed generation is a separate concern with its own scope and validation needs.

## Risks / Trade-offs

- Header crowding on desktop -> Keep socials icon-only and position them adjacent to existing utilities rather than expanding the center nav.
- Mobile panel sprawl -> Add socials as a compact grouped section in the panel so they complement, rather than replace, the current search flow.
- Legacy RSS dependency -> Accept the external feed URL for now and treat Astro-native feed support as future work if the site fully cuts over.

## Migration Plan

1. Add a shared social-link data structure with labels, hrefs, and icon references based on the Pelican config values.
2. Render the icon row in the desktop navbar and the same icons in the mobile panel while preserving current search, theme, and menu controls.
3. Verify the resulting layout at desktop and mobile breakpoints and ensure all four links point at the expected destinations.
4. Roll back by removing the social-link rendering and restoring the prior right-side utility-only layout if the header becomes too crowded.
