# ui/dark-mode-readability Specification

## Purpose

Ensure the site's dark theme remains comfortable to read across long-form posts and shared UI surfaces by defining explicit contrast and palette behavior.

## Requirements

### Requirement: Dark-mode reading surfaces remain readable
When dark mode is active, the system SHALL render article pages and other long-form reading surfaces with a dedicated dark background, a distinct content surface, and high-contrast foreground colors for headings, body copy, and metadata.

#### Scenario: Article body remains legible in dark mode
- **WHEN** a user views an article page while dark mode is active
- **THEN** the page background and the article content surface are visually distinct dark tones
- **AND** the article heading is brighter than the body copy
- **AND** body copy and metadata meet at least 4.5:1 contrast against their immediate background
- **AND** no paragraph or metadata text appears as black or near-black on a dark surface

#### Scenario: Long-form content keeps readable spacing cues
- **WHEN** a user reads paragraphs, lists, and blockquotes in dark mode
- **THEN** those elements remain visually separable through contrast, spacing, or borders without relying on bright light-mode colors

### Requirement: Shared navigation and listing surfaces use the dark palette consistently
When dark mode is active, the system SHALL apply a coherent dark palette to shared interface surfaces including the navbar, article/listing cards, pagination, sidebar widgets, and search controls so that each surface remains readable and visually related without collapsing into a single flat tone.

#### Scenario: Listing cards remain readable in dark mode
- **WHEN** a user views the home page or another article listing in dark mode
- **THEN** each listing card presents its title, summary, and interactive links with readable contrast against the card background
- **AND** interactive states remain visually distinct from surrounding body copy

#### Scenario: Navbar and search stay readable in dark mode
- **WHEN** a user views the navbar or interacts with the search field in dark mode
- **THEN** labels, icons, entered text, placeholders, and focus states remain readable against their dark surfaces

### Requirement: Links and accents remain discoverable without overpowering content
When dark mode is active, the system SHALL use accent colors for links, hover states, and emphasis that are clearly distinguishable from surrounding text while preserving reading comfort for content-heavy pages.

#### Scenario: Inline links are discoverable in article copy
- **WHEN** a user reads article text containing inline links in dark mode
- **THEN** links are visually distinguishable from surrounding paragraph text at rest
- **AND** hover or focus states provide an additional visual change beyond the resting color

### Requirement: Code and syntax-highlighted content remain readable in dark mode
When dark mode is active, the system SHALL render inline code, fenced code blocks, and syntax-highlighted snippets with a dark code surface and token colors that remain readable without reverting to light-theme backgrounds or low-contrast token colors.

#### Scenario: Highlighted code remains legible
- **WHEN** a user views a syntax-highlighted code block in dark mode
- **THEN** the code block background is a dark surface distinct from the article body
- **AND** default code text and syntax tokens remain readable against that surface
- **AND** line-number or emphasis styles do not introduce black text on dark backgrounds
