# Tasks

## 1. Render post-card thumbnails

- [x] 1.1 Update the shared post-card component to conditionally render a linked, styled thumbnail from the optional frontmatter value; verify a thumbnail post and a thumbnail-free post render without broken or empty image markup.
- [x] 1.2 Verify the post collection's thumbnail schema remains optional and accepts the root-relative public URL used by the first post; verify `npm run lint:post-metadata -- --file src/content/posts/the-death-of-the-self-taught-hacker.md` reports no new metadata issues.

## 2. Publish the first image-enabled post

- [x] 2.1 Move the supplied image reference from `beyond-flock-the-quiet-standardization-of-Mass-Sureillance-(tldr).md` to `the-death-of-the-self-taught-hacker.md` as its `thumbnail`, using `/images/Posts/the-death-of-the-self-taught-hacker/The-Hacker-and-the-Server-Fortress.webp`; verify no Windows-style image path remains in post thumbnail metadata.
- [x] 2.2 Add the supplied image to the self-taught hacker post with descriptive Markdown alternative text; verify the source uses standard Markdown image syntax and the same root-relative public URL.
- [x] 2.3 Document the public asset location, optional `thumbnail` frontmatter, and Markdown image syntax in the Astro README; verify the examples use root-relative URLs.

## 3. Validate production output

- [x] 3.1 Run `npm run build` from `astro/` and verify the production build completes successfully.
- [x] 3.2 Inspect the generated home or posts listing and the self-taught hacker page to verify the card thumbnail and in-post image use the supplied public URL, while a post without thumbnail metadata has no image element.
