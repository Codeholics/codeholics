# Design

## Context

See proposal.md - Why for the overflow measurements. Relevant current implementation:

- `Header.appbar.astro` renders a single flex row (`max-w-7xl px-6 gap-4`) with the brand, the `.desktop-nav` list, and a utility group. The list is an `inline-flex` `ul` with `space-x-4`. `~/` and `Projects` use `text-sm`; the other six links use `text-lg`, all with `px-3 py-2 font-semibold`.
- The 768px breakpoint is written in three separate places, which must stay in sync:
  - `global.css` `@media (min-width: 768px)`, which shows `.desktop-nav` and `.header-search-group` and hides `.mobile-toggle` and `.mobile-panel`;
  - the social group's `hidden md:flex` classes;
  - the resize handler's `window.innerWidth >= 768` check, which closes the drawer.
- The mobile drawer already contains every primary link, the four social links, and a search form.
- `Footer.astro` contains only the copyright line.
- Measurements from a probe at 1024px (brand `nowrap`, 16px labels, `px-2`, about 2px between links):
  - without the social group the row needs 918px, leaving 106px to spare;
  - with the social group it needs 1,086px, 62px too wide;
  - at 1280px with the social group there is 194px to spare.

## Goals / Non-Goals

**Goals:**
- No horizontal overflow and a single-line brand at every width, with a deterministic switch at 1024px and 1280px.
- One source for the breakpoint, the nav items, and the social links.
- A layout that does not depend on JavaScript: CSS alone decides what is visible.

**Non-Goals:**
- No new "More" overflow menu, priority-plus navigation, or JavaScript-measured layout.
- No change to colors, focus tokens, theme behavior, desktop-search mechanics, or drawer contents.
- The drawer will still need JavaScript to open. That was already the case below 768px; see Risks.
- No active-page indicator. `DESIGN.md` recommends one, but it is a separate enhancement.

## Decisions

### 1. Desktop breakpoint moves from 768px to 1024px (Tailwind `lg`)

The user chose this option over two alternatives:
- **Drawer below 1280px.** Simpler, but it hides inline navigation on common 1024–1279px laptops.
- **Keep inline navigation from 768px and add an overflow menu.** This needs new interactive UI and JavaScript.

At 1024px the compact row fits with 106px to spare. That covers font-rendering variance between platforms, which a fit that only just works would not.

The `@media` query in `global.css`, the social group's breakpoint class, and the resize-handler check all change together. The resize handler should use `window.matchMedia('(min-width: 1024px)')`, so it shares the same media-query semantics as the CSS instead of a hand-copied `innerWidth` comparison.

### 2. Compact, uniform inline-nav typography at every desktop width

- All eight links use one size, `text-base` (16px), with `px-2` and a small gap between items in place of `space-x-4`.
- Keep `py-2`, `font-semibold`, rounded hover and focus styles, and the existing colors. The hit area stays about 40px tall, matching the existing 36–40px icon buttons.
- The brand gets `whitespace-nowrap` and does not shrink (`shrink-0`). The nav takes the flexible middle space (`min-w-0`) so it can never push the utilities off-screen.

This also removes today's inconsistent mix of `text-lg` and `text-sm`, which `DESIGN.md` § Navigation calls for ("compact"; "avoids oversized navigation bars").

Alternative considered: fluid `clamp()` label sizes. Rejected because the label size would change continuously as the window resizes, and a fixed compact size already fits.

### 3. Social links: app-bar from 1280px, drawer below 1024px, footer always

- The app-bar social group becomes `hidden xl:flex`.
- Between 1024px and 1279px the drawer is hidden and the app-bar has no room for the social group, so the footer provides the links. The footer shows them at every width, which also matches the convention that profile links appear in a site footer.
- The social link data (label, href, icon) moves to one shared module, for example `src/lib/social-links.ts`. The header, the drawer, and the footer all import it, so the URLs are not duplicated.
- Footer links reuse the existing icon-button treatment with the theme tokens, and carry accessible names, `rel="noopener noreferrer"`, and `target="_blank"` for external profiles, matching the header.

The user approved moving social icons out of the top bar wherever they don't fit, into the menu or the footer.

### 4. Tests assert geometry at the boundaries, not pixel snapshots

New navbar tests measure the following at 320, 375, 767, 768, 1023, 1024, 1279, 1280, and 1536px on `/`, a tag page, an article, and `/projects/`:
- `document.documentElement.scrollWidth <= innerWidth`;
- brand height equals one line, and the header height does not change across widths;
- which navigation is visible, inline or hamburger;
- where the social links are visible.

A resize test opens the drawer at 1000px, resizes to 1100px, and asserts the reset. The Projects suite's overflow check returns to the whole document, so the scoping workaround added in the previous change can be removed.

## Risks / Trade-offs

- **Portrait tablets (768–1023px) lose the inline nav.** Mitigation: the drawer already contains every destination and search. This is the documented BREAKING note.
- **No-JavaScript visitors between 768px and 1023px cannot open the drawer.** This already applied below 768px. `DESIGN.md` says to keep navigation usable without JS "whenever practical", and a pure-CSS disclosure (`<details>`) would mean reworking the drawer. This change records it as a known limitation and does not fix it here; it is a candidate follow-up.
- **Font fallback or user font scaling could widen the nav at 1024px.** Mitigation: 106px to spare, and the nav is `min-w-0`, so it cannot force page overflow. The tests run at exact boundary widths in Chromium.
- **Adding a nav item later could bring the overflow back.** Mitigation: the boundary-width overflow tests fail immediately. `README.md` and `DESIGN.md` will record the space budget.
- **Footer links in a new place.** Mitigation: they reuse the existing tokens and focus treatment, and get light/dark contrast checks.

## Migration Plan

This is a static-site CSS, markup, and test change, deployed by the normal build. To roll back, revert the commit. Nothing is persisted.
