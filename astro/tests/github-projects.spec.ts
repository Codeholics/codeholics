import { test, expect, type Locator, type Page } from '@playwright/test';

type ThemeMode = 'light' | 'dark' | 'auto';
type ColorScheme = 'light' | 'dark';

interface OpenOptions {
  width?: number;
  height?: number;
  theme?: ThemeMode;
  colorScheme?: ColorScheme;
  reducedMotion?: 'reduce' | 'no-preference';
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const myProjects = 'section[aria-labelledby="my-projects-heading"]';
const curatedProjects = 'section[aria-labelledby="curated-projects-heading"]';
const heroImageName = 'cyberpunk_developer_desk_under_moonlight_fullsize';
const heroWidths = [320, 375, 640, 641, 768, 1024, 1280, 1536];
const themes: ColorScheme[] = ['light', 'dark'];
const opposite = (scheme: ColorScheme): ColorScheme => (scheme === 'light' ? 'dark' : 'light');

async function openProjects(page: Page, options: OpenOptions = {}) {
  const { width = 1280, height = 900, theme, colorScheme, reducedMotion } = options;
  const githubApiRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'api.github.com') {
      githubApiRequests.push(request.url());
    }
  });

  if (colorScheme || reducedMotion) {
    await page.emulateMedia({ colorScheme, reducedMotion });
  }
  if (theme) {
    // Seed the saved preference once so later reloads exercise persistence rather than reseeding.
    await page.addInitScript((mode) => {
      if (sessionStorage.getItem('projects-theme-seeded')) return;
      localStorage.setItem('theme', mode);
      sessionStorage.setItem('projects-theme-seeded', 'true');
    }, theme);
  }

  await page.setViewportSize({ width, height });
  await page.goto('/projects/');
  expect(githubApiRequests).toEqual([]);
  await expect(page.getByRole('heading', { level: 1, name: 'Featured Projects' })).toBeVisible();
  return githubApiRequests;
}

async function readTheme(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    return {
      mode: root.dataset.themeMode ?? null,
      resolved: root.dataset.theme ?? null,
      darkClass: root.classList.contains('dark'),
      stored: localStorage.getItem('theme'),
    };
  });
}

async function expectResolvedTheme(page: Page, resolved: ColorScheme, mode?: ThemeMode) {
  await expect.poll(() => readTheme(page)).toMatchObject({
    resolved,
    darkClass: resolved === 'dark',
    ...(mode ? { mode } : {}),
  });
}

function parseColor(value: string): number[] {
  const channels = value.match(/-?[\d.]+/g)!.map(Number);
  if (value.startsWith('color(')) {
    return [channels[0] * 255, channels[1] * 255, channels[2] * 255, channels[3] ?? 1];
  }
  return [channels[0], channels[1], channels[2], channels[3] ?? 1];
}

