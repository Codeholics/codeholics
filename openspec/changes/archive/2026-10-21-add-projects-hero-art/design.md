# Design

## Context

The page at `astro/src/pages/projects/index.astro` renders the concept artwork with page-scoped styles. Use the user's supplied 1920-by-768 full-size image at `astro/public/images/projects/cyberpunk_developer_desk_under_moonlight_fullsize.png`; the attachment contains PNG bytes despite its `.webp` filename. Preserve the approved layout and effects when replacing the smaller artwork. The site supports light and dark themes.

## Goals / Non-Goals

**Goals:**
- Match the concept's split composition and neon-terminal atmosphere without changing the content structure or page route.
- Keep the heading and introduction legible over the art in both site themes.
- Use CSS and the existing local asset without adding a client-side dependency.

**Non-Goals:**
- Rework the repository cards, curated category interactions, or site-wide theme.
- Add animation, parallax, image loading services, or additional artwork variants.

## Decisions

1. **Use the existing local project image as decorative hero art.** Render it within the hero as an image with empty alternative text and hide it from assistive technology because the adjacent heading and introduction provide the meaningful content. This keeps asset loading explicit and avoids inaccessible duplicate narration.

2. **Use an unboxed, two-column hero on wide viewports.** Keep the text in the left column and let the image fill the right portion with `object-fit: cover` and a right-biased crop. The hero has no separate card surface, rounded outline, or outer shadow: its background remains the page background, and the image fades into that surface. A subtle bottom divider separates the hero from the repository sections.

3. **Blend the image and text into the site background with layered CSS gradients.** A dark gradient overlay on the art fades to the page background behind the text, preserving contrast even in light site mode without creating a boxed backdrop. Use restrained cyan/violet accents within the image treatment only; do not add an enclosing border, rounded corners, or drop shadow.

4. **Adapt the composition at narrow widths.** Stack or shorten the image region below the copy on mobile, preserve a useful focal crop, and avoid fixed minimum widths that could cause horizontal overflow. Respect reduced-motion preferences if any effect uses transitions; the design does not require animation.

5. **Remove the navbar gap and preserve desktop image height.** Opt this page out of the shared layout's top padding while retaining bottom spacing and leaving all other pages unchanged. Size the desktop hero relative to its content width and the artwork's 1920-by-768 aspect ratio at its 58% image width. This reveals the full vertical scene at normal desktop sizes rather than cropping it into a fixed short strip. Retain the mobile height and crop treatment.

## Risks / Trade-offs

- [The image can obscure text or become too dark after blending] → Keep copy over the gradient-faded portion of the art and verify readable contrast at desktop and mobile sizes in both themes.
- [A fixed desktop crop may cut off the desk focal point on mobile] → Adjust `object-position` and hero image height at the narrow breakpoint and validate visually.
- [The local image is currently untracked in the working tree] → Keep the referenced asset path consistent and ensure the asset is included with the implementation when the change is reviewed.

## Migration Plan

No migration is needed. Update only the Featured Projects hero markup and page-scoped CSS. Rollback by restoring the existing text-only hero styles and markup; the route and other page sections remain unchanged.
