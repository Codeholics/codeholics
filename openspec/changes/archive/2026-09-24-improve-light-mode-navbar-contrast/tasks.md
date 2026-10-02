# Tasks

## 1. Add semantic header contrast tokens

- [x] 1.1 Add header-specific light/dark theme roles in `astro/src/styles/global.css` for app-bar text, icons, hover surfaces, focus states, and search controls, and verify the Astro build succeeds
- [x] 1.2 Define light-mode search/input/button/header interaction styles using those roles and verify the header search UI remains readable when opened in light mode

## 2. Apply the new header styles

- [x] 2.1 Replace the hard-coded light-mode-unfriendly navbar foreground classes in `astro/src/components/Header.appbar.astro` with semantic header classes and verify the desktop brand, primary nav, social icons, and theme toggle are readable in light mode
- [x] 2.2 Update the top-bar search trigger, search form, and mobile top-bar controls to use the shared header contrast styles and verify they remain readable in light mode without changing the existing layout behavior

## 3. Validate header readability

- [x] 3.1 Build the Astro site and verify it completes without runtime or styling errors after the header updates
- [x] 3.2 Review the app bar in both light and dark resolved themes and verify the light-mode header keeps a light surface while preserving readable text, icons, hover states, and search controls
