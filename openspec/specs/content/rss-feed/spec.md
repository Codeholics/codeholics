# content/rss-feed Specification

## Purpose

Provide an Astro-native RSS feed so readers can subscribe to published Codeholics posts without depending on the legacy Pelican feed.

## Requirements

### Requirement: Feed exposes published Astro posts
The system SHALL publish an RSS feed at `/rss.xml` that includes all non-draft posts from the Astro content source, ordered by publication date with newest entries first.

#### Scenario: Feed lists published posts only
- **WHEN** a reader requests `/rss.xml`
- **THEN** the feed includes published Astro posts and excludes any post marked as draft

### Requirement: Feed items use canonical post metadata
Each RSS item SHALL include the post title, absolute post URL, publication date, and an excerpt-based description suitable for feed readers.

#### Scenario: Feed item includes excerpt
- **WHEN** a post has no authored summary frontmatter
- **THEN** the feed item description is generated from the post content as a plain-text excerpt

### Requirement: Feed uses site canonical URL
The RSS feed SHALL emit absolute URLs rooted at the site's configured canonical URL so feed readers can resolve entries consistently.

#### Scenario: Item links are absolute
- **WHEN** a feed reader opens an item from `/rss.xml`
- **THEN** the item link resolves to the full canonical URL for that post
