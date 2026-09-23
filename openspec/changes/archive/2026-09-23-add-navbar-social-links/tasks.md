# Tasks

## 1. Social link data and rendering

- [x] 1.1 Define a shared social-link data list in `astro/src/components/Header.appbar.astro` and verify both desktop and mobile social rendering consume the same source.
- [x] 1.2 Add icon links for X, Facebook, Github, and RSS on the desktop navbar right side and verify they target `https://twitter.com/root_codeholics`, `https://www.facebook.com/RootCodeholics`, `https://www.github.com/Codeholics`, and `https://www.codeholics.com/feeds/all.atom.xml`.

## 2. Mobile panel integration

- [x] 2.1 Add the same social icons to the mobile navigation panel and verify all four links remain available after opening the hamburger menu.
- [x] 2.2 Preserve the existing topic links, search form, theme toggle, and hamburger behavior while adding socials, and verify the panel still behaves correctly on small screens.

## 3. Verification

- [x] 3.1 Run the Astro build and verify it succeeds after the social-link addition.
- [x] 3.2 Manually verify the desktop header and mobile panel show the expected social icons and that each icon opens the intended destination.
