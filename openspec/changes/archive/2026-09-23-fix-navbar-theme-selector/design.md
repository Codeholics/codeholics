# Design

## Context

See `proposal.md` for motivation. The Astro site currently stores a `theme` value in localStorage and toggles an `html.dark` class from the navbar component, while `Layout.astro` also applies a separate first-paint script. The global stylesheet already uses dark colors as the base state, so removing `html.dark` does not produce a true light theme. The existing Playwright coverage only confirms that one click can enable dark mode and survive a reload.

## Goals / Non-Goals

**Goals:**
- Make `light`, `dark`, and `auto` resolve to visibly distinct, predictable states.
- Keep first paint, runtime navbar behavior, and persisted preference in sync.
- Add regression coverage for the full three-state selector rather than only one dark-mode path.

**Non-Goals:**
- Redesign the navbar layout or other unrelated header controls.
- Introduce a new theming library or external dependency.
- Rework page-specific content styling beyond what is needed to make the site clearly light or dark.

## Decisions

### Use a shared three-state theme model
Represent theme preference as `light`, `dark`, or `auto` across the head bootstrapping script and navbar runtime logic.

- **Why:** The current issue comes from different parts of the app making separate assumptions about what the stored value means and how it should be applied.
- **Alternatives considered:**
  - Keep the current localStorage value and only tweak CSS: too fragile because the boot script and runtime logic would still diverge.
  - Remove `auto` and support only light/dark: simpler, but conflicts with the requested behavior and existing selector cycle.

### Make light the actual default visual baseline
Move base styling toward a real light presentation, then apply dark-mode overrides only when the resolved theme is dark.

- **Why:** A working light mode needs a distinct visual baseline; today the site is effectively dark by default.
- **Alternatives considered:**
  - Keep dark as the base and add more `html:not(.dark)` overrides: possible, but harder to reason about and easier to regress.

### Validate theme behavior through observable Playwright checks
Expand the navbar end-to-end tests to verify persisted state and visible differences for light, dark, and auto.

- **Why:** The current regression gap allowed a broken selector to pass because only the dark transition was tested.
- **Alternatives considered:**
  - Rely on unit-style DOM assertions only: insufficient because the problem is partly visual and spans boot-time plus runtime behavior.

## Risks / Trade-offs

- **First-paint flicker between boot script and hydrated navbar** -> Keep both paths on the same theme-resolution rules and storage values.
- **Insufficient light styling leaving pages hard to read** -> Update shared base tokens and validate visible contrast in both modes.
- **Fragile tests tied to exact colors** -> Prefer stable assertions about theme state plus clearly different computed styles on shared surfaces.

## Migration Plan

1. Align `Layout.astro` and the navbar script on a shared theme-resolution contract for `light`, `dark`, and `auto`.
2. Update shared styles so the default site appearance is meaningfully light while `html.dark` applies the dark palette.
3. Expand Playwright coverage to exercise mode cycling, persistence, and visible differences across reloads.
