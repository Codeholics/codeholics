import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const projectDir = join(import.meta.dirname, '..');
const postsDir = join(projectDir, 'src', 'content', 'posts');
const distDir = join(projectDir, 'dist');
const prefix = 'social-sharing-regression-fixture';
const title = 'Quotes " & <angles> </title><script>alert(1)</script>';
const summary = 'Summary with "quotes", an ampersand & <markup>.';
const fixtures = [
  {
    slug: `${prefix}-summary`,
    data: { title, summary, thumbnail: 'https://images.example.test/social.jpg' },
  },
  {
    slug: `${prefix}-blank`,
    data: { title: 'Blank optional values', summary: '   ', thumbnail: '   ' },
  },
  {
    slug: `${prefix}-missing`,
    data: { title: 'Missing optional values' },
    mdx: true,
  },
  {
    slug: `${prefix}-draft`,
    data: { title: 'Unpublished fixture', draft: true },
  },
];
const body = 'A **formatted** paragraph with a [link](https://example.test) and readable text.';
const created = [];
let browser;

try {
  for (const fixture of fixtures) {
    const file = join(postsDir, `${fixture.slug}.${fixture.mdx ? 'mdx' : 'md'}`);
    const data = { date: '2026-10-01 00:00', slug: fixture.slug, ...fixture.data };
    const frontmatter = Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
    const imports = fixture.mdx ? "import Layout from '../../layouts/Layout.astro';\n\n" : '';
    await writeFile(file, `---\n${frontmatter}\n---\n\n${imports}${body}\n`, { flag: 'wx' });
    created.push({ file, slug: fixture.slug });
  }

  execSync('npm run build', {
    cwd: projectDir,
    env: { ...process.env, SITE_URL: '' },
    stdio: 'inherit',
  });

  browser = await chromium.launch();
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const fixture of fixtures.filter(({ data }) => !data.draft)) {
    const html = await readFile(join(distDir, 'posts', fixture.slug, 'index.html'), 'utf8');
    const metadata = await page.evaluate((source) => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      const values = {};
      for (const element of doc.head.querySelectorAll('meta[property], meta[name]')) {
        const key = element.getAttribute('property') || element.getAttribute('name');
        (values[key] ??= []).push(element.getAttribute('content'));
      }
      return {
        values,
        titles: Array.from(doc.head.querySelectorAll('title'), (el) => el.textContent),
        injectedScript: Array.from(doc.scripts).some((el) => el.textContent === 'alert(1)'),
      };
    }, html);
    const description = fixture.data.summary?.trim() || 'A formatted paragraph with a link and readable text.';
    const image = fixture.data.thumbnail?.trim() || 'https://www.codeholics.com/assets/og-default.png';
    assert.deepEqual(metadata.titles, [fixture.data.title]);
    assert.equal(metadata.injectedScript, false);
    for (const [key, expected] of Object.entries({
      'og:title': fixture.data.title,
      'twitter:title': fixture.data.title,
      'og:description': description,
      'twitter:description': description,
      description,
      'og:image': image,
      'twitter:image': image,
      'og:type': 'article',
      'og:url': `https://www.codeholics.com/posts/${fixture.slug}/`,
    })) {
      assert.deepEqual(metadata.values[key], [expected], `${fixture.slug}: ${key}`);
    }
    if (fixture.data.thumbnail?.trim()) {
      assert.equal(metadata.values['og:image:width'], undefined);
      assert.equal(metadata.values['og:image:height'], undefined);
    }
  }
  await assert.rejects(readFile(join(distDir, 'posts', `${prefix}-draft`, 'index.html')), { code: 'ENOENT' });
  const listing = await readFile(join(distDir, 'posts', 'index.html'), 'utf8');
  const rss = await readFile(join(distDir, 'rss.xml'), 'utf8');
  assert.ok(!listing.includes(`${prefix}-draft`));
  assert.ok(!rss.includes(`${prefix}-draft`));
  console.log('Social sharing fixtures passed: escaping, external images, blank/missing metadata, MDX excerpts, and draft exclusion.');
} finally {
  await browser?.close();
  for (const { file, slug } of created) {
    await rm(file);
    await rm(join(distDir, 'posts', slug), { recursive: true, force: true });
  }
}
