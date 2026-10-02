# Tasks

## 1. Finalize migration post for publication

- [x] 1.1 Remove draft publication state in `astro/src/content/posts/migrating-codeholics-from-pelican-to-astro.md` and verify the file no longer contains `status: "draft"` (or any equivalent draft marker).
- [x] 1.2 Apply editorial publish cleanup in the migration post (remove draft note and update draft-oriented summary/closing language) and verify no reader-facing draft disclaimer remains.

## 2. Align RSS verification with published state

- [x] 2.1 Update `astro/tests/rss.spec.ts` so the migration post slug is expected in RSS output after publication and verify the test assertions explicitly check inclusion of `migrating-codeholics-from-pelican-to-astro`.
- [x] 2.2 Run targeted RSS verification (existing RSS test command) and verify the RSS test suite passes with the published migration post included.

## 3. Validate site publication output

- [x] 3.1 Run the Astro build for the site and verify it succeeds with no publish-related content/schema failures.
- [x] 3.2 Verify the generated post page and `/rss.xml` contain the migration entry in preview/dev output, confirming the post is visible to readers.
