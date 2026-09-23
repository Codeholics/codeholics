# Tasks

## 1. Unify theme state and first-paint behavior

- [x] 1.1 Update `astro/src/layouts/Layout.astro` and the navbar theme script so `light`, `dark`, and `auto` use the same persisted values and first-paint resolution rules, and verify reloads preserve the selected mode.
- [x] 1.2 Update the navbar theme control in `astro/src/components/Header.appbar.astro` so its icon/state reflect the resolved three-state selector behavior, and verify clicking the control cycles through dark, light, and auto as designed.

## 2. Restore visibly distinct light and dark presentation

- [x] 2.1 Update `astro/src/styles/global.css` so the default site styling is a true light theme and `html.dark` applies the dark palette, and verify the page appearance is visibly different between light and dark modes.
- [x] 2.2 Keep the rest of the navbar interactions intact while adjusting theme styling, and verify search, mobile menu, and focus behavior still work after the theme changes.

## 3. Add regression coverage and validate the selector

- [x] 3.1 Expand `astro/tests/navbar.spec.ts` to verify persisted theme state across dark, light, and auto selections, and verify the new Playwright assertions fail before the fix and pass after it.
- [x] 3.2 Add observable theme assertions in Playwright for a visibly distinct light mode and auto-mode resolution, and verify the test coverage checks more than the presence or absence of `html.dark`.
- [x] 3.3 Run `cd astro && npm run build && npm run test:e2e` and verify the Astro build succeeds and the navbar theme selector coverage passes.
