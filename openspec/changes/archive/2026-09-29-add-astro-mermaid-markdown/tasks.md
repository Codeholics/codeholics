# Tasks

## 1. Configure build-time Mermaid rendering

- [x] 1.1 Add `rehype-mermaid` and `playwright` to the Astro project dependencies, then verify `npm install` completes successfully in `astro/`.
- [x] 1.2 Register Mermaid rendering before Pretty Code in the Astro Markdown processor and preserve the `mermaid` fence language, then verify `npm run build` succeeds.

## 2. Prepare Markdown content

- [x] 2.1 Convert affected Astro post headers to YAML frontmatter that satisfies the posts collection schema, then verify the content-sync step reports no schema errors.
- [x] 2.2 Add a valid Mermaid fence to an Astro post intended for publication, then verify its generated page contains an inline SVG rather than Mermaid source text.

## 3. Document and verify the build environment

- [x] 3.1 Update the Astro README with the Playwright Chromium installation prerequisite and Mermaid authoring syntax, then verify the documented commands run as written.
- [x] 3.2 Run `npx playwright install chromium` followed by `npm run build` in `astro/`, then verify the build completes and output is generated.