import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const origin = 'https://www.codeholics.com';
const postRoute = '/posts/the-death-of-the-self-taught-hacker/';
const postImage = '/images/Posts/the-death-of-the-self-taught-hacker/The-Hacker-and-the-Server-Fortress.webp';
const fallbackImage = '/assets/og-default.png';

async function metadata(page: Page, html: string) {
  return page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const values: Record<string, string[]> = {};
    for (const element of doc.head.querySelectorAll('meta[name], meta[property]')) {
      const key = element.getAttribute('property') || element.getAttribute('name')!;
      (values[key] ??= []).push(element.getAttribute('content')!);
    }
    return {
      values,
      titles: Array.from(doc.head.querySelectorAll('title'), (el) => el.textContent),
      canonicals: Array.from(doc.head.querySelectorAll('link[rel="canonical"]'), (el) => el.getAttribute('href')),
      icons: Array.from(doc.head.querySelectorAll('link[rel="icon"]'), (el) => el.getAttribute('href')),
      cards: Array.from(doc.querySelectorAll('article a img'), (el) => ({
        href: el.parentElement?.getAttribute('href'),
        src: el.getAttribute('src'),
      })),
    };
  }, html);
}

test('homepage and listing expose consistent metadata in raw HTML', async ({ request, page }) => {
  for (const route of ['/', '/posts/']) {
    const response = await request.get(`${route}?tracking=test`);
    expect(response.ok()).toBeTruthy();
    const { values, titles, canonicals, icons } = await metadata(page, await response.text());
    expect(titles).toEqual(['Codeholics']);
    expect(canonicals).toEqual([`${origin}${route}`]);
    expect(values['og:url']).toEqual(canonicals);
    expect(values['og:title']).toEqual(titles);
    expect(values['og:description']).toEqual(values.description);
    expect(values.description[0]).toContain('software, hardware, and systems');
    expect(values['og:type']).toEqual(['website']);
    expect(values['og:site_name']).toEqual(['Codeholics']);
    expect(values['og:image']).toEqual([`${origin}${fallbackImage}`]);
    expect(values['og:image:width']).toEqual(['1200']);
    expect(values['og:image:height']).toEqual(['630']);
    expect(values['og:image:type']).toEqual(['image/png']);
    expect(values['twitter:card']).toEqual(['summary_large_image']);
    for (const key of ['title', 'description', 'image']) {
      expect(values[`twitter:${key}`]).toEqual(values[`og:${key}`]);
      expect(values[`og:${key}`]).toHaveLength(1);
    }
    expect(values['fb:app_id']).toEqual(['966242223397117']);
    expect(icons).toContain('/favicon/favicon.svg');
    expect(icons).toContain('/favicon/favicon.ico');
  }
});

test('default share image is a reachable 1200x630 PNG derived from the supplied hero', async ({ request }) => {
  const response = await request.get(fallbackImage);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('image/png');
  const png = await response.body();
  const info = await sharp(png).metadata();
  expect([info.format, info.width, info.height]).toEqual(['png', 1200, 630]);
  const expected = await sharp(await readFile('public/images/Codeholics-Hero.webp'))
    .resize(1200, 630, { fit: 'cover' }).png().toBuffer();
  expect(png.equals(expected)).toBeTruthy();
});

test('published post uses its own title, summary, image, and canonical route', async ({ request, page }) => {
  const response = await request.get(postRoute);
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  const { values, titles, canonicals } = await metadata(page, html);
  const title = 'The Death of the Self-Taught Hacker: Why Restricting AI to Big Tech Is a Threat to Everyone';
  const summary = 'Why restricting AI to big tech and governments would shut down independent learning, centralize power, and kill the open, self-taught culture that built modern computing.';
  expect(titles).toEqual([title]);
  expect(canonicals).toEqual([`${origin}${postRoute}`]);
  expect(values['og:url']).toEqual(canonicals);
  expect(values['og:title']).toEqual([title]);
  expect(values['og:description']).toEqual([summary]);
  expect(values.description).toEqual([summary]);
  expect(values['og:type']).toEqual(['article']);
  expect(values['og:site_name']).toEqual(['Codeholics']);
  expect(values['og:image']).toEqual([`${origin}${postImage}`]);
  expect(values['og:image:width']).toBeUndefined();
  expect(values['og:image:height']).toBeUndefined();
  expect(values['twitter:card']).toEqual(['summary_large_image']);
  for (const key of ['title', 'description', 'image']) {
    expect(values[`twitter:${key}`]).toEqual(values[`og:${key}`]);
  }
  expect(html).toContain('The Dangerous Illusion of Centralized Safety');
  expect(html).toContain(`<img src="${postImage}"`);
  const image = await request.get(postImage);
  expect(image.ok()).toBeTruthy();
  expect(image.headers()['content-type']).toContain('image/webp');

  const home = await request.get('/');
  const { cards } = await metadata(page, await home.text());
  const postCards = cards.filter(({ href }) => href === '/posts/the-death-of-the-self-taught-hacker');
  expect(postCards.length).toBeGreaterThan(0);
  expect(postCards.every(({ src }) => src === postImage)).toBeTruthy();
});

test('legacy post uses excerpt and default image without changing body', async ({ request, page }) => {
  const route = '/posts/get-the-exit-code-of-a-bash-command/';
  const response = await request.get(route);
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  const { values, canonicals } = await metadata(page, html);
  expect(canonicals).toEqual([`${origin}${route}`]);
  expect(values['og:description'][0]).toContain('If you want to see the exit status of a Linux shell command');
  expect(values['og:description'][0]).not.toContain('`');
  expect(values['og:image']).toEqual([`${origin}${fallbackImage}`]);
  expect(values['twitter:image']).toEqual(values['og:image']);
  expect(values['twitter:description']).toEqual(values['og:description']);
  expect(html).toContain('This will return the exit status of the last command.');
});

test('backslash-authored thumbnail emits a reachable normalized URL', async ({ request, page }) => {
  const response = await request.get('/posts/beyond-flock-the-quiet-standardization-of-mass-surveillance-(tldr)/');
  expect(response.ok()).toBeTruthy();
  const { values } = await metadata(page, await response.text());
  const imagePath = '/images/Posts/beyond-flock-the-quiet-standardization-of-Mass-Sureillance-(tldr)/AI-Traffic-Surveillance-Network.webp';
  expect(values['og:image']).toEqual([`${origin}${imagePath}`]);
  expect(values['twitter:image']).toEqual(values['og:image']);
  expect(values['og:image:width']).toBeUndefined();
  const image = await request.get(imagePath);
  expect(image.ok()).toBeTruthy();
  expect(image.headers()['content-type']).toContain('image/webp');
});
