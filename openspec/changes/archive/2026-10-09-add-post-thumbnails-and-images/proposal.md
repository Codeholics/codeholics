# Proposal

## Why

Posts currently accept an optional thumbnail value in their content schema, but post cards do not render it. Authors also need a documented, production-safe way to place images in Markdown posts, beginning with the self-taught hacker post.

## What Changes

- Render an optional frontmatter thumbnail on every post card without changing cards for posts that do not supply one.
- Support root-relative public image paths for both card thumbnails and standard Markdown body images in published posts.
- Update `the-death-of-the-self-taught-hacker` as the first verified post, using the supplied WebP asset as its thumbnail and article image.
- Document the required image location and authoring syntax for future posts.

## Capabilities

### New Capabilities

- `content/post-images`: Author, render, and publish optional post-card thumbnails and Markdown body images.

### Modified Capabilities

- None.

## Impact

- [astro/src/content.config.ts](../../../astro/src/content.config.ts) content schema and metadata validation.
- [astro/src/components/PostCard.astro](../../../astro/src/components/PostCard.astro) post-list presentation.
- [astro/src/content/posts/the-death-of-the-self-taught-hacker.md](../../../astro/src/content/posts/the-death-of-the-self-taught-hacker.md) first production content adoption.
- [astro/public/images/Posts/the-death-of-the-self-taught-hacker/The-Hacker-and-the-Server-Fortress.webp](../../../astro/public/images/Posts/the-death-of-the-self-taught-hacker/The-Hacker-and-the-Server-Fortress.webp) published asset.
- Relevant Astro authoring documentation and production build validation.
