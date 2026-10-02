# Design

## Context

See `proposal.md` for motivation and `specs/ui/site-navigation/spec.md` for the added behavior. The Astro header currently uses dark-oriented utility classes directly in `astro/src/components/Header.appbar.astro`, including `text-white`, `text-slate-200`, white hover states, and white-translucent backgrounds. That works for dark mode, but in light mode the header surface becomes light enough that the same foreground treatments lose contrast. The rest of the Astro site already uses semantic CSS variables and helper classes from `astro/src/styles/global.css`, so the app bar is the main holdout.

## Goals / Non-Goals

**Goals:**
- Make the light-mode app bar readable without changing its overall structure or turning it into a dark header.
- Give the header its own semantic light-mode tokens for brand text, link text, icons, hover states, focus states, and search controls.
- Keep existing dark-mode header behavior intact.

**Non-Goals:**
- Redesigning the site navigation layout or destinations.
- Changing theme-toggle logic or the resolved light/dark/auto behavior.
- Reworking the mobile flyout panel unless a top-bar contrast fix requires a small shared token change.

## Decisions

### Add header-specific theme roles instead of reusing dark-only utility classes

Move the readable/light-mode header treatment into semantic header classes or CSS variables rather than continuing to hard-code `text-white` and `text-slate-200` in the component. This keeps the header aligned with the rest of the Astro theme system and makes the light-mode palette intentional instead of accidental.

**Alternatives considered:**
- Darken the entire light-mode header background until white text works. Rejected because it collapses the distinction between light and dark mode and fights the current light glass aesthetic.
- Leave the header markup alone and patch everything with global overrides. Rejected because the component already encodes the wrong semantic intent and would remain fragile.

### Keep the header surface light in light mode

Treat the solution as a contrast fix, not a mode inversion. The light header should remain a light glass-like surface, with dark slate text and subtle hover backgrounds layered on top.

**Alternatives considered:**
- Make the navbar permanently dark in all modes. Rejected because it would create an unnecessary visual split with the rest of the light-mode UI.

### Include search and utility controls in the same contrast pass

The readability problem is not limited to the center navigation links. The brand, social icons, theme toggle, search button, search input, and submit button should all share the same light-mode contrast model so the header feels coherent.

**Alternatives considered:**
- Fix only the central nav links. Rejected because the remaining white-on-light controls would still look broken and inconsistent.

## Risks / Trade-offs

- **Header-specific classes may overlap with existing utility classes in the component** -> Mitigation: replace the dark-only utility classes at the component level instead of layering more overrides on top.
- **Search overlay styling may diverge from the top bar if only text colors change** -> Mitigation: define search trigger/input/button tokens together with the rest of the header roles.
- **Light-mode improvements could accidentally weaken dark-mode contrast** -> Mitigation: keep dark-mode values explicit and validate both light and dark resolved themes after the header update.

## Migration Plan

1. Add semantic light/dark header tokens and helper classes in `astro/src/styles/global.css`.
2. Replace dark-only foreground/background utilities in `astro/src/components/Header.appbar.astro` with the new header-specific classes.
3. Validate the header in light mode for desktop navigation, header utilities, and search, then re-check dark mode to ensure no regression.
