# Tasks

## 1. Shared navigation data and the 1024px desktop breakpoint

- [ ] 1.1 Move the four social links (label, href, icon) into one shared module, for example `astro/src/lib/social-links.ts`. Import it in `Header.appbar.astro` for both the app-bar group and the drawer group. Verify: `npm run build` passes, and `rg "root_codeholics|RootCodeholics" astro/src` finds the URLs only in the shared module.
- [ ] 1.2 Change the desktop breakpoint from 768px to 1024px in all three places:
  - the `global.css` `@media` block that shows `.desktop-nav` and `.header-search-group` and hides `.mobile-toggle` and `.mobile-panel`;
  - the app-bar social group's breakpoint class;
  - the drawer reset in the header resize handler, using `matchMedia('(min-width: 1024px)')`.

  Verify: `rg "768" astro/src/components/Header.appbar.astro astro/src/styles/global.css` finds no remaining header breakpoint. Manually, at 1023px the hamburger is shown, and at 1024px the inline nav is shown.
- [ ] 1.3 Add navbar tests for the breakpoints:
  - At 767, 768, and 1023px the hamburger is visible, the inline nav is hidden, and the drawer contains all eight destinations (`/`, the six tag pages, `/projects/`).
  - At 1024, 1279, and 1280px the inline nav is visible and the hamburger is hidden.
  - Opening the drawer at 1000px and resizing to 1100px hides the panel and sets `aria-expanded="false"`.

  Update the existing "Desktop navigation visible" test so it also asserts the `Projects` link. Verify: `npm run test:e2e -- tests/navbar.spec.ts` passes.

## 2. Compact inline navigation and single-line brand

- [ ] 2.1 In `Header.appbar.astro`:
  - give all eight inline links one size (`text-base`), set `px-2`, and replace `space-x-4` with a small gap;
  - keep `py-2`, `font-semibold`, and the existing hover and focus classes;
  - make the brand `whitespace-nowrap` and non-shrinking;
  - let the nav shrink in the flexible middle space (`min-w-0`).

  Verify: at 1024px on `/`, the header row is no wider than the viewport, the header height matches the 1280px height, and every inline link has the same computed font size.
- [ ] 2.2 Add tests for overflow and header height. At 320, 375, 767, 768, 1023, 1024, 1279, 1280, and 1536px on `/`, a tag page (`/tags/coding/`), an article page, and `/projects/`, assert:
  - `document.documentElement.scrollWidth <= window.innerWidth`;
  - the brand's height equals one line of its computed line height;
  - every visible header control lies within the viewport.

  Also assert the header height is identical at 1024, 1279, and 1280px, and that inline links are at least as tall as the theme toggle. Verify: `npm run test:e2e -- tests/navbar.spec.ts` passes.
- [ ] 2.3 Light-mode readability at the new desktop width. Run the existing light-mode app-bar contrast and desktop-search tests at 1024px in addition to 1280px, and confirm the search popover stays inside the viewport at 1024px. Verify: `npm run test:e2e -- tests/navbar.spec.ts` passes.

## 3. Social links at every width

- [ ] 3.1 Set the app-bar social group to show only from 1280px. Add a social link row to `Footer.astro`:
  - it uses the shared module from task 1.1, the existing icon-button treatment, and the theme tokens;
  - each link has an accessible name, `rel="noopener noreferrer"` and `target="_blank"` for external profiles, and a visible focus ring.

  Verify: `npm run build` passes, and the footer renders the four links on `/`.
- [ ] 3.2 Add tests for where the social links appear:
  - at 1280px and 1536px the app-bar social links are visible;
  - at 1024px and 1279px the app-bar group is hidden and the footer links are visible;
  - below 1024px the links are in the drawer once it is opened, and in the footer;
  - footer icons and focus rings meet 3:1 non-text contrast in both light and dark mode.

  Verify: `npm run test:e2e -- tests/navbar.spec.ts` passes.

## 4. Cross-page regression, docs, and review

- [ ] 4.1 In `astro/tests/github-projects.spec.ts`, put back the whole-document horizontal-overflow assertion, removing the hero check that was scoped to `main` along with its comment about the header. Verify: `npm run test:e2e -- tests/github-projects.spec.ts tests/navbar.spec.ts` passes.
- [ ] 4.2 Update the `astro/README.md` header/navigation notes and the `DESIGN.md` Navigation section:
  - the menu drawer is used below 1024px;
  - the compact inline nav is used from 1024px;
  - the app-bar social links appear from 1280px;
  - the footer social links appear at every width;
  - the brand never wraps;
  - adding a nav item requires re-running the boundary overflow tests.

  Verify: both documents name the 1024px and 1280px breakpoints.
- [ ] 4.3 Take light and dark screenshots of `/`, `/projects/`, and one article at 768, 1023, 1024, 1279, and 1280px. Review them against `DESIGN.md`: compact navigation, no wrapped brand, no sideways scroll, consistent header height, and footer links legible. Then run `npm run build` and the full `npm run test:e2e`. Verify: the build and the full e2e suite pass, and the screenshot review finds no layout or contrast defects.

## Workflow follow-up

- After deployment verification, archive with `/opsx-archive fix-header-tablet-overflow`.
- Candidate follow-up change: make the menu drawer work without JavaScript, for example with a `<details>`-based disclosure (see design.md Risks).
