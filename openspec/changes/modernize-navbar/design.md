# Design

## Context

See proposal.md for motivation. The current Header.astro uses a centered nav with Tailwind utilities and a simple mobile panel. This design refines structure, accessibility, and behavior to an "App-bar" pattern with iconography, a theme toggle, and a hamburger that animates to an X.

## Goals / Non-Goals

**Goals:**
- Deliver a modern app-bar with clear hierarchy and minimal layout shift
- Maintain or improve accessibility (keyboard, screen readers)
- Keep JS minimal and performant (small module for toggle and theme)
- Preserve existing visual identity (brand/logo) and Tailwind-based styling

**Non-Goals:**
- Introduce a new UI framework or icon dependency (avoid adding large packages)
- Change backend APIs or content structure

## Decisions

1. Layout and breakpoints
   - Use mobile-first layout with a breakpoint at 768px (matches existing md breakpoint). Desktop shows inline primary nav; mobile hides nav behind hamburger.
   - Center area on desktop will show icons + short labels; prefer icon-left label-right arrangement for clarity.

2. Sticky vs Static
   - Default: sticky header with slight backdrop blur and elevation on scroll. Make stickiness toggleable with a CSS class `.sticky` on the header so it can be opted into during implementation or removed later. Sticky improves accessibility for long pages.

3. Theme persistence
   - Use `prefers-color-scheme` for initial render. If user toggles theme, persist selection to localStorage. On load, apply logic: if localStorage has explicit preference, apply it; else follow system preference.

4. Icons
   - Use optimized inline SVGs (no external dependency). Create a small icons/ folder or inline them in the component for the few needed icons (hamburger/X, search, sun/moon).

5. JS approach
   - Vanilla JS module (ESM) that handles:
     - Toggling mobile menu and updating `aria-expanded`
     - Transforming hamburger icon (add/remove `is-open` class)
     - Theme toggle logic + writing to localStorage and updating `data-theme` or `class` on `<html>`
   - Keep bundle size < 1KB gzipped by avoiding frameworks and using small utility functions.

6. Accessibility
   - Hamburger is a `<button aria-controls="nav-panel" aria-expanded="false">`.
   - Mobile panel traps focus when open, or at minimum returns focus to the hamburger when closed. Prefer minimal focus trap implementation to avoid adding a dependency.
   - Ensure focus-visible styles are present and prominent.

## Risks / Trade-offs

- Risk: Edge-case focus trapping and keyboard escape handling can introduce regressions; mitigate by testing with keyboard-only navigation and screen readers.
- Risk: Theme flash on first paint if JS applies theme after render. Mitigation: include a small inline script in Layout.astro that applies stored preference before CSS paints (very small snippet).
- Trade-off: Inline SVGs increase HTML size slightly, but avoid runtime network hits and external deps.

## Migration Plan

1. Create new component `Header.appbar.astro` alongside existing Header.astro and wire it into Layout.astro behind a feature flag (CSS class on body or temporary build flag).
2. Deploy to staging and smoke test navigation, keyboard flows, and theme persistence on major browsers and mobile.
3. If staging looks good, replace `Header.astro` import in Layout.astro and remove old header after a short monitoring window.
4. Rollback: revert Layout.astro to import the previous Header.astro; no backend changes required.

## Open Questions

- Preferred default for sticky header? (Enabled by default in this design; can be toggled if desired.)
- Should the site use icons-only on very small viewports, or keep label+icon in the desktop nav?

