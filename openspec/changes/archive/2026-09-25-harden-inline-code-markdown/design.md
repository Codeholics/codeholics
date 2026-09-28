# Design

## Context

See `proposal.md` for motivation.  
The Astro pipeline already normalizes fenced code language labels (`astro/src/lib/markdown-code.mjs`) and renders fenced code via `rehype-pretty-code`, but inline code delimiter quality remains dependent on source markdown correctness. Legacy migrated posts include malformed inline spans (for example `... \`mycroft.conf\` file\`.`) that leak literal delimiter characters into rendered text.  
Current docs include fenced-code policy, but no explicit inline delimiter quality gate or migration policy for malformed legacy inline syntax.

## Goals / Non-Goals

**Goals:**
- Prevent reader-facing inline code delimiter leakage in migrated markdown content.
- Introduce a temporary, constrained normalizer for deterministic malformed inline patterns.
- Add markdown lint diagnostics for inline delimiter correctness in local and CI workflows.
- Transition from warning-only to blocking enforcement after a documented cleanup window.
- Document canonical inline-code authoring and remediation workflow.

**Non-Goals:**
- Rewriting all historical markdown posts in one bulk migration.
- Implementing broad markdown autocorrection for ambiguous prose-level formatting errors.
- Changing fenced code highlighting behavior beyond what is required for shared diagnostics/reporting plumbing.

## Decisions

1. **Adopt a hybrid enforcement model (tolerant now, strict later)**
   - **Decision:** Begin with warning-mode lint plus temporary normalizer; switch lint to blocking after cleanup milestones are met.
   - **Why:** Immediate user-facing quality improvement without breaking existing publish flow for known legacy issues.
   - **Alternatives considered:**
     - Strict-only immediately: rejected due to high short-term breakage risk on legacy content.
     - Tolerant-only permanently: rejected because malformed markdown would continue entering new content.

2. **Keep normalization narrow and deterministic**
   - **Decision:** Normalize only explicit malformed inline patterns with unambiguous corrections and emit diagnostics whenever normalization is applied.
   - **Why:** Avoids silent semantic drift in technical prose while still repairing known migration artifacts.
   - **Alternatives considered:**
     - Broad regex-based auto-fix across all inline delimiters: rejected as too error-prone and non-transparent.
     - No normalization: rejected because it leaves visible legacy defects unresolved until manual edits complete.

3. **Centralize markdown code quality logic**
   - **Decision:** Extend existing markdown utility/pipeline components so fence and inline quality policies live in one code-quality surface.
   - **Why:** Reduces duplicate parsing logic and keeps diagnostics behavior consistent across markdown processing steps.
   - **Alternatives considered:**
     - Separate one-off inline processing script: rejected due to policy drift and maintenance overhead.

4. **Make the lint phase explicit and documented**
   - **Decision:** Record warning phase, blocking phase, and promotion criteria in repo documentation and CI conventions.
   - **Why:** Prevents uncertainty about when checks fail and provides predictable contributor experience.
   - **Alternatives considered:**
     - Implicit/undocumented timeline: rejected due to ambiguity and inconsistent enforcement.

## Risks / Trade-offs

- **[False positives in linting]** Inline markdown edge cases may trigger noisy diagnostics → **Mitigation:** start in warning mode, tune rules with representative legacy posts, and promote to blocking only after stability.
- **[Over-correction risk]** Normalizer could alter intended prose in borderline patterns → **Mitigation:** restrict to deterministic signatures and skip ambiguous matches with manual-fix diagnostics.
- **[Transition drift]** Team may forget to switch warning mode to blocking → **Mitigation:** document explicit phase criteria and track transition as checklist tasks in the change.
- **[Contributor confusion]** Authors may conflate fence and inline policies → **Mitigation:** maintain a single markdown code policy section with examples for both patterns.

## Migration Plan

1. Identify and codify deterministic malformed inline patterns currently observed in migrated posts.
2. Implement warning-mode inline lint diagnostics in local and CI workflows.
3. Add constrained normalizer and reporting hooks for matched patterns.
4. Document canonical inline syntax and remediation process in contributor docs.
5. Fix flagged legacy posts over the transition window.
6. Promote inline lint diagnostics from warning to blocking once cleanup criteria are met.
7. Keep rollback path: disable blocking mode while preserving diagnostics if unexpected false positives impact merges.

## Open Questions

- What specific threshold promotes warning-mode checks to blocking mode (for example, zero legacy warnings in default build targets, or a fixed calendar cutoff)?
