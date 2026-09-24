# content/youtube-embeds Specification

## Purpose

Allow Astro-authored Codeholics posts to publish working YouTube embeds while preserving the existing video identity and post URLs during the Pelican-to-Astro migration.

## Requirements

### Requirement: Astro posts can render YouTube embeds
The system SHALL render a playable YouTube embed for an Astro-authored post that includes a migrated YouTube video entry, and the rendered embed SHALL target the same YouTube video ID already associated with that post.

#### Scenario: Migrated video post renders the same video
- **WHEN** a reader opens a migrated Astro post that previously used `{% youtube <youtube_id> %}`
- **THEN** the post page renders a playable YouTube embed
- **AND** the embed targets the same `<youtube_id>` value that was present in the migrated post content

### Requirement: MDX post migration preserves published post identity
The system SHALL treat migrated Astro posts authored as MDX as first-class published posts, preserving their existing slugs and publication filtering behavior.

#### Scenario: Migrated MDX post keeps its route
- **WHEN** a published Astro post is migrated from Markdown to MDX to support a YouTube embed
- **THEN** the post remains available at the same `/posts/<slug>` route as before the migration
- **AND** the post continues to appear anywhere published Astro posts are listed or statically generated

#### Scenario: Draft filtering remains unchanged for MDX posts
- **WHEN** an Astro post authored as MDX is marked as draft using the existing frontmatter conventions
- **THEN** it is excluded anywhere draft Markdown posts are currently excluded

### Requirement: Search output excludes raw embed syntax
The system SHALL generate search and excerpt text for migrated embed posts without exposing raw legacy liquid-tag syntax or MDX component/import markup to readers.

#### Scenario: Search result excerpt for embed post is clean text
- **WHEN** a reader searches and receives a result for a migrated embed post
- **THEN** the result excerpt does not include `{% youtube ... %}` text
- **AND** the result excerpt does not include MDX import statements or component tag markup
