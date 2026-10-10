# Social Sharing Specification

## Purpose

Provide informative, crawler-readable previews when the homepage or a published post is shared, with page-specific metadata and publicly accessible images.

## Requirements

### Requirement: Publish metadata in initial HTML
The site SHALL emit one consistent set of Open Graph tags, Twitter card tags, an HTML title, a description meta tag, and a canonical link in the initial HTML document without requiring JavaScript execution.

#### Scenario: Social crawler fetches a page
- **WHEN** a crawler requests the homepage or a published post without executing JavaScript
- **THEN** the HTML head contains exactly one of each required metadata tag
- **AND** corresponding Open Graph, Twitter, and HTML title and description values agree

### Requirement: Describe homepage shares
The homepage SHALL identify Codeholics by name, use a meaningful description of the site's software, hardware, and systems content rather than placeholder text, and identify its Open Graph type as `website`.

#### Scenario: Share the homepage
- **WHEN** the homepage HTML is fetched
- **THEN** its social title identifies Codeholics without the existing leading hash
- **AND** its description conveys the site's content
- **AND** `og:type` is `website` and `og:site_name` is `Codeholics`

### Requirement: Describe published post shares
Published posts SHALL use their authored title, summary when nonempty, and a plain-text excerpt when no summary is provided. Post pages SHALL expose `og:type` as `article` and identify the site as Codeholics.

#### Scenario: Post with an authored summary
- **WHEN** a published post with a nonempty summary is fetched
- **THEN** its metadata title is the authored post title rather than the generic site title
- **AND** its metadata description uses the summary
- **AND** `og:type` is `article` and `og:site_name` is `Codeholics`

#### Scenario: Post without a summary
- **WHEN** a published post without a nonempty summary is fetched
- **THEN** its metadata description uses a plain-text excerpt of its body
- **AND** Markdown formatting and MDX imports are not exposed as the description

#### Scenario: Title contains special characters
- **WHEN** a published post title or description contains quotes, ampersands, or angle brackets
- **THEN** the HTML safely encodes those values and preserves their decoded text

### Requirement: Use page-specific canonical URLs
The canonical link and `og:url` SHALL agree on an absolute URL for the current page path, excluding query strings and fragments and using the configured canonical site URL, including its build-time override.

#### Scenario: Default production build
- **WHEN** the homepage and a published post are built without `SITE_URL`
- **THEN** their canonical and Open Graph URLs use `https://www.codeholics.com`
- **AND** the post URL points to its post route rather than the homepage

#### Scenario: Alternate deployment build
- **WHEN** the site is built with `SITE_URL=https://dev.codeholics.com`
- **THEN** the canonical and Open Graph URLs use that deployment host and retain each page's path

### Requirement: Select share images predictably
The homepage and posts without a nonempty thumbnail SHALL use a shipped branded default share image. Posts with a thumbnail SHALL use that thumbnail for both Open Graph and Twitter imagery. Local share image paths SHALL resolve to absolute URLs against the configured canonical site URL; authored absolute HTTPS image URLs SHALL retain their external origin.

#### Scenario: Post with a local thumbnail
- **WHEN** a published post defines a local public thumbnail path
- **THEN** its `og:image` and `twitter:image` agree on the thumbnail's absolute URL
- **AND** the emitted image URL uses URL path separators rather than backslashes

#### Scenario: Homepage or post without a thumbnail
- **WHEN** the homepage or a published post without a nonempty thumbnail is fetched
- **THEN** its `og:image` and `twitter:image` reference the branded default share image

#### Scenario: Externally hosted thumbnail
- **WHEN** a published post defines an absolute HTTPS thumbnail URL
- **THEN** its image metadata retains that URL rather than prefixing the site host

#### Scenario: Alternate deployment image URL
- **WHEN** a post with a local thumbnail or the homepage is built with a `SITE_URL` override
- **THEN** its share image URL uses that configured host

### Requirement: Ship a compatible default share image
The default share image SHALL be a 1200 by 630 pixel PNG or JPEG, contain Codeholics branding, and be served successfully with an appropriate image content type without authentication. Any advertised image dimensions SHALL match the referenced asset.

#### Scenario: Fetch the default share image
- **WHEN** a crawler requests the default image URL from the built site
- **THEN** the response is successful and contains the advertised image format
- **AND** the asset measures 1200 by 630 pixels

#### Scenario: Post thumbnail differs from default dimensions
- **WHEN** a post shares a thumbnail of a different size
- **THEN** its metadata does not advertise the default image's dimensions for that thumbnail

### Requirement: Support large-image Twitter cards
The homepage and published posts SHALL emit `twitter:card` as `summary_large_image`, plus Twitter title, description, and image metadata matching their Open Graph equivalents.

#### Scenario: Read a post Twitter card
- **WHEN** a crawler reads a published post's initial HTML
- **THEN** `twitter:card` is `summary_large_image`
- **AND** its Twitter title, description, and image match the post's Open Graph values

### Requirement: Preserve existing site behavior
Social metadata changes SHALL preserve post publication filtering, existing routes, rendered post content, card thumbnail behavior, and favicon metadata. Other routes using the shared layout SHALL retain valid site-level metadata and their own canonical page URLs.

#### Scenario: Existing routes and presentation
- **WHEN** the site is rebuilt with social metadata support
- **THEN** published posts retain their existing routes, content, and card thumbnails
- **AND** drafts remain excluded and existing favicon tags remain present

#### Scenario: Share an existing listing page
- **WHEN** a post listing, tag, or category page is fetched
- **THEN** its shared metadata uses valid site defaults and a canonical URL for that route

### Requirement: Document authoring and preview refresh
The project SHALL document thumbnail reuse, default image fallback, recommended 1200 by 630 share artwork, absolute crawler-accessible image URLs, and the need to refresh Facebook's cached scrape after deployment without promising control over platform rendering or existing shares.

#### Scenario: Validate a deployed share
- **WHEN** an author follows the documented workflow
- **THEN** they can check a deployed page and image, request a fresh scrape through Facebook Sharing Debugger, and understand the remaining platform cache limitations
