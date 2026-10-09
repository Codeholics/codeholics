# Design

## Context

See [proposal.md](proposal.md) for motivation. The posts collection already
accepts an optional string `thumbnail`, and rendered post bodies use Astro's
Markdown `Content` component. Post cards currently omit the field. A
pre-existing thumbnail on an unrelated post uses a Windows filesystem path and
would become a broken public URL if card rendering were enabled.

## Goals / Non-Goals

**Goals:**

- Render an optional thumbnail consistently across every existing post-list
  surface that uses the shared card component.
- Establish root-relative public asset URLs as the authoring convention.
- Publish the supplied WebP asset on the named self-taught hacker post both as
  its card thumbnail and as a body image.

**Non-Goals:**

- Add image transformation, responsive image generation, or an image CMS.
- Require thumbnails for historical posts.
- Change the post route, image asset directory hierarchy, or legacy URLs.

## Decisions

### Reuse optional frontmatter thumbnail metadata

The card will consume the existing optional `thumbnail` metadata rather than
infer an image from Markdown content. This gives authors explicit control over
the card image and leaves body layout independent of listing presentation.

Alternatives considered:

- Use the first Markdown image as the card thumbnail. Rejected because posts
  may contain no image or begin with an image unsuitable for card display.
- Make thumbnails mandatory. Rejected because existing posts have no thumbnail
  metadata and must retain their current appearance.

### Serve authored images from the public directory with root-relative URLs

Assets will remain below `astro/public/images/Posts/` and frontmatter and
Markdown references will use `/images/Posts/...` URLs. Astro copies public
assets unchanged into the build, while root-relative references work from the
home page, post routes, tags, categories, and pagination routes.

Alternatives considered:

- Relative Markdown URLs. Rejected because their resolution varies by rendered
  route.
- Imported content assets. Rejected for this change because the supplied asset
  already belongs in the public directory and the site needs a simple Markdown
  authoring convention.

### Use standard Markdown for article-body images

The first post will use Markdown image syntax with meaningful alt text. The
existing Markdown rendering pipeline will produce the article `<img>`; no
client-side processing is needed.

Alternatives considered:

- Raw HTML image tags. Rejected because Markdown syntax is clearer and keeps
  post authoring consistent.
- MDX-only image components. Rejected because the post is Markdown and images
  must work for both supported content formats.

## Risks / Trade-offs

- [A public asset path uses Windows separators or omits the leading slash] ->
  Move the thumbnail metadata to the requested post and use a root-relative
  URL; remove the invalid unrelated reference.
- [A card image crops important content] -> Use a consistent fixed card region
  with object-fit styling and verify the supplied portrait/landscape treatment
  in the local production output.
- [Missing thumbnail metadata regresses historical post cards] -> Render the
  image conditionally and verify a card without metadata remains image-free.

## Migration Plan

1. Add conditional thumbnail rendering to the shared post-card component.
2. Relocate the supplied image reference from the unrelated post to
   `the-death-of-the-self-taught-hacker`, using a root-relative public URL.
3. Add the same image to the target post body with descriptive alt text.
4. Document the authoring pattern and run the production build.

Rollback consists of removing the optional frontmatter field and card image
markup; public assets and posts without thumbnail metadata remain compatible.
