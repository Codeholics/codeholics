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
    fileName: 'github-markdown-alerts-markdown-fixture.md',
    slug: 'github-markdown-alerts-markdown-fixture',
    content: `---
title: "GitHub Markdown alerts Markdown fixture"
date: "2026-10-03 00:00"
slug: "github-markdown-alerts-markdown-fixture"
draft: false
---

> [!NOTE]
> A note alert.

> [!TIP]
> A tip alert.

> [!IMPORTANT]
> An important alert.

> [!WARNING]
> A warning alert.

> [!CAUTION]
> A caution alert.

> An ordinary quotation.

> [!CUSTOM]
> An unsupported alert marker.
`,
  },
  {
    fileName: 'github-markdown-alerts-mdx-fixture.mdx',
    slug: 'github-markdown-alerts-mdx-fixture',
    content: `---
title: "GitHub Markdown alerts MDX fixture"
date: "2026-10-03 00:00"
slug: "github-markdown-alerts-mdx-fixture"
draft: false
---

> [!note]
> A case-insensitive MDX note alert.
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

  for (const type of ['note', 'tip', 'important', 'warning', 'caution']) {
    assert.match(
      markdownHtml,
      new RegExp(`<div class="markdown-alert markdown-alert-${type}"`),
      `Expected the ${type.toUpperCase()} alert to render as a callout.`,
    );
  }

  assert.doesNotMatch(markdownHtml, /\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
  assert.match(markdownHtml, /<blockquote>\s*<p>An ordinary quotation\.<\/p>\s*<\/blockquote>/);
  assert.match(markdownHtml, /<blockquote>\s*<p>\[!CUSTOM\]\s+An unsupported alert marker\.<\/p>\s*<\/blockquote>/);
  assert.match(mdxHtml, /<div class="markdown-alert markdown-alert-note"/);
  assert.doesNotMatch(mdxHtml, /\[!note\]/i);

  console.log('GitHub Markdown alert regression tests passed');
} finally {
  await Promise.all(
    fixtures.map(({ fileName }) => rm(join(postsDir, fileName), { force: true })),
  );
}
