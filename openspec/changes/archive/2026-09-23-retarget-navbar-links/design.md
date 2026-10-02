# Design

## Context

See proposal.md for motivation. The current navbar in `astro/src/components/Header.appbar.astro` hardcodes one primary link list for desktop and a second, slightly different list for the mobile panel. The site already has working tag routes under `astro/src/pages/tags/`, so this change is primarily a navigation-target update with a small consistency concern: desktop and mobile should source the same destinations instead of drifting over time.

## Goals / Non-Goals

**Goals:**
- Retarget the primary navbar to topical tag destinations without changing the rest of the header behavior.
- Keep the `~/` home link as the first primary nav item.
- Ensure desktop and mobile menus expose the same labels and hrefs.
- Minimize implementation risk by reusing existing tag pages and current header styling.

**Non-Goals:**
- Redesign the header layout, search, theme toggle, or mobile menu behavior.
- Introduce new taxonomy pages or aggregate multiple tags behind a custom "Reviews" route.
- Rework tag normalization or create new tags in content as part of this change.

## Decisions

1. Single navigation definition
   - Define the primary nav items once and render both the desktop list and mobile panel from that shared data.
   - Why: the current duplication is the main source of drift risk, and this change already needs both nav variants updated.
   - Alternative considered: update the two hardcoded lists independently. Rejected because it preserves the exact consistency problem this change is trying to avoid.

2. Direct tag routes
   - Point the six topical links directly at existing tag routes: `/tags/coding`, `/tags/sysadmin`, `/tags/infosec`, `/tags/os`, `/tags/hardware`, and `/tags/review`.
   - Why: those routes already exist and the tag lookup is case-insensitive, so this is the smallest behavior change that matches the requested IA.
   - Alternative considered: create umbrella routes or category-based pages. Rejected because the requested behavior is explicitly tag-based, and new routes would add scope without improving the immediate goal.

3. Preserve existing header affordances
   - Keep search, theme toggle, sticky behavior, and the current mobile panel structure unchanged except for the nav labels and hrefs.
   - Why: the proposal changes information architecture, not the broader header UX. Limiting the blast radius keeps verification simple.
   - Alternative considered: fold this into a broader header cleanup. Rejected because that would mix unrelated work into a small content-navigation change.

## Risks / Trade-offs

- Desktop/mobile parity regression -> Render both nav surfaces from one shared item list and verify labels plus hrefs in both contexts.
- Tag hygiene mismatch -> Reuse only tags already present in published content and avoid introducing a new `reviews` tag or route alias.
- Reduced access to structural pages -> `About`, `Posts`, `Tags`, and `Categories` drop out of the primary nav, so readers rely more on homepage and in-page links for broader site discovery.

## Migration Plan

1. Introduce a shared navbar item list in the header component (or a nearby helper if that reads cleaner).
2. Replace the current desktop and mobile primary links with the shared topical tag links while preserving the `~/` home entry.
3. Build the Astro site and verify the rendered header still links correctly in both desktop and mobile variants.
4. Roll back by restoring the prior primary link set if the new information architecture proves less effective than expected.
