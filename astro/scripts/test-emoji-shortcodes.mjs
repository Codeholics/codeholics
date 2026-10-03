import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(scriptDir);
const postsDir = join(projectDir, 'src', 'content', 'posts');
const distPostsDir = join(projectDir, 'dist', 'posts');

const fixtures = [
  {
    fileName: 'emoji-shortcodes-markdown-fixture.md',
    slug: 'emoji-shortcodes-markdown-fixture',
    content: `---
title: "Emoji shortcode Markdown fixture"
date: "2026-10-03 00:00"
slug: "emoji-shortcodes-markdown-fixture"
draft: false
---

Deploying now :rocket:

:not-an-emoji:

\`:rocket:\`

\`\`\`text
:rocket:
\`\`\`
`,
  },
  {
    fileName: 'emoji-shortcodes-mdx-fixture.mdx',
    slug: 'emoji-shortcodes-mdx-fixture',
    content: `---
title: "Emoji shortcode MDX fixture"
date: "2026-10-03 00:00"
slug: "emoji-shortcodes-mdx-fixture"
draft: false
---

Celebrating the release :tada:
`,
  },
];

async function readBuiltFixture(slug) {
  return readFile(join(distPostsDir, slug, 'index.html'), 'utf8');
}

try {
  await Promise.all(
    fixtures.map(({ fileName, content }) => writeFile(join(postsDir, fileName), content, 'utf8')),
  );

  execSync('npm run build', {
    cwd: projectDir,
    stdio: 'inherit',
  });

  const markdownHtml = await readBuiltFixture(fixtures[0].slug);
  const mdxHtml = await readBuiltFixture(fixtures[1].slug);

  assert.match(markdownHtml, /<p>Deploying now 🚀<\/p>/);
  assert.doesNotMatch(markdownHtml, /<p>Deploying now :rocket:<\/p>/);
  assert.match(mdxHtml, /<p>Celebrating the release 🎉<\/p>/);
  assert.doesNotMatch(mdxHtml, /<p>Celebrating the release :tada:<\/p>/);
  assert.match(markdownHtml, /<p>:not-an-emoji:<\/p>/);
  assert.match(markdownHtml, /<p><span[^>]*><code[^>]*>[\s\S]*?:rocket:[\s\S]*?<\/code><\/span><\/p>/);
  assert.match(markdownHtml, /<pre[^>]*><code[^>]*>[\s\S]*?:rocket:[\s\S]*?<\/code><\/pre>/);

  console.log('Emoji shortcode regression tests passed');
} finally {
  await Promise.all(
    fixtures.map(({ fileName }) => rm(join(postsDir, fileName), { force: true })),
  );
}