/** Samples the rendered pixels in `clip` and returns the worst contrast against `color`, ignoring pixels inside `exclude`. */
async function worstContrast(page: Page, clip: Rect, color: string, exclude?: Rect) {
  const viewport = page.viewportSize()!;
  const bounded = {
    x: Math.max(0, Math.ceil(clip.x)),
    y: Math.max(0, Math.ceil(clip.y)),
    width: 0,
    height: 0,
  };
  // Round inward so anti-aliased neighbours (such as borders) are not sampled as backdrop.
  bounded.width = Math.min(viewport.width, Math.floor(clip.x + clip.width)) - bounded.x;
  bounded.height = Math.min(viewport.height, Math.floor(clip.y + clip.height)) - bounded.y;
  expect(bounded.width).toBeGreaterThan(0);
  expect(bounded.height).toBeGreaterThan(0);

  const image = (await page.screenshot({ clip: bounded, animations: 'disabled' })).toString('base64');
  return page.evaluate(async ({ image, foreground, offset, exclude }) => {
    const element = new Image();
    element.src = `data:image/png;base64,${image}`;
    await element.decode();
    const canvas = document.createElement('canvas');
    canvas.width = element.naturalWidth;
    canvas.height = element.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(element, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

    const luminance = (color: number[]) => {
      const channels = color.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };

    let worst = Infinity;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const pageX = offset.x + x;
        const pageY = offset.y + y;
        if (
          exclude &&
          pageX >= exclude.x && pageX < exclude.x + exclude.width &&
          pageY >= exclude.y && pageY < exclude.y + exclude.height
        ) {
          continue;
        }
        const index = (y * canvas.width + x) * 4;
        const backdrop = [data[index], data[index + 1], data[index + 2]];
        const alpha = foreground[3];
        const text = foreground.slice(0, 3).map((channel, channelIndex) =>
          channel * alpha + backdrop[channelIndex] * (1 - alpha));
        const values = [luminance(text), luminance(backdrop)].sort((a, b) => b - a);
        worst = Math.min(worst, (values[0] + 0.05) / (values[1] + 0.05));
      }
    }
    return worst;
  }, { image, foreground: parseColor(color), offset: bounded, exclude: exclude && {
    // Snap outward so partially covered edge pixels of the excluded element are not treated as surroundings.
    x: Math.floor(exclude.x),
    y: Math.floor(exclude.y),
    width: Math.ceil(exclude.x + exclude.width) - Math.floor(exclude.x),
    height: Math.ceil(exclude.y + exclude.height) - Math.floor(exclude.y),
  } });
}

