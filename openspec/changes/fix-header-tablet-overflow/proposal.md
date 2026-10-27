# Proposal

## Why

The shared app-bar overflows horizontally between 768px and 1279px on every page, including the homepage, Projects, and tag pages. The inline nav switches on at 768px. From there up to about 1222px the page scrolls sideways (`scrollWidth` stays at 1222px), and the `# Codeholics` brand wraps onto two lines, so the header grows from 61px to 89px. The cause is the content of the header row, which needs about 1,222–1,267px:
- the brand, about 145px;
- eight inline links that cannot shrink, about 790px (18px labels with 12px padding and 16px spacing);
- six utility icons, about 252px;
- gaps and padding.

Tablets and small laptops get a broken first impression on every page.

## What Changes

- Move the switch from the menu drawer to inline navigation from 768px to the Tailwind `lg` breakpoint, 1024px. Below 1024px, tablets use the existing hamburger and drawer, which already contain every destination, the social links, and search.
- Make the inline navigation compact at all desktop widths:
  - all eight labels use one consistent size, replacing today's mix of `text-lg` and `text-sm`;
  - horizontal padding and spacing are tightened;
  - the brand never wraps;
  - the header row never exceeds the viewport width.
- Show the social icon group in the app-bar only from 1280px up, where it fits.
- Add the same four social links (X, Facebook, GitHub, RSS) to the site footer on every page. This keeps them reachable between 1024px and 1279px, where they are not in the app-bar and the drawer is hidden.
- Keep the desktop search, theme toggle, theme colors, focus treatment, and light/dark behavior unchanged.
- Tighten the Projects page horizontal-overflow test so it checks the whole document again instead of only the page content, now that the header no longer overflows.
- Bring the `ui/site-navigation` requirement up to date with the shipped header:
  - `# Codeholics` is the brand home link;
  - the primary links include `~/` and `Projects`;
  - the desktop/mobile breakpoint is 1024px.

**BREAKING:** Viewports from 768px to 1023px, including portrait iPads, now get the hamburger menu instead of inline navigation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/site-navigation`:
  - the app-bar inventory and breakpoint are updated;
  - new requirements: the header must never cause horizontal page overflow and the brand must stay on one line;
  - social links must stay reachable at every width, using the footer when the app-bar has no room;
  - the mobile menu, desktop search, and light-mode readability scenarios move from the 768px boundary to 1024px.

## Impact

- `astro/src/components/Header.appbar.astro`:
  - the classes for the inline links and the brand;
  - the breakpoint on the social group;
  - the width in the resize handler that resets the drawer, currently 768.
- `astro/src/styles/global.css`: the `@media (min-width: 768px)` block that controls `.desktop-nav`, `.header-search-group`, `.mobile-toggle`, and `.mobile-panel`.
- `astro/src/components/Footer.astro`: the new social link row. The link list should be shared with the header rather than copied.
- `astro/tests/navbar.spec.ts`: new tests at the 767, 768, 1023, 1024, 1279, and 1280px boundaries on several page types. Existing tests at 375px and 1280px keep passing.
- `astro/tests/github-projects.spec.ts`: the overflow check goes back to the whole document.
- `astro/README.md` and `DESIGN.md` Navigation notes: document the 1024px and 1280px breakpoints.
- No new dependencies and no new client-side JavaScript beyond changing the width value in the existing resize handler.
