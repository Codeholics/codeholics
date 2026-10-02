# Design

## Context

See `proposal.md` for motivation. Current repository behavior is split: root docs and GitHub workflows still define Pelican as the primary build/deploy path, while Astro contains active production-facing site features and content workflows. Existing deployment automation checks out Pelican plugins and deploys from `output/*`, which conflicts with the desired Astro-only operating model.

## Goals / Non-Goals

**Goals:**
- Establish an Astro-only production build and deploy pipeline.
- Remove Pelican runtime/configuration/dependency surfaces after a deterministic migration parity check.
- Ensure documentation and operational guidance match the Astro-only production model.
- Adopt break-and-reindex explicitly, so URL-compatibility work is not an implicit expectation.

**Non-Goals:**
- Preserving legacy Pelican URL compatibility via redirect/rewrite maps.
- Continuing dual-stack (Pelican + Astro) operation after cutover.
- Expanding scope to redesign Astro information architecture beyond cutover needs.

## Decisions

### Decision: Enforce a migration parity gate before destructive removals
- **Choice:** Require a reproducible check that all legacy Pelican post entries map to Astro post entries before deleting Pelican surfaces.
- **Why:** Hard-removal without a gate risks silent content loss.
- **Alternatives considered:**
  - **Manual confidence-based deletion:** Rejected due to high risk and low repeatability.
  - **Long dual-stack overlap:** Rejected because user explicitly requested hard removal.

### Decision: Convert CI/deploy to Astro-only in the same cutover change
- **Choice:** Remove Pelican build/deploy steps and replace with Astro build/deploy steps atomically.
- **Why:** Split pipelines produce unclear production truth and allow accidental regressions to legacy paths.
- **Alternatives considered:**
  - **Stage docs first, CI later:** Rejected because behavior and documentation would diverge.
  - **Leave Pelican fallbacks in workflow:** Rejected to avoid hidden continued dependency on retired stack.

### Decision: Adopt break-and-reindex policy
- **Choice:** Do not require legacy URL compatibility artifacts in cutover acceptance.
- **Why:** User selected break-and-reindex explicitly, which reduces migration complexity and avoids redirect maintenance overhead.
- **Alternatives considered:**
  - **Full redirect preservation:** Rejected by policy decision.
  - **Partial redirect preservation for top pages:** Rejected by policy decision.

## Risks / Trade-offs

- **[Hidden Pelican dependency remains in automation]** -> Mitigation: perform explicit grep-based and workflow-level checks for Pelican commands/paths after edits.
- **[Content parity false-positive due to filename-only matching]** -> Mitigation: define parity checks using normalized post identity rules (including `.md` vs `.mdx`) and manual spot review for mismatches.
- **[Operational confusion immediately after URL break]** -> Mitigation: update deployment docs/checklists to include reindex expectations and post-cutover validation steps.
- **[Rollback complexity after file deletions]** -> Mitigation: keep cutover in a single change/PR so rollback is a clean Git revert.

## Migration Plan

1. Implement migration parity check and run it against current Pelican/Astro post sets.
2. Update CI and deployment workflows to Astro-only build/deploy commands and artifact paths.
3. Update root/project operational docs to declare Astro as sole production stack and document break-and-reindex.
4. Remove Pelican-specific runtime/config/dependency surfaces after parity gate passes.
5. Validate final repository state (no Pelican build/deploy references in active docs/workflows, Astro build path functional).
6. Rollback strategy: revert the cutover commit/PR to restore prior workflows and files if blocking regressions appear.
