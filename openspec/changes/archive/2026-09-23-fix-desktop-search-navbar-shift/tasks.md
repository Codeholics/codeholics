# Tasks

## 1. Restructure the desktop search container

- [x] 1.1 Update `astro/src/components/Header.appbar.astro` so the desktop search trigger owns an anchored desktop-only overlay container, and verify the search form no longer participates in the right-side utility row layout.
- [x] 1.2 Preserve the desktop search interaction contract (`aria-expanded`, focus transfer, Escape close, outside-click close, `/search.html` submission), and verify those behaviors still work from the desktop app-bar.

## 2. Apply desktop-only overlay styling

- [x] 2.1 Update `astro/src/styles/global.css` so the desktop search form is positioned as an overlay/dropdown at `min-width: 768px`, and verify opening search does not move the brand, primary nav, or utility controls.
- [x] 2.2 Keep mobile search behavior unchanged while introducing the desktop overlay rules, and verify the mobile menu and mobile search still open and submit as before.

## 3. Add regression coverage and validate behavior

- [x] 3.1 Update `astro/tests/navbar.spec.ts` to cover the no-shift desktop search behavior and verify the test fails before the fix and passes after it.
- [x] 3.2 Keep the existing desktop search accessibility assertions in Playwright, and verify keyboard open/close behavior and `/search.html` submission still pass in `astro/tests/navbar.spec.ts`.
- [x] 3.3 Run `cd astro && npm run build && npm run test:e2e` and verify the Astro site builds successfully and the navbar Playwright coverage passes.
