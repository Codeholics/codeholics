# Spec Delta

## Purpose

Let post authors use GitHub-style emoji aliases while readers receive the
corresponding Unicode emoji in published Markdown and MDX content.

## ADDED Requirements

### Requirement: Render recognized emoji shortcodes
The site SHALL convert recognized GitHub-compatible gemoji shortcodes in
published Markdown and MDX prose to their Unicode emoji equivalents.

#### Scenario: Render a shortcode in Markdown
- **WHEN** a Markdown post contains a recognized shortcode such as `:rocket:`
- **THEN** the generated post renders the corresponding Unicode emoji
- **AND** the shortcode source text is not repeated in the rendered prose

#### Scenario: Render a shortcode in MDX
- **WHEN** an MDX post contains a recognized shortcode such as `:tada:`
- **THEN** the generated post renders the corresponding Unicode emoji

### Requirement: Preserve unsupported and code-context shortcode text
The site SHALL leave unknown shortcodes and shortcode-like text in inline or
fenced code unchanged without failing the production build.

#### Scenario: Render an unsupported shortcode
- **WHEN** a post contains an unrecognized shortcode such as `:not-an-emoji:`
- **THEN** the generated post preserves that text as written

#### Scenario: Render shortcode-like code
- **WHEN** a post contains a recognized shortcode in inline or fenced code
- **THEN** the generated post preserves the shortcode text in the code example
