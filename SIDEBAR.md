# Mermaid

>[!warning]
> Requires disabling Shiki (syntax highlighter for this lang)

We need to configure mermaid in astro because it does not work out of the box. 

- We can do this by installing the `rehype-mermaid` plugin. [Install instructions](https://orchestrator.dev/blog/2025-12-08-astro-mermaid-integration)


1.  Dependencies: (Playwright is required because Mermaid renders SVGs at build time.)
```
npm install rehype-mermaid
npm install playwright
npx playwright install
```
2. Update `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],   // REQUIRED
    },
    rehypePlugins: [rehypeMermaid],
  },
});
```
3. Use Mermaid in Markdown

# Full Markdown Support

Astro doesn't come out of the box with full markdown support. 


## What Astro supports out of the box

Astro uses remark + rehype under the hood.
By default, you get:

- Standard Markdown
- Code blocks (with Shiki or Prism)
- Headings, lists, links, images
- Frontmatter

But you do NOT get:

- GitHub‑Flavored Markdown (GFM)
- Emoji shortcodes (:smile: → 😄)
- Task lists (- [x])
- Admonitions (:::note)
- Footnotes
- Definition lists
- Mermaid diagrams

To enable these, you add plugins.

## The plugins you need for full Markdown support

### GitHub‑Flavored Markdown (GFM)

This gives you:

- Task lists
- Tables
- Strikethrough
- Autolinks
- Footnotes
- Emoji shortcodes (via remark-gfm)

1. Install
```
npm install remark-gfm
```
2. Add to `astro.config.mjs`:
```js
import remarkGfm from "remark-gfm";

export default {
  markdown: {
    remarkPlugins: [remarkGfm],
  },
};
```

### Emoji support (two options)

1. Option A — via GFM (simple) GFM already supports emoji shortcodes like :star:
2. Option B — full emoji conversion:
```
npm install remark-emoji
```

```js
import remarkEmoji from "remark-emoji";

export default {
  markdown: {
    remarkPlugins: [remarkEmoji],
  },
};
```

### Admonitions (Notes, Tips, Warnings)

Astro does not support admonitions natively.

1. Option A — remark-admonitions
```
npm install remark-admonitions
```

```js
import remarkAdmonitions from "remark-admonitions";

export default {
  markdown: {
    remarkPlugins: [remarkAdmonitions],
  },
};
```
Then you can write:
```
:::note
This is a note.
:::

:::warning
Be careful!
:::
```
2. Option B — remark-directive + custom components (More flexible, but requires extra setup.)

## MDX support

- React‑style components inside Markdown
- Custom interactive blocks
- More flexible admonitions

Install MDX:

```
npm install @astrojs/mdx
```

Add to config:

```js
import mdx from "@astrojs/mdx";

export default {
  integrations: [mdx()],
};
```

# Recommended “Full Markdown Stack” for Astro

```js
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkAdmonitions from "remark-admonitions";
import rehypeMermaid from "rehype-mermaid";

export default {
  markdown: {
    remarkPlugins: [
      remarkGfm,        // task lists, tables, emoji shortcodes
      remarkEmoji,      // optional: full emoji conversion
      remarkAdmonitions // notes, warnings, tips
    ],
    rehypePlugins: [
      rehypeMermaid     // mermaid diagrams
    ],
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"], // required for mermaid
    },
  },
};
```
