# Tasks

## 1. Inline code diagnostics and transition policy

- [x] 1.1 Define malformed inline-code delimiter detection rules in the markdown pipeline and verify representative bad samples are reported with file-level diagnostics.
- [x] 1.2 Implement warning-mode lint behavior for inline delimiter violations and verify local and CI workflows emit diagnostics without failing the run.
- [x] 1.3 Decide and document the promotion threshold from warning to blocking (for example zero warnings in core build targets) and verify the policy is recorded in project docs.

## 2. Deterministic normalizer and safety bounds

- [x] 2.1 Implement a constrained normalizer for deterministic malformed inline-code patterns and verify known legacy patterns render without visible dangling backticks.
- [x] 2.2 Preserve ambiguous patterns for manual remediation (no speculative rewrite) and verify ambiguous samples produce diagnostics instead of auto-fixes.
- [x] 2.3 Emit normalization-applied diagnostics and verify logs identify when and where automatic correction occurred.

## 3. Enforcement hardening and documentation

- [x] 3.1 Add blocking-mode lint configuration for post-transition enforcement and verify malformed inline delimiters fail the configured gate when blocking mode is enabled.
- [x] 3.2 Update contributor guidance with canonical inline-code delimiter usage and remediation steps and verify docs include runnable check commands.
- [x] 3.3 Validate hybrid flow end-to-end against representative legacy and clean posts and verify: deterministic fixes render cleanly, warnings appear in transition mode, and blocking mode prevents new malformed patterns.
