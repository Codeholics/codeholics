# Design

## Context

See `proposal.md` for motivation.  
The Astro app currently has no explicit markdown highlighting configuration in `astro/astro.config.mjs`, so code rendering behavior depends on framework defaults. Existing content includes many fenced blocks with legacy labels (for example `Python` and `HTML`) and unlabeled blocks, which leads to inconsistent highlighting coverage.  
The site already enforces dark-mode readability expectations (`openspec/specs/ui/dark-mode-readability/spec.md`), so any highlighting upgrade must preserve contrast and readability in both themes.

## Goals / Non-Goals

**Goals:**
- Make fenced-code highlighting deterministic across markdown and MDX posts.
- Support legacy fence language labels through explicit alias normalization instead of mass editing old content.
- Introduce enhanced code-block UX (line emphasis and copy affordance) with dark-mode-safe styling.
- Keep build behavior predictable and fail-safe for unsupported language labels.

**Non-Goals:**
- Rewriting historic post content files to standardize all fence tags.
- Replacing Astro as the markdown rendering platform.
- Redesigning general article typography outside code-related surfaces.

## Decisions

1. **Use explicit Shiki-based markdown configuration in Astro**
   - **Decision:** Configure highlighting directly in `astro.config.mjs` using Astro’s markdown configuration and explicit theme/language behavior.
   - **Why:** Removes ambiguity from implicit defaults and provides a single project-owned control point.
   - **Alternatives considered:**
     - Keep defaults and patch CSS only: rejected because language support gaps remain.
     - Switch to a non-Shiki stack entirely: rejected because Astro already integrates well with Shiki and existing markdown/MDX rendering.

2. **Normalize legacy fence labels through an alias map**
   - **Decision:** Add a preprocessing step (remark/rehype level) that maps configured legacy labels (for example `Python` -> `python`, `HTML` -> `html`) before highlighting runs.
   - **Why:** Preserves backward compatibility with existing posts and avoids risky bulk content edits.
   - **Alternatives considered:**
     - Bulk edit all post files: rejected due to scope, risk, and ongoing maintenance burden.
     - Ignore unsupported labels: rejected because it preserves inconsistent reader experience.

3. **Adopt a code-block presentation layer compatible with Astro markdown output**
   - **Decision:** Add a presentation plugin/pipeline layer that supports line emphasis metadata and copy-to-clipboard affordances, while inheriting site theme behavior.
   - **Why:** Delivers requested UX improvements without custom one-off component rewrites for every code block.
   - **Alternatives considered:**
     - Build all features as hand-rolled post-render JavaScript: rejected due to complexity and long-term maintenance.
     - Keep plain highlighted blocks only: rejected because it does not meet UX goals.

4. **Treat unknown languages with readable fallback, not hard failure**
   - **Decision:** Unknown fence labels render as readable code blocks and can optionally emit build-time diagnostics/logging.
   - **Why:** Prevents content breakage and preserves publishability while still surfacing quality issues.
   - **Alternatives considered:**
     - Fail the build on first unknown label: rejected as too disruptive for legacy content.
     - Silently swallow unknown labels: rejected because quality regressions become hard to detect.

## Risks / Trade-offs

- **[Plugin compatibility drift]** New markdown plugins may evolve with Astro/Shiki versions -> **Mitigation:** Pin compatible versions, validate during dependency updates, and keep configuration centralized.
- **[Theme contrast regressions]** Added token/control styles may reduce dark-mode readability -> **Mitigation:** Keep code-surface tokens tied to existing dark-mode variables and verify contrast-focused scenarios from `ui/dark-mode-readability`.
- **[Alias-map sprawl]** Alias list may grow ad hoc over time -> **Mitigation:** Document canonical language ids and keep alias mappings explicit and reviewable.
- **[Unknown language ambiguity]** Fallback rendering may hide missing language support -> **Mitigation:** Emit optional diagnostics and track recurring unknown labels for follow-up config updates.

## Migration Plan

1. Add/adjust markdown highlighting dependencies in `astro/package.json`.
2. Configure explicit markdown highlighting and alias normalization in `astro/astro.config.mjs`.
3. Add styling and minimal client behavior for code-block presentation in `astro/src/styles/global.css` and related rendering surfaces.
4. Build the Astro site and verify representative posts with legacy aliases and dark-mode code readability.
5. Rollback strategy: revert the highlighting configuration and dependency additions in one change set; legacy content remains intact because no mass edits are required.

## Open Questions

- Should unknown language labels emit warnings only in CI/build output, or also surface in local dev output by default?
