I would **change this Astro instruction file fairly substantially**. The file you copied is good generic Astro guidance, but it conflicts with the Codeholics architecture you just established in several places.

The biggest conflicts are:

- It says the project supports React/Vue/Svelte/Solid, while Codeholics explicitly wants **Astro-only by default**.
- It tells agents to use framework components for interactive elements. That directly undermines your zero-JS/Astro-first rule.
- It presents `<ClientRouter />` almost as a standard enhancement. Astro's current documentation makes clear that this opts the site into client-side routing and changes an MPA into SPA-style navigation; Codeholics should not do that by default. [Astro Previews](https://v7-4.previews.docs.astro.build/en/guides/view-transitions/?utm_source=chatgpt.com)
- It says to "consider" Tailwind, whereas Tailwind is actually your project's chosen styling system.
- The `tsconfig.json` example unnecessarily prescribes `astro/tsconfigs/base`; current Astro guidance defaults new TypeScript projects toward the `strict`/`strictest` configurations, and `base` requires additional considerations for content collections. [Astro Previews](https://v7-4.previews.docs.astro.build/en/guides/content-collections/?utm_source=chatgpt.com)
- Server Islands, Sessions, Actions and SSR are legitimate Astro features, but Codeholics is a **static content site**, so agents shouldn't reach for them unless an OpenSpec requirement explicitly changes that.
- The image guidance can be made more precise: Astro currently provides `<Image />` and `<Picture />`, including responsive image behavior; `<Picture />` is the appropriate choice when you specifically need multiple formats such as AVIF and WebP. [Astro Docs](https://docs.astro.build/en/reference/modules/astro-assets/?utm_source=chatgpt.com)
- Your Zod guidance is current: Astro uses Zod 4 and `z.email()` / `z.url()` rather than deprecated chained forms. [Astro Docs](https://docs.astro.build/en/guides/upgrade-to/v6/?utm_source=chatgpt.com)

I would replace your current file with this Codeholics-specific version.

---
description: 'Astro 7 development standards for the Codeholics static content site'
applyTo: '**/*.astro, **/*.ts, **/*.js, **/*.md, **/*.mdx'
---

# Astro Development Instructions

These instructions define Astro-specific implementation standards for Codeholics.

Codeholics is an Astro-first, static, content-driven website using Tailwind CSS.

For visual design rules, follow `/DESIGN.md`.

For repository-wide engineering, OpenSpec, UI workflow, and instruction authority, follow `/.github/copilot-instructions.md`.

These instructions define **how Astro code should be implemented**.

---

# Project Architecture

Codeholics uses:

- Astro 7.x
- TypeScript
- Tailwind CSS
- Content Collections / Content Layer
- Markdown content
- Static Site Generation (SSG)
- Astro components
- progressive enhancement
- minimal client-side JavaScript

The Astro application is located at:

```text
/astro
```

Relevant paths include:

```text
/astro/src/components
/astro/src/layouts
/astro/src/pages
/astro/src/content
/astro/src/content/posts
/astro/public
```

Do not assume the repository root is the Astro application root.

Run Astro and npm commands from:

```text
/astro
```

---

# Core Architecture Principle

Codeholics is:

```text
server/build-time rendered
        ↓
static HTML by default
        ↓
CSS for presentation
        ↓
native browser behavior
        ↓
small JavaScript enhancement when necessary
```

Client-side JavaScript is an exception, not the default.

Prefer an MPA architecture.

Do not convert Codeholics into a SPA unless an accepted OpenSpec change explicitly requires that architectural change.

---

# Astro First

Use `.astro` components for:

- layouts
- navigation
- article UI
- cards
- repository displays
- resource lists
- metadata
- pagination
- callouts
- static forms
- content presentation
- reusable UI primitives

Prefer Astro components unless there is a concrete technical reason not to.

Do not introduce React, Vue, Svelte, Solid, or another client framework merely because a component contains interaction.

Framework integrations require explicit architectural justification.

Before introducing a client framework, determine whether the requirement can be implemented with:

1. semantic HTML
2. CSS
3. native browser APIs
4. a small vanilla TypeScript/JavaScript enhancement
5. a Web Component
6. Astro-native functionality

Only then consider another framework.

---

# Zero JavaScript by Default

Start each component assuming:

```text
Client-side JavaScript budget: 0 KB
```

Do not add JavaScript for behavior already provided by HTML or CSS.

Examples include:

- disclosure using appropriate native elements
- responsive layout
- hover/focus states
- basic navigation
- anchors
- forms
- CSS transitions
- visual state changes that do not require application state

When JavaScript is required:

- keep it local to the behavior
- keep dependencies minimal
- avoid global state unless genuinely necessary
- progressively enhance existing HTML
- preserve functionality when JavaScript fails where practical

---

# Hydration Directives

Do not use `client:*` directives automatically.

Hydration must have a clear reason.

If hydration is genuinely required, choose the least aggressive strategy that satisfies the requirement.

Examples:

```text
client:load
```

Use only when functionality is required immediately.

```text
client:idle
```

Use for lower-priority interactive behavior that can wait until the browser is idle.

```text
client:visible
```

Use when interaction is unnecessary until the component approaches the viewport.

Do not hydrate static components.

Do not use hydration merely to implement styling.

---

# Client-Side Routing and View Transitions

Codeholics should remain a Multi-Page Application by default.

Do not add `<ClientRouter />` merely to create smoother navigation.

Before adding Astro client-side routing, determine whether the requirement can be handled with:

- normal browser navigation
- native cross-document View Transitions
- CSS transitions
- isolated component behavior

Adding `<ClientRouter />` is an architectural decision because it changes page navigation behavior and introduces client-side routing concerns.

Only add it when an accepted requirement specifically needs its capabilities.

If `<ClientRouter />` is introduced:

- document why it is required
- account for script re-execution behavior
- test browser back/forward navigation
- test forms
- test focus behavior
- test scroll restoration
- test accessibility
- test reduced-motion behavior

Do not introduce SPA-style routing patterns elsewhere unless the project intentionally adopts client-side routing.

---

# Astro Component Structure

Use standard Astro component organization:

```astro
---
interface Props {
  title: string;
  featured?: boolean;
}

const {
  title,
  featured = false,
} = Astro.props;
---

<article>
  <h2>{title}</h2>
</article>
```

Keep:

```text
frontmatter
    ↓
template
    ↓
component-specific styles/scripts when needed
```

Component frontmatter should contain build-time/server-side logic.

Avoid performing presentation logic in client-side scripts when it can be computed during rendering.

---

# Component Props

Use TypeScript interfaces for component props.

Prefer:

```astro
---
interface Props {
  title: string;
  description?: string;
  featured?: boolean;
}

const {
  title,
  description,
  featured = false,
} = Astro.props;
---
```

Props should describe:

- content
- meaning
- state
- behavior
- semantic variants

Props should generally not expose arbitrary visual design tokens.

Prefer:

```astro
<RepoCard
  repo={repo}
  featured={true}
/>
```

Avoid:

```astro
<RepoCard
  borderColor="#38BDF8"
  radius="12px"
  titleSize="22px"
/>
```

Visual rules belong in `/DESIGN.md` and established component styles.

---

# Component Design

Keep components:

- focused
- reusable
- composable
- understandable
- semantically named

Use PascalCase filenames:

```text
RepoCard.astro
ResourceCard.astro
ArticleHeader.astro
TagList.astro
```

Do not create components solely to wrap a trivial amount of markup.

Before creating a component, search the repository for an existing equivalent or similar implementation.

Follow:

```text
reuse → extend → variant → compose → create
```

---

# HTML

Generate valid semantic HTML.

Prefer native semantic elements such as:

```html
<header>
<nav>
<main>
<article>
<section>
<aside>
<footer>
<figure>
<figcaption>
<time>
<details>
<summary>
<button>
```

Use `<div>` and `<span>` when no more meaningful semantic element exists.

Maintain correct heading hierarchy.

Do not select heading levels based on desired font size.

Do not nest invalid block-level structures inside paragraph elements.

Use native interactive elements instead of reproducing them with generic elements and ARIA.

Prefer:

```html
<button>
```

over:

```html
<div role="button">
```

---

# Content Collections

Use Astro Content Collections / Content Layer for structured content.

Collection configuration belongs in:

```text
src/content.config.ts
```

Prefer built-in loaders where appropriate:

```ts
import { glob } from 'astro/loaders';
import { file } from 'astro/loaders';
```

Use:

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
```

Use Zod schemas to validate structured content.

Example:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  posts,
};
```

Use modern Zod 4 forms such as:

```ts
z.email()
z.url()
```

rather than deprecated chained equivalents when applicable.

Query collections with type-safe Astro APIs such as:

```ts
getCollection()
getEntry()
```

Use generated content types rather than duplicating collection types manually.

Run:

```bash
astro sync
```

when configuration changes require regenerated Astro types.

---

# TypeScript

Use TypeScript for new application logic unless there is a strong reason not to.

Do not replace the project's existing `tsconfig.json` merely to follow an example.

Respect the existing Codeholics TypeScript configuration.

Use generated Astro types where available.

Avoid:

- `any` without justification
- unnecessary type assertions
- duplicating types already inferred by Astro
- maintaining parallel interfaces for content collection schemas

Prefer narrow, explicit types at component and data boundaries.

---

# Tailwind CSS

Tailwind CSS is the primary styling system for Codeholics.

This is not an optional styling recommendation.

Follow `/DESIGN.md` for:

- colors
- typography
- spacing
- radii
- borders
- surfaces
- responsive behavior
- interaction states

Prefer existing Tailwind utilities and project conventions.

Avoid arbitrary Tailwind values when a project token or standard utility already provides the desired value.

Prefer:

```text
p-6
gap-6
rounded-xl
```

over unnecessary arbitrary equivalents:

```text
p-[25px]
gap-[23px]
rounded-[13px]
```

Arbitrary values are acceptable when an intentional design requirement requires precision.

---

# Scoped CSS

Use Astro component-scoped `<style>` blocks when CSS is:

- unique to a component
- difficult or inappropriate to express with Tailwind
- required for complex selectors
- required for generated content
- required for special browser behavior

Do not recreate large sections of Tailwind inside component CSS.

Use global CSS only for intentionally global concerns such as:

- design tokens
- typography foundations
- prose styles
- normalization
- shared document-level behavior

---

# Responsive Design

Develop mobile-first.

Follow `/DESIGN.md` and the `responsive-design` skill.

Avoid desktop-only assumptions.

Components must handle:

- narrow screens
- long titles
- long descriptions
- missing optional data
- code overflow
- tables
- varying image ratios
- touch interaction

Prefer fluid layout techniques.

Use fixed dimensions only when the design intentionally requires them.

---

# Images

Prefer Astro's asset pipeline for local content images.

Use:

```astro
---
import { Image } from 'astro:assets';
---
```

when a single optimized image output is appropriate.

Use `<Picture />` when multiple source formats or responsive image requirements justify it.

Provide meaningful `alt` text for content images.

Use:

```text
alt=""
```

for genuinely decorative images.

Do not duplicate surrounding text in alt text.

Preserve intrinsic dimensions or aspect ratio to minimize layout shift.

Use responsive image behavior where appropriate.

Do not manually generate WebP/AVIF variants when Astro's image pipeline can perform the transformation.

---

# Public Assets

Use `/public` for assets that must:

- retain their original filename
- be available at a predictable URL
- bypass Astro processing

Do not place optimizable source images in `/public` merely out of convenience when they would benefit from Astro's asset pipeline.

---

# Markdown and MDX

Use Markdown for ordinary editorial content.

Do not introduce MDX merely to achieve visual styling that can be handled by the existing Markdown rendering pipeline.

Use MDX only when content genuinely requires embedded components or richer executable behavior.

Preserve content portability when possible.

Do not insert layout-specific presentation markup throughout article Markdown when a reusable renderer or component can solve the problem.

---

# Data Fetching

Prefer build-time data retrieval for static Codeholics content.

Fetch data during Astro rendering/frontmatter when it can be resolved at build time.

For external build-time requests:

- handle failures explicitly
- avoid unnecessary duplicate requests
- cache expensive operations where appropriate
- ensure failures produce understandable build errors

Do not introduce runtime APIs merely to retrieve data that can be generated at build time.

---

# Static Site Generation

Codeholics defaults to static output.

Do not enable SSR or on-demand rendering solely because Astro supports it.

Before introducing SSR, confirm that the requirement actually needs request-time execution.

Examples that may justify SSR include:

- authentication-dependent responses
- private user-specific content
- request-specific server logic
- runtime mutations
- server-managed session state

If none apply, prefer static generation.

Changing the project from static output to SSR is an architectural change and should be represented in OpenSpec.

---

# Server Islands

Do not introduce `server:defer` into the current static architecture by default.

Server Islands require server/on-demand rendering infrastructure.

Only use Server Islands when an accepted architectural requirement introduces appropriate server rendering and the feature specifically benefits from deferred server rendering.

---

# Astro Actions

Do not add Actions merely because a page contains a form.

For static forms, prefer the simplest architecture compatible with the actual destination or service.

Astro Actions are appropriate when Codeholics has server-side mutation requirements and an appropriate runtime adapter.

If Actions become necessary:

- define them under `src/actions`
- validate input
- use TypeScript
- return explicit errors
- preserve progressive enhancement where practical

Introducing server-side Actions into the currently static site must be intentional.

---

# Sessions

Do not introduce Astro Sessions into Codeholics unless a feature genuinely requires persistent server-side visitor state.

Sessions imply server-side/runtime infrastructure.

Their introduction should be treated as an architectural change.

---

# API Routes

Create API routes only when runtime server behavior is genuinely required.

Do not create an API endpoint for data that can be:

- generated at build time
- embedded into the page
- handled by a static asset
- handled directly by an external service

When API routes are required:

- validate input
- use correct HTTP methods
- return appropriate status codes
- handle errors explicitly
- protect secrets
- never expose private environment variables to client code

---

# Environment Variables

Never expose secrets to browser-delivered code.

Use the project's established Astro environment-variable conventions.

Only variables intentionally designed for public client use may be exposed to the browser.

Do not hard-code:

- tokens
- API keys
- passwords
- credentials
- private service URLs containing secrets

---

# SEO and Metadata

Codeholics is an editorial website, so metadata is part of implementation.

Pages should provide appropriate:

- `<title>`
- meta description
- canonical URL when appropriate
- Open Graph metadata
- social preview metadata

Article metadata should use the project's established metadata components and content schema rather than reimplementing meta tags on individual pages.

Prefer existing Codeholics SEO components before creating new ones.

Use semantic document structure.

Structured data should be used when it provides meaningful search-engine context.

Do not generate misleading or fabricated structured data.

---

# Accessibility

Accessibility is required during implementation.

Prefer semantic HTML before ARIA.

All interactive behavior must support keyboard use.

Maintain:

- visible focus states
- sufficient contrast
- accessible form labels
- meaningful link text
- meaningful alt text
- reduced-motion support
- correct heading hierarchy

ARIA should supplement missing native semantics, not replace appropriate HTML.

---

# Performance

Performance decisions should favor Astro's static architecture.

Prioritize:

1. static HTML
2. optimized assets
3. minimal CSS
4. zero or minimal client JavaScript
5. selective enhancement

Avoid introducing dependencies for small behaviors that native browser APIs can implement.

Do not hydrate content that does not require client behavior.

Lazy-load below-the-fold media when appropriate.

Avoid cumulative layout shift by preserving dimensions and layout space.

---

# Client Scripts

When a small client script is necessary, keep it close to the component or behavior it controls.

Scripts should:

- query narrowly
- avoid unnecessary globals
- tolerate missing elements
- cleanly initialize
- avoid duplicate event listeners
- respect reduced-motion preferences where animation is involved

If Codeholics ever adopts Astro client-side routing, reevaluate scripts for navigation lifecycle behavior because page navigation differs from normal full document loads.

---

# Validation

After modifying Astro application code, run the appropriate project checks from `/astro`.

At minimum for substantial UI changes:

```bash
npm run build
```

Run additional linting or content validation required by the changed files.

Do not consider a change complete merely because it renders correctly in the development server.

---

# Decision Order

When implementing an Astro feature, prefer:

```text
Existing Codeholics component
        ↓
Astro component
        ↓
Semantic HTML
        ↓
Tailwind / CSS
        ↓
Native browser behavior
        ↓
Small vanilla script / Web Component
        ↓
Astro hydration
        ↓
External client framework
```

Moving farther down this list requires stronger justification.

---

# Core Principle

Codeholics uses Astro because Astro is exceptionally good at producing content-focused websites with minimal client-side overhead.

Do not turn Astro into React with extra steps.

Use the platform.

Ship HTML.

Enhance only where necessary.

### Why this version is better for *your* project

Your repository-level instructions already say Codeholics should default to zero JavaScript, use Astro-native components, and avoid introducing client frameworks. The generic Astro file was quietly contradicting that by saying things like "use framework components for interactive elements." Those two instruction files would have pulled Copilot in opposite directions.

I also intentionally demoted **ClientRouter, SSR, Actions, Sessions, Server Islands, and API routes** from "things you should use" to "things Astro supports when a requirement actually needs them." That's appropriate for a static content site. Astro's current documentation confirms that `ClientRouter` enables client-side routing, whereas native cross-document transitions can retain normal MPA behavior without adding that routing layer. [Astro Previews](https://v7-4.previews.docs.astro.build/en/guides/view-transitions/?utm_source=chatgpt.com)

The Content Collection material remains strong. Astro currently uses `src/content.config.ts`, supports typed collection schemas, and its current Zod integration is based on Zod 4. [Astro Previews](https://v7-4.previews.docs.astro.build/en/guides/content-collections/?utm_source=chatgpt.com)

And the revised image rules line up with current Astro: `<Image />` handles optimized images, while `<Picture />` supports multiple source formats such as AVIF/WebP and responsive image behavior. [Astro Docs](https://docs.astro.build/en/reference/modules/astro-assets/?utm_source=chatgpt.com)

With **this file + your cleaned-up `copilot-instructions.md` + `DESIGN.md` + the four UI skills**, I think your base instruction architecture is complete. I would stop adding foundational instructions after this and start testing it by giving OpenSpec/Copilot a real UI feature to build.