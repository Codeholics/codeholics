# Design

## Context

Astro Markdown highlighting is handled by `rehype-pretty-code` while Astro's built-in syntax highlighter is disabled. Post code-fence labels pass through a custom normalization plugin before rehype processing. Mermaid rendering runs at build time and requires a Playwright browser binary in addition to the npm package dependency.

## Goals / Non-Goals

**Goals:**
- Render Mermaid post diagrams as static inline SVG without client-side diagram initialization.
- Preserve the existing Pretty Code highlighting behavior for non-Mermaid code fences.
- Make browser provisioning an explicit prerequisite for reproducible local and CI builds.

**Non-Goals:**
- Add client-side Mermaid editing, interaction, or runtime rendering.
- Change the site's code-block themes or syntax-highlighting behavior.
- Convert unrelated legacy content files outside the Astro post collection.

## Decisions

### Render Mermaid before code highlighting
- **Decision:** Run the Mermaid rehype plugin before `rehype-pretty-code`.
- **Rationale:** The diagram renderer replaces a Mermaid code block with SVG before the highlighter can treat it as source code.
- **Alternative considered:** Excluding Mermaid in a highlighter configuration. Astro's built-in highlighter is already disabled, and ordering the existing rehype pipeline is more direct.

### Preserve Mermaid in language normalization
- **Decision:** Add `mermaid` to the custom allow-list of code-fence languages.
- **Rationale:** Unknown labels are normalized to `text`; allowing Mermaid prevents the renderer from losing its input signal.
- **Alternative considered:** Bypassing normalization for all unknown labels. That would weaken the established fallback behavior for unsupported code fences.

### Use build-time inline SVG output
- **Decision:** Use the Mermaid renderer's default inline SVG strategy.
- **Rationale:** Generated pages remain static and diagram output is available without JavaScript at runtime.
- **Alternative considered:** Client-side rendering. It increases page runtime work and leaves raw diagram content visible until scripts load.

### Treat browser installation as a build prerequisite
- **Decision:** Install Chromium with Playwright before running builds that can render Mermaid.
- **Rationale:** Installing the npm package alone does not guarantee a browser binary is present in a clean environment.
- **Alternative considered:** Rely on developer-local browser caches. This is not reproducible for CI or other contributors.

## Risks / Trade-offs

- [The browser is absent in a clean environment] -> Document the Chromium-install prerequisite for Astro builds and include it in any future Astro CI workflow.
- [A malformed Mermaid block fails the build] -> Validate diagrams through `npm run build` before deployment.
- [Inline SVG increases generated HTML size] -> Keep diagrams in relevant technical posts and prefer concise diagrams.

## Migration Plan

1. Add the Mermaid renderer and Playwright dependencies.
2. Configure Mermaid before Pretty Code and preserve `mermaid` fence labels.
3. Convert affected Astro post metadata to YAML frontmatter required by the collection schema.
4. Install Playwright Chromium in local build environments and document the prerequisite for future Astro CI.
5. Build the site and confirm Mermaid post output contains SVG.

## Rollback Plan

Remove the Mermaid rehype plugin and its dependencies, remove the `mermaid` language allow-list entry, and replace Mermaid fences with ordinary code blocks or static images.