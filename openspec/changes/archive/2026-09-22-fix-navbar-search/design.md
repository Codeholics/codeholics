# Design

## Context

The project uses an Astro site with a Tailwind-based header component at `astro/src/components/Header.appbar.astro`. The mobile panel contains a working search form that should submit to `/search.html?q=`; the desktop header exposes a search button (`#search-btn`) with no wired behavior. The Astro app currently does not generate a `/search.html` page, so the fix needs both navbar wiring and an Astro search destination.

## Goals / Non-Goals

**Goals:**
- Make the desktop search control operable and keyboard accessible.
- Keep the implementation small and dependency-free (vanilla JS + Tailwind utilities).
- Preserve mobile behavior; ensure parity of submission and accessibility.

**Non-Goals:**
- Replacing the search backend or altering endpoints.
- Adding a heavy UI framework or external icon library.

## Decisions

1. Interaction model
   - Option A: Reveal an inline input next to the search icon on desktop (non-modal). Pros: simple, minimal DOM changes. Cons: may shift layout.
   - Option B: Open a small overlay/dialog anchored to the header that contains the input. Pros: avoids layout shift. Cons: slightly larger focus-management surface.
   - Chosen: Option A (inline reveal). Rationale: simplest to implement without new CSS positioning, keeps DOM minimal and matches common blog patterns.

2. Focus management
   - When the desktop search icon is activated, the input will be revealed and receive focus. Pressing Escape or closing returns focus to the search button.

3. Submission contract
   - The input will be a standard form that navigates to `/search.html?q=` on submit so server-side behavior is unchanged.

4. Search results page
   - Implement `/search.html` as a static Astro page that embeds a lightweight search index at build time and filters it client-side from the `q` query parameter. This keeps the feature dependency-free and compatible with Astro's static output mode.

5. Accessibility
   - The search button will have `aria-expanded` when revealing an inline input. The input will have `aria-label="Search"` and be in the tab order.

6. Prepaint
   - No heavy prepaint script is required for search; the design avoids theme-related flashes. If theme prepaint exists, ensure the search input styles are applied by existing CSS.

## Risks / Trade-offs

- Risk: Inline reveal could cause layout shifts on very narrow desktop widths. Mitigation: reveal with absolute positioning or use a max-width that avoids pushing center content; fall back to overlay if problematic.
- Risk: Focus management edge cases may interfere with mobile panel. Mitigation: share close/escape handlers and ensure only one active search UI exists at a time.

## Migration Plan

1. Implement inline reveal input and wiring in `Header.appbar.astro`.
2. Add small CSS rules to `astro/src/styles/global.css` for input sizing and focus-visible.
3. Test keyboard navigation and screen reader labeling.
4. Deploy to staging and run manual QA (desktop, mobile, keyboard-only, and screen reader).
5. Merge and monitor production for regressions.

## Open Questions

- Should the desktop reveal use absolute positioning to avoid any potential layout shift, or is a compact inline reveal acceptable for the site layout? (Recommend inline first; switch to absolute if QA shows issues.)
