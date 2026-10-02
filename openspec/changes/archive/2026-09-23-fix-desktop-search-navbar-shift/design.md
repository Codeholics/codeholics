# Design

## Context

See `proposal.md` for motivation. The Astro app-bar currently renders the desktop search trigger and desktop search form inside the same right-side flex row as the social links and theme toggle. Toggling the form from hidden to visible increases that row's width and causes the centered desktop navigation to shift. The current JavaScript already manages `aria-expanded`, focus transfer into the search input, Escape-to-close, and click-outside dismissal.

## Goals / Non-Goals

**Goals:**
- Keep the desktop app-bar visually stable while opening and closing search.
- Preserve the existing search entry point and route to `/search.html`.
- Preserve current keyboard and dismissal behavior for desktop search.

**Non-Goals:**
- Rework the mobile navigation or mobile search layout.
- Change search indexing, search result behavior, or the dedicated search page.
- Redesign the header's information architecture beyond the desktop search presentation.

## Decisions

### Render desktop search as an anchored overlay
Make the desktop search form an overlay/dropdown anchored to the search trigger instead of an inline element that participates in the header flex layout.

- **Why:** The overlay approach fixes the layout shift directly by removing search expansion from normal flow while preserving the compact icon trigger the user selected.
- **Alternatives considered:**
  - Reserve fixed inline space for search at all times: avoids shift but permanently reduces room for nav links and utility controls.
  - Make desktop search always visible: simpler, but changes the compact header presentation more than necessary.

### Keep the existing interaction contract
Reuse the current `aria-expanded`, focus management, Escape handling, and outside-click close behavior for the desktop search control.

- **Why:** Those behaviors already align with the navigation spec and reduce implementation risk.
- **Alternatives considered:**
  - Replace the interaction with a modal or full-width drawer: solves layout shift, but introduces heavier UI and broader behavior changes.

### Scope desktop-only layout changes to the header component
Constrain the change to the header markup, positioning classes, and supporting global styles needed for the overlay.

- **Why:** The bug is localized to the desktop header layout and does not require changes to search data, page routing, or mobile search behavior.
- **Alternatives considered:**
  - Refactor shared search logic across desktop and mobile: adds churn without solving an observed user problem.

## Risks / Trade-offs

- **Overlay clipping or stacking issues** -> Ensure the search overlay is positioned within the header with an appropriate stacking context and viewport-safe width.
- **Outside-click or Escape regressions** -> Preserve the existing event flow and test the open/close paths with keyboard and pointer input.
- **Desktop-only styling leaks into mobile** -> Gate overlay positioning and visibility rules behind the existing desktop breakpoint.

## Migration Plan

1. Update the desktop header structure so the search trigger owns an anchored overlay container.
2. Adjust desktop-only styles so the form is absolutely positioned and does not affect flex layout sizing.
3. Verify desktop open/close behavior, keyboard focus, and mobile navigation/search behavior remain unchanged.
