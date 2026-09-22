# Tasks

## 1. Scaffolding & discovery

- [x] 1.1 Inspect `astro/src/components/Header.appbar.astro` and verify current search button (`#search-btn`) and mobile form exist
- [x] 1.2 Create a small inline search input element in the header (hidden by default) and verify it appears in the DOM at desktop widths when revealed

## 2. Implementation

- [x] 2.1 Wire the desktop search button to reveal the inline input and set `aria-expanded` appropriately; verify focus moves into the input when revealed
- [x] 2.2 Ensure the inline input is a proper form that submits to `/search.html?q=` and verify navigation lands on an Astro-backed results page
- [x] 2.3 Add Escape and close behavior: pressing Escape or closing returns focus to the search button; verify with keyboard

## 3. Styles and accessibility

- [x] 3.1 Add CSS for the inline input (size, spacing, focus-visible) in `astro/src/styles/global.css`; verify visuals on desktop and that it does not break layout
- [x] 3.2 Ensure the search button and input have accessible labels (`aria-label="Search"`) and tab order; verify with a keyboard-only walkthrough and a screen reader if available

## 4. QA & cross-browser

- [x] 4.1 Manual smoke tests: Chrome, Firefox (desktop) - verify reveal, focus, and submission
- [x] 4.2 Mobile parity check: confirm mobile panel search still submits to `/search.html?q=` and is unaffected by desktop changes

## 5. Deployment & monitoring

- [x] 5.1 Deploy to staging and run quick navigation flows on core pages (home, posts, about) to ensure no regressions
