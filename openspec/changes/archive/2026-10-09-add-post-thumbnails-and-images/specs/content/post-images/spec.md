# Spec Delta

## Purpose

Allow published posts to present optional card thumbnails and accessible images
within their rendered Markdown content.

## ADDED Requirements

### Requirement: Render optional post-card thumbnails
The site SHALL display a post's configured thumbnail on every post-list card
and SHALL retain the current card layout when no thumbnail is configured.

#### Scenario: Card with a thumbnail
- **WHEN** a published post defines a thumbnail image path
- **THEN** each rendered card for that post displays the thumbnail and links to the post

#### Scenario: Card without a thumbnail
- **WHEN** a published post has no thumbnail image path
- **THEN** its rendered card contains no broken or empty image element

### Requirement: Publish Markdown post images
The site SHALL publish images referenced by standard Markdown image syntax from
the public asset path and render them in the corresponding post body.

#### Scenario: Render an in-post image
- **WHEN** a published Markdown post contains an image with descriptive alternative text and a root-relative public asset path
- **THEN** the generated post page contains that image with the authored alternative text

#### Scenario: Deploy a supplied public image
- **WHEN** a post references an image stored below the site's public asset directory
- **THEN** the production build emits an image URL that resolves at the deployed site root

### Requirement: Provide reusable image authoring guidance
The project SHALL document the frontmatter and Markdown image syntax required
to publish card thumbnails and in-post images.

#### Scenario: Author a new post image
- **WHEN** an author follows the documented image guidance
- **THEN** they can configure a card thumbnail and an in-post image with production-safe URLs
