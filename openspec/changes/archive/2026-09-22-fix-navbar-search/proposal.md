# Proposal

## Why

The header's search affordance in the navbar is non-functional for desktop users: the search icon button does nothing, which prevents quick site searches and hurts discoverability. Fixing this restores an expected navigation utility and reduces friction for readers and contributors.

## What Changes

- Repair the navbar search interaction so the desktop search control focuses or opens an inline search input and submits queries consistently with the existing search endpoint.
- Ensure parity between desktop and mobile behaviors (mobile panel already contains an inline search form).
- Improve the search control's accessibility (aria-labels, keyboard focus, and visible focus state).
- Add an Astro-backed `/search.html` page so the desktop and mobile search forms have a real in-app destination.

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `ui/site-navigation`: Clarify and require an operable desktop search control. Update requirements to include the desktop search button behavior, focus handling, and submission contract (uses the existing `/search.html` endpoint with query parameter `q`).

## Impact

- Files affected (likely):
  - `astro/src/components/Header.appbar.astro` — add or fix JS to wire the desktop search button to a visible/focusable input or to open a small inline search UI; ensure the control submits to `/search.html?q=`.
  - `astro/src/pages/search.html.astro` — add a searchable Astro results page that reads `q` and renders matching posts.
  - `astro/src/layouts/Layout.astro` — small prepaint or DOM placement adjustments if needed to avoid flashes when injecting a search input.
  - `astro/src/styles/global.css` — minor styles for inline search input and focus-visible rules.

This is a UI-only change with no backend API changes; it reuses the existing `/search.html` endpoint and content index.