async function revealBelowHeader(locator: Locator) {
  await locator.evaluate((element) => {
    const header = document.querySelector('body > header')!.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    // Keep the current scroll (and any hover) when the element is already clear of the sticky header.
    if (rect.top >= header.bottom + 4 && rect.bottom <= window.innerHeight - 4) return;
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
}

async function hideText(page: Page) {
  const style = await page.addStyleTag({
    // Language swatches are decorative fills, not text backdrop.
    content: '*, *::before, *::after { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; } .project-language-dot { visibility: hidden !important; }',
  });
  return () => style.evaluate((element) => element.remove());
}

/** Measures each element's text color against its actual rendered backdrop with the glyphs hidden. */
async function textContrast(page: Page, targets: Record<string, Locator>) {
  const ratios: Record<string, number> = {};
  for (const [name, locator] of Object.entries(targets)) {
    await revealBelowHeader(locator);
    const { rect, color } = await locator.evaluate((element) => {
      const styles = getComputedStyle(element);
      const { x, y, width, height } = element.getBoundingClientRect();
      const inset = (side: 'Top' | 'Right' | 'Bottom' | 'Left') =>
        Number.parseFloat(styles[`border${side}Width`]) + Number.parseFloat(styles[`padding${side}`]);
      const top = inset('Top');
      const right = inset('Right');
      const bottom = inset('Bottom');
      const left = inset('Left');
      // Sample the content box: borders, rounded corners, and padding edges are not the text backdrop.
      return {
        rect: { x: x + left, y: y + top, width: width - left - right, height: height - top - bottom },
        color: styles.color,
      };
    });

    const restore = await hideText(page);
    ratios[name] = await worstContrast(page, rect, color);
    await restore();
  }
  return ratios;
}

/** Returns the fraction of pixels in the ring band (outer minus inner) that render the outline color. */
async function ringCoverage(page: Page, outer: Rect, inner: Rect, color: string) {
  const image = (await page.screenshot({
    clip: {
      x: Math.floor(outer.x),
      y: Math.floor(outer.y),
      width: Math.ceil(outer.x + outer.width) - Math.floor(outer.x),
      height: Math.ceil(outer.y + outer.height) - Math.floor(outer.y),
    },
    animations: 'disabled',
  })).toString('base64');
  return page.evaluate(async ({ image, target, outer, inner }) => {
    const element = new Image();
    element.src = `data:image/png;base64,${image}`;
    await element.decode();
    const canvas = document.createElement('canvas');
    canvas.width = element.naturalWidth;
    canvas.height = element.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(element, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const originX = Math.floor(outer.x);
    const originY = Math.floor(outer.y);
    let band = 0;
    let painted = 0;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        // Use pixel centres and keep a half-pixel margin from both band edges to avoid anti-aliasing.
        const pageX = originX + x + 0.5;
        const pageY = originY + y + 0.5;
        const insideOuter = pageX >= outer.x + 0.5 && pageX <= outer.x + outer.width - 0.5
          && pageY >= outer.y + 0.5 && pageY <= outer.y + outer.height - 0.5;
        const insideInner = pageX >= inner.x - 0.5 && pageX <= inner.x + inner.width + 0.5
          && pageY >= inner.y - 0.5 && pageY <= inner.y + inner.height + 0.5;
        if (!insideOuter || insideInner) continue;
        band += 1;
        const index = (y * canvas.width + x) * 4;
        const distance = Math.abs(data[index] - target[0])
          + Math.abs(data[index + 1] - target[1])
          + Math.abs(data[index + 2] - target[2]);
        if (distance <= 24) painted += 1;
      }
    }
    return band === 0 ? 0 : painted / band;
  }, { image, target: parseColor(color), outer, inner });
}

/** Measures a focus outline against the unfocused pixels beneath its ring and confirms the ring is not clipped. */
async function focusRingContrast(page: Page, locator: Locator, name = 'element') {
  await revealBelowHeader(locator);
  await locator.focus();
  const ring = await locator.evaluate((element) => {
    const styles = getComputedStyle(element);
    const { x, y, width, height } = element.getBoundingClientRect();
    const offset = Number.parseFloat(styles.outlineOffset);
    const outline = Number.parseFloat(styles.outlineWidth);
    return {
      style: styles.outlineStyle,
      color: styles.outlineColor,
      inner: { x: x - offset, y: y - offset, width: width + offset * 2, height: height + offset * 2 },
      outer: {
        x: x - offset - outline,
        y: y - offset - outline,
        width: width + (offset + outline) * 2,
        height: height + (offset + outline) * 2,
      },
    };
  });
  expect(ring.style).toBe('solid');
  // Rounded outline corners leave some band pixels unpainted; a clipped ring shows only one or two sides (<0.5).
  expect.soft(await ringCoverage(page, ring.outer, ring.inner, ring.color), `${name} focus ring painted`)
    .toBeGreaterThanOrEqual(0.7);
  await locator.evaluate((element) => (element as HTMLElement).blur());
  const restore = await hideText(page);
  const ratio = await worstContrast(page, ring.outer, ring.color, ring.inner);
  await restore();
  return ratio;
}

/** Measures a control's border (its selected or hover state indicator) against the pixels just outside it. */
async function borderContrast(page: Page, locator: Locator) {
  await revealBelowHeader(locator);
  const box = await locator.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { color: getComputedStyle(element).borderTopColor, x, y, width, height };
  });
  const restore = await hideText(page);
  const ratio = await worstContrast(
    page,
    { x: box.x - 2, y: box.y - 2, width: box.width + 4, height: box.height + 4 },
    box.color,
    box,
  );
  await restore();
  return ratio;
}

