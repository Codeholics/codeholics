# Proposal

## Why

Post authors cannot currently use readable GitHub-style emoji aliases such as
`:rocket:` in Markdown or MDX. Supporting recognized gemoji shortcodes makes
authoring consistent with GitHub while rendering the intended Unicode emoji to
readers.

## What Changes

- Convert recognized GitHub-compatible gemoji shortcodes to their Unicode emoji
  in published Markdown and MDX content.
- Preserve unknown shortcodes and shortcode-like text in code as literal source
  text instead of failing the build or altering code examples.
- Add regression coverage and authoring documentation for supported shortcode
  behavior.

## Capabilities

### New Capabilities

- `content/emoji-shortcodes`: Convert recognized GitHub-style emoji shortcodes
  in published Markdown and MDX content while preserving unsupported and
  code-context text.

### Modified Capabilities

- None.

## Impact

- Astro Markdown processor configuration and dependencies
- Markdown/MDX regression coverage and build verification
- Astro authoring documentation
