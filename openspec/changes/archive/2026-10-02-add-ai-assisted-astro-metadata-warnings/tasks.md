# Tasks

## 1. Define metadata enforcement inputs and warning contract

- [x] 1.1 Add a single source of truth for required front matter keys (`title`, `date`, `category`, `tags`, `slug`, `summary`) and verify by reading the exported key list in the enforcement module.
- [x] 1.2 Define warning output shape (post path plus missing/empty keys) and verify with a fixture post that output includes file path and each violated key.

## 2. Implement warning-only validator for AI-assisted drafts

- [x] 2.1 Implement metadata validation logic for posts under `astro/src/content/posts` and verify with fixture inputs covering complete metadata, missing keys, and empty values.
- [x] 2.2 Ensure validator returns warnings without failing execution and verify command/process exit status remains successful when warnings are present.
- [x] 2.3 Gate automatic validator execution to AI-assisted generation flow and verify manual-only authoring does not auto-run the check.

## 3. Integrate and document usage in AI content workflow

- [x] 3.1 Integrate the validator call into the AI-assisted post generation path and verify warnings are emitted during AI draft creation.
- [x] 3.2 Add user-invokable entrypoint for optional manual checks and verify it applies the same required-field rules to existing posts.
- [x] 3.3 Update workflow documentation for warning-only behavior and scope, and verify docs explicitly state that warnings do not block publishing/builds.
