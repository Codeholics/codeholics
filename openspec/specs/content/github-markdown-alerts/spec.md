# GitHub Markdown Alerts Specification

## Purpose

Let Astro post authors use GitHub-compatible alert blockquotes that render as readable, accessible callouts in the published site.

## Requirements

### Requirement: Render supported GitHub-style alerts
The site SHALL recognize `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]` blockquotes in Astro Markdown and MDX posts as alerts, irrespective of the marker's letter case.

#### Scenario: Render a note alert
- **WHEN** a published post contains a blockquote beginning with `> [!NOTE]`
- **THEN** the generated post renders the quoted content as a callout identified as a note
- **AND** the marker text is not repeated as part of the callout body

#### Scenario: Render each supported alert type
- **WHEN** a published post contains an alert marked `TIP`, `IMPORTANT`, `WARNING`, or `CAUTION`
- **THEN** the generated post renders a callout identified by that alert type

### Requirement: Preserve non-alert blockquotes
The site SHALL preserve ordinary blockquotes and blockquotes with unsupported alert markers as standard blockquotes.

#### Scenario: Render an ordinary quote
- **WHEN** a post contains a blockquote that does not start with an alert marker
- **THEN** the generated post renders it using the existing blockquote presentation

#### Scenario: Render an unsupported marker
- **WHEN** a post contains a blockquote beginning with an unsupported marker such as `> [!CUSTOM]`
- **THEN** the generated post renders it as a standard blockquote without failing the build

### Requirement: Keep alerts legible in supported themes
The site SHALL render alert content, labels, and distinguishing visual treatment legibly in both light and dark themes.

#### Scenario: View an alert in each theme
- **WHEN** a reader views a post containing an alert in light mode or dark mode
- **THEN** the alert label and body remain readable against the alert surface
- **AND** its visual treatment is distinguishable from an ordinary blockquote
