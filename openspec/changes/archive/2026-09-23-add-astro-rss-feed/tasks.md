# Tasks

## 1. Feed dependencies and configuration

- [x] 1.1 Add the Astro RSS package dependency and verify the project installs successfully with the new feed dependency.
- [x] 1.2 Configure the Astro site with the canonical URL `https://www.codeholics.com` and verify the config remains buildable.

## 2. Feed generation

- [x] 2.1 Add a feed endpoint at `astro/src/pages/rss.xml.js` and verify it emits an RSS document for published posts.
- [x] 2.2 Add or reuse helper logic for excerpt-based item descriptions and verify draft posts are excluded while published posts remain date-ordered.

## 3. Navbar integration

- [x] 3.1 Update the navbar RSS social link to point at `/rss.xml` and verify both desktop and mobile social groups use the new local feed URL.

## 4. Verification

- [x] 4.1 Run the Astro build and verify it succeeds with the new RSS endpoint.
- [x] 4.2 Verify the built output includes `/rss.xml` with absolute post links rooted at `https://www.codeholics.com`.
