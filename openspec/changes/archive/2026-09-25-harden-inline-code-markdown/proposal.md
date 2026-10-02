# Proposal

## Why

Some migrated posts contain malformed inline-code delimiters that leak literal backticks into rendered article text, reducing readability and trust in technical content quality. We need an approach that improves legacy rendering immediately while preventing new malformed markdown from entering the repository.

## What Changes

- Extend markdown code-handling behavior to cover inline code delimiter reliability, not only fenced block highlighting.
- Introduce a **hybrid policy**:
  - temporary tolerant normalization for clearly malformed inline-code patterns in legacy content
  - strict markdown lint enforcement after a defined cleanup window.
- Add diagnostics and contributor guidance so malformed inline code is visible, fixable, and eventually blocked pre-merge.
- Define phased acceptance criteria for transitioning from tolerant mode to strict enforcement.

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `ui/code-highlighting`: Expand requirement scope to include inline code rendering correctness, temporary tolerant normalization behavior, and phased strict lint enforcement for malformed inline code delimiters.

## Impact

- **Affected code**: Astro markdown processing pipeline and markdown utility logic in `astro/src/lib/`, plus related markdown styling where needed.
- **Tooling**: Adds markdown linting configuration and CI/build checks for malformed inline code.
- **Documentation**: Updates contributor guidance in `README.md` (and/or Astro-specific docs) with canonical inline-code authoring rules and migration timeline.
- **Content operations**: Existing legacy posts can render cleanly during cleanup, while new malformed patterns are surfaced and later blocked.