test.describe('default presentation', () => {
  test.beforeEach(async ({ page }) => {
    await openProjects(page);
  });

  test('repository cards link safely to GitHub and expose visible keyboard focus', async ({ page }) => {
    const links = page.locator(`${myProjects} .project-card-link`);
    await expect(links).toHaveCount(4);

    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/Codeholics\//);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }

    const firstLink = links.first();
    const secondLink = links.nth(1);
    await firstLink.focus();
    await page.keyboard.press('Tab');
    await expect(secondLink).toBeFocused();
    await expect(secondLink).toHaveCSS('outline-style', 'solid');
    await expect(secondLink).toHaveCSS('outline-width', '3px');
  });

  test('Projects navigation opens the page and the homepage has no project panel', async ({ page }) => {
    const projectsNav = page.getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Projects' });
    await expect(projectsNav).toHaveAttribute('href', '/projects/');

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).toHaveCount(0);
    await expect(page.locator('aside .project-card')).toHaveCount(0);

    await page.locator('header').getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Featured Projects' })).toBeVisible();
  });

  test('category tabs expose selected state and support keyboard navigation', async ({ page }) => {
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    const first = page.getByRole('tab', { name: 'AI Tools' });
    const second = page.getByRole('tab', { name: 'Docker & Homelabs' });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#curated-panel-ai-tools')).toBeVisible();
    await expect(page.locator('#curated-panel-docker-homelabs')).toBeHidden();

    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(first).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('#curated-panel-ai-tools')).toBeHidden();
    await expect(page.locator('#curated-panel-docker-homelabs')).toBeVisible();
  });

  test('project cards and page fit narrow and wide viewports', async ({ page }) => {
    const grid = page.locator(`${myProjects} .featured-projects-grid`);

    await page.setViewportSize({ width: 375, height: 812 });
    const narrowLayout = await grid.evaluate((element) => ({
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      cardWidths: Array.from(element.querySelectorAll('.project-card'), (card) =>
        card.getBoundingClientRect().width),
    }));
    expect(narrowLayout.columns).toBe(1);
    expect(narrowLayout.pageWidth).toBeLessThanOrEqual(narrowLayout.viewportWidth);
    expect(narrowLayout.cardWidths.every((width) => width <= narrowLayout.viewportWidth)).toBeTruthy();

    await page.setViewportSize({ width: 1280, height: 900 });
    const wideLayout = await grid.evaluate((element) => ({
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
      cardWidth: element.querySelector('.project-card')!.getBoundingClientRect().width,
      mainWidth: document.querySelector('main')!.getBoundingClientRect().width,
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(wideLayout.columns).toBeGreaterThanOrEqual(2);
    expect(wideLayout.cardWidth).toBeLessThan(wideLayout.mainWidth);
    expect(wideLayout.pageWidth).toBeLessThanOrEqual(wideLayout.viewportWidth);

    // Long repository names must truncate rather than run under the Static badge.
    for (const width of [375, 768, 1280, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      await grid.evaluate((element) => {
        const name = element.querySelector('.project-card-link span')!;
        name.textContent = 'Codeholics/an-exceptionally-long-repository-name-for-layout-testing';
      });
      const overlaps = await grid.evaluate((element) =>
        Array.from(element.querySelectorAll('.project-card')).filter((card) => {
          const link = card.querySelector('.project-card-link')!.getBoundingClientRect();
          const badge = card.querySelector('.project-static-badge')?.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          return link.right > (badge ? badge.left : cardRect.right) + 0.5;
        }).length);
      expect(overlaps, `${width}px`).toBe(0);
    }
  });
});

test('hero serves the optimized WebP artwork as decorative, prioritized imagery', async ({ page }) => {
  const heroRequests: string[] = [];
  const webpResponses: import('@playwright/test').Response[] = [];
  page.on('request', (request) => {
    if (request.url().includes(heroImageName)) heroRequests.push(request.url());
  });
  page.on('response', (response) => {
    if (response.url().includes(`${heroImageName}.webp`)) webpResponses.push(response);
  });

  await openProjects(page);
  const hero = page.locator('.projects-hero');
  const heroImage = hero.locator('.projects-hero-art img');

  await expect(heroImage).toHaveAttribute('src', new RegExp(`/images/projects/${heroImageName}\\.webp$`));
  await expect(heroImage).toHaveAttribute('width', '1983');
  await expect(heroImage).toHaveAttribute('height', '793');
  await expect(heroImage).toHaveAttribute('fetchpriority', 'high');
  await expect(heroImage).not.toHaveAttribute('loading', 'lazy');
  await expect(hero.locator('.projects-hero-art')).toHaveAttribute('aria-hidden', 'true');
  await expect(heroImage).toHaveAttribute('alt', '');
  await expect(heroImage).toBeVisible();
  await expect.poll(() => heroImage.evaluate((image: HTMLImageElement) => ({
    currentSrc: new URL(image.currentSrc).pathname,
    width: image.naturalWidth,
    height: image.naturalHeight,
  }))).toEqual({
    currentSrc: `/images/projects/${heroImageName}.webp`,
    width: 1983,
    height: 793,
  });

  expect(webpResponses.length).toBeGreaterThan(0);
  const response = webpResponses[0];
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/webp');
  const body = await response.body();
  expect(body.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(body.subarray(8, 12).toString('ascii')).toBe('WEBP');

  expect(heroRequests.filter((url) => /\.png(?:$|\?)/.test(url))).toEqual([]);
  await expect(page.locator(`link[rel="preload"][href*="${heroImageName}.png"]`)).toHaveCount(0);
});

for (const theme of themes) {
  test(`hero follows the ${theme} theme with readable copy across widths`, async ({ page }) => {
    await openProjects(page, { theme, colorScheme: opposite(theme) });
    await expectResolvedTheme(page, theme, theme);

    const hero = page.locator('.projects-hero');
    const heroImage = hero.locator('.projects-hero-art img');
    await expect.poll(() => heroImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth))
      .toBeGreaterThan(0);

    const tokens = await hero.evaluate((element) => {
      const resolve = (variable: string) => {
        const probe = document.createElement('span');
        probe.style.color = `var(${variable})`;
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      };
      const colorOf = (selector: string) => getComputedStyle(element.querySelector(selector)!).color;
      return {
        title: [colorOf('.projects-title'), resolve('--page-heading')],
        summary: [colorOf('.projects-summary'), resolve('--muted')],
        eyebrow: [colorOf('.projects-eyebrow'), resolve('--accent')],
        divider: [getComputedStyle(element).borderBottomColor, (() => {
          const probe = document.createElement('span');
          probe.style.borderBottom = '1px solid var(--surface-border)';
          document.body.append(probe);
          const color = getComputedStyle(probe).borderBottomColor;
          probe.remove();
          return color;
        })()],
      };
    });
    for (const [actual, expected] of Object.values(tokens)) {
      expect(actual).toBe(expected);
    }

    for (const width of heroWidths) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 0));

      const layout = await hero.evaluate((element) => {
        const art = element.querySelector('.projects-hero-art')!.getBoundingClientRect();
        const copy = element.querySelector('.projects-hero-copy')!.getBoundingClientRect();
        const image = element.querySelector('img')!;
        const styles = getComputedStyle(element);
        const nav = document.querySelector('body > header')!.getBoundingClientRect();
        return {
          heroWidth: element.getBoundingClientRect().width,
          artLeft: art.left,
          artTop: art.top,
          artBottom: art.bottom,
          artWidth: art.width,
          artHeight: art.height,
          copyLeft: copy.left,
          copyTop: copy.top,
          navBottom: nav.bottom,
          imageRatio: image.naturalWidth / image.naturalHeight,
          columns: styles.gridTemplateColumns.split(' ').length,
          objectFit: getComputedStyle(image).objectFit,
          filter: getComputedStyle(image).filter,
          backgroundColor: styles.backgroundColor,
          borderTopWidth: styles.borderTopWidth,
          borderRightWidth: styles.borderRightWidth,
          borderLeftWidth: styles.borderLeftWidth,
          borderBottomWidth: styles.borderBottomWidth,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      const label = `${theme} @ ${width}px`;
      expect(layout.scrollWidth, label).toBeLessThanOrEqual(layout.viewportWidth);
      expect(Math.abs(layout.artTop - layout.navBottom), label).toBeLessThanOrEqual(1);
      expect(layout.artWidth, label).toBeGreaterThan(0);
      expect(layout.artHeight, label).toBeGreaterThan(0);
      expect(layout.artWidth, label).toBeLessThanOrEqual(layout.heroWidth);
      expect(layout.objectFit, label).toBe('cover');
      expect(layout.filter, label).toBe('none');
      expect(layout.backgroundColor, label).toBe('rgba(0, 0, 0, 0)');
      expect(layout.borderTopWidth, label).toBe('0px');
      expect(layout.borderRightWidth, label).toBe('0px');
      expect(layout.borderLeftWidth, label).toBe('0px');
      expect(layout.borderBottomWidth, label).toBe('1px');
      expect(layout.borderRadius, label).toBe('0px');
      expect(layout.boxShadow, label).toBe('none');

      if (width <= 640) {
        expect(layout.columns, label).toBe(1);
        expect(layout.copyTop, label).toBeGreaterThanOrEqual(layout.artBottom - 1);
      } else {
        expect(layout.columns, label).toBe(2);
        expect(layout.artLeft, label).toBeGreaterThan(layout.copyLeft);
      }
      if (width >= 1280) {
        expect(Math.abs(layout.artWidth / layout.artHeight - layout.imageRatio), label).toBeLessThan(0.03);
      }

      const contrast = await textContrast(page, {
        title: hero.locator('.projects-title'),
        eyebrow: hero.locator('.projects-eyebrow'),
        summary: hero.locator('.projects-summary'),
      });
      expect(contrast.title, `${label} title`).toBeGreaterThanOrEqual(3);
      expect(contrast.eyebrow, `${label} eyebrow`).toBeGreaterThanOrEqual(4.5);
      expect(contrast.summary, `${label} summary`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test(`Projects content and controls stay readable in the ${theme} theme`, async ({ page }) => {
    await openProjects(page, { theme, colorScheme: opposite(theme) });
    await expectResolvedTheme(page, theme, theme);

    const card = page.locator(`${myProjects} .project-card`).first();
    const curated = page.locator(curatedProjects);
    const pageText = await textContrast(page, {
      sectionEyebrow: page.locator(`${myProjects} .projects-eyebrow`),
      sectionHeading: page.locator('#my-projects-heading'),
      allLink: page.locator(`${myProjects} .projects-all-link`),
      cardTitle: card.locator('.project-card-title'),
      cardDescription: card.locator('.project-description'),
      cardMetadata: card.locator('.project-metadata'),
      staticBadge: card.locator('.project-static-badge'),
      curatedEyebrow: curated.locator('.projects-eyebrow'),
      curatedHeading: page.locator('#curated-projects-heading'),
      curatedIntro: curated.locator('.curated-intro'),
      selectedTab: page.getByRole('tab', { selected: true }),
      unselectedTab: page.getByRole('tab', { selected: false }).first(),
      emptyState: curated.locator('.curated-panel:not([hidden]) .curated-empty-state'),
    });
    for (const [name, ratio] of Object.entries(pageText)) {
      expect.soft(ratio, `${theme} ${name}`).toBeGreaterThanOrEqual(4.5);
    }

    await revealBelowHeader(card);
    await card.locator('.project-description').hover();
    const hoveredCard = await textContrast(page, {
      title: card.locator('.project-card-title'),
      description: card.locator('.project-description'),
    });
    expect.soft(hoveredCard.title, `${theme} hovered card title`).toBeGreaterThanOrEqual(4.5);
    expect.soft(hoveredCard.description, `${theme} hovered card description`).toBeGreaterThanOrEqual(4.5);

    await revealBelowHeader(card);
    await card.locator('.project-card-link').hover();
    const hoveredLink = await textContrast(page, { link: card.locator('.project-card-link') });
    expect.soft(hoveredLink.link, `${theme} hovered link`).toBeGreaterThanOrEqual(4.5);

    const allLink = page.locator(`${myProjects} .projects-all-link`);
    await revealBelowHeader(allLink);
    await allLink.hover();
    const hoveredAllLink = await textContrast(page, { link: allLink });
    expect.soft(hoveredAllLink.link, `${theme} hovered all-repositories link`).toBeGreaterThanOrEqual(4.5);
    await page.mouse.move(0, 0);

    const selectedTab = page.getByRole('tab', { selected: true });
    expect.soft(await borderContrast(page, selectedTab), `${theme} selected tab indicator`).toBeGreaterThanOrEqual(3);
    expect.soft(await borderContrast(page, allLink), `${theme} all-repositories link border`).toBeGreaterThanOrEqual(3);

    const focusTargets: Record<string, Locator> = {
      cardLink: card.locator('.project-card-link'),
      allLink,
      tab: selectedTab,
      panel: curated.locator('.curated-panel:not([hidden])'),
    };
    for (const [name, locator] of Object.entries(focusTargets)) {
      expect.soft(await focusRingContrast(page, locator, `${theme} ${name}`), `${theme} ${name} focus ring`).toBeGreaterThanOrEqual(3);
    }

    // Production categories are empty, so populate the active panel with a card clone to cover the populated state.
    const panel = curated.locator('.curated-panel:not([hidden])');
    await panel.evaluate((element, selector) => {
      const source = document.querySelector(`${selector} .project-card`)!.cloneNode(true) as HTMLElement;
      source.querySelector('.project-static-badge')?.remove();
      const grid = document.createElement('div');
      grid.className = 'curated-project-grid';
      for (const attribute of Array.from(element.attributes)) {
        if (attribute.name.startsWith('data-astro-cid')) grid.setAttribute(attribute.name, attribute.value);
      }
      grid.append(source);
      element.replaceChildren(grid);
    }, myProjects);
    const populatedCard = panel.locator('.project-card');
    await expect(populatedCard).toHaveCount(1);
    const populated = await textContrast(page, {
      title: populatedCard.locator('.project-card-title'),
      description: populatedCard.locator('.project-description'),
      metadata: populatedCard.locator('.project-metadata'),
    });
    for (const [name, ratio] of Object.entries(populated)) {
      expect(ratio, `${theme} populated curated ${name}`).toBeGreaterThanOrEqual(4.5);
    }
    expect.soft(await focusRingContrast(page, populatedCard.locator('.project-card-link'), `${theme} populated card link`), `${theme} populated focus ring`)
      .toBeGreaterThanOrEqual(3);
  });
}

test.describe('theme selection', () => {
  async function heroMatchesTheme(page: Page) {
    return page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const probe = (variable: string) => {
        const element = document.createElement('span');
        element.style.color = `var(${variable})`;
        document.body.append(element);
        const color = getComputedStyle(element).color;
        element.remove();
        return color;
      };
      const title = getComputedStyle(document.querySelector('.projects-title')!).color;
      const cardTitle = getComputedStyle(document.querySelector('.project-card-title')!).color;
      const navBrand = getComputedStyle(document.querySelector('.theme-appbar-brand')!).color;
      return {
        colorScheme: root.colorScheme,
        hero: title === probe('--page-heading'),
        cards: cardTitle === probe('--page-heading'),
        nav: navBrand === probe('--header-brand'),
      };
    });
  }

  for (const saved of themes) {
    test(`saved ${saved} preference wins over an opposing OS preference`, async ({ page }) => {
      await openProjects(page, { theme: saved, colorScheme: opposite(saved) });
      await expectResolvedTheme(page, saved, saved);
      expect(await heroMatchesTheme(page)).toEqual({ colorScheme: saved, hero: true, cards: true, nav: true });
    });

    test(`System mode follows a ${saved} OS preference`, async ({ page }) => {
      await openProjects(page, { theme: 'auto', colorScheme: saved });
      await expectResolvedTheme(page, saved, 'auto');
      expect(await heroMatchesTheme(page)).toEqual({ colorScheme: saved, hero: true, cards: true, nav: true });
    });
  }

  test('theme control switches without reload, persists, and System tracks live OS changes', async ({ page }) => {
    await openProjects(page, { theme: 'auto', colorScheme: 'light' });
    await expectResolvedTheme(page, 'light', 'auto');

    const secondTab = page.getByRole('tab', { name: 'Docker & Homelabs' });
    await secondTab.click();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await page.evaluate(() => {
      (window as unknown as { projectsSession: boolean }).projectsSession = true;
    });
    const sameDocument = () => page.evaluate(() =>
      (window as unknown as { projectsSession?: boolean }).projectsSession === true);

    const toggle = page.getByRole('button', { name: 'Toggle theme' });
    await toggle.click();
    await expectResolvedTheme(page, 'dark', 'dark');
    expect(await heroMatchesTheme(page)).toMatchObject({ colorScheme: 'dark', hero: true, cards: true, nav: true });
    await toggle.click();
    await expectResolvedTheme(page, 'light', 'light');
    expect(await heroMatchesTheme(page)).toMatchObject({ colorScheme: 'light', hero: true, cards: true, nav: true });
    expect(await sameDocument()).toBe(true);
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await expectResolvedTheme(page, 'light', 'light');
    expect(await heroMatchesTheme(page)).toMatchObject({ colorScheme: 'light', hero: true });

    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expectResolvedTheme(page, 'dark', 'auto');
    await page.emulateMedia({ colorScheme: 'light' });
    await expectResolvedTheme(page, 'light', 'auto');
    expect(await heroMatchesTheme(page)).toMatchObject({ colorScheme: 'light', hero: true, cards: true, nav: true });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expectResolvedTheme(page, 'dark', 'auto');
    expect(await heroMatchesTheme(page)).toMatchObject({ colorScheme: 'dark', hero: true, cards: true, nav: true });
  });
});

for (const theme of themes) {
  test(`keyboard focus stays visible with reduced motion on mobile in the ${theme} theme`, async ({ page }) => {
    await openProjects(page, {
      width: 320,
      height: 720,
      theme,
      colorScheme: opposite(theme),
      reducedMotion: 'reduce',
    });
    await expectResolvedTheme(page, theme, theme);

    const motion = await page.evaluate(() => {
      const hero = document.querySelector('.projects-hero')!;
      const heroElements = [hero, ...Array.from(hero.querySelectorAll('*'))];
      return {
        heroScripts: hero.querySelectorAll('script').length,
        heroAnimated: heroElements.some((element) => {
          const styles = getComputedStyle(element);
          return styles.animationName !== 'none' || styles.transitionDuration.split(',').some((value) => Number.parseFloat(value) > 0);
        }),
        cardTransition: getComputedStyle(document.querySelector('.project-card')!).transitionDuration,
      };
    });
    expect(motion).toEqual({ heroScripts: 0, heroAnimated: false, cardTransition: '0s' });

    const links = page.locator(`${myProjects} .project-card-link`);
    await links.first().focus();
    for (let index = 1; index < 4; index += 1) {
      await page.keyboard.press('Tab');
      await expect(links.nth(index)).toBeFocused();
      await expect(links.nth(index)).toBeInViewport();
      await expect(links.nth(index)).toHaveCSS('outline-style', 'solid');
    }

    const firstTab = page.getByRole('tab', { name: 'AI Tools' });
    const lastTab = page.getByRole('tab', { name: 'Developer Tools' });
    await firstTab.focus();
    await page.keyboard.press('End');
    await expect(lastTab).toBeFocused();
    await expect(lastTab).toHaveAttribute('aria-selected', 'true');
    await expect(lastTab).toHaveCSS('outline-style', 'solid');

    const tabRow = await page.locator('.curated-tabs').evaluate((element) => {
      const row = element.getBoundingClientRect();
      const tab = element.querySelector('[aria-selected="true"]')!.getBoundingClientRect();
      return {
        overflowX: getComputedStyle(element).overflowX,
        tabInsideRow: tab.left >= row.left - 1 && tab.right <= row.right + 1,
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    expect(tabRow.overflowX).toBe('auto');
    expect(tabRow.tabInsideRow).toBe(true);
    expect(tabRow.pageWidth).toBeLessThanOrEqual(tabRow.viewportWidth);
  });
}
