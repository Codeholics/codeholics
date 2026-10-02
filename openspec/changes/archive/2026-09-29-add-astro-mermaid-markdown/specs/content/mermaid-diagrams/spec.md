# Spec Delta

## Purpose

Allow Astro authors to include version-controlled Mermaid diagrams in post Markdown that render as static diagrams in the generated site.

## ADDED Requirements

### Requirement: Render Mermaid post diagrams at build time
The site build SHALL convert every fenced code block labeled `mermaid` in a published Astro Markdown or MDX post into inline SVG output in the generated post page.

#### Scenario: Build a post containing a Mermaid diagram
- **WHEN** an Astro post contains a valid fenced code block labeled `mermaid` and the site is built
- **THEN** the generated post page contains an SVG representation of that diagram rather than the Mermaid source code block

#### Scenario: Preserve Mermaid language labels through Markdown processing
- **WHEN** a post contains a code block labeled `mermaid`
- **THEN** Markdown processing retains that language label until the diagram renderer processes the block

### Requirement: Provision the diagram rendering runtime
The documented site build environment MUST install a Playwright Chromium browser before a build that renders Mermaid diagrams.

#### Scenario: Prepare a clean build environment
- **WHEN** a developer or CI workflow prepares a clean environment to build the site
- **THEN** it installs the required Playwright Chromium browser before running the Astro production build