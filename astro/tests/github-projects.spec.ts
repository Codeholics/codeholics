import { test, expect } from '@playwright/test';

const myProjects = 'section[aria-labelledby="my-projects-heading"]';

test.beforeEach(async ({ page }) => {
  const githubApiRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'api.github.com') {
      githubApiRequests.push(request.url());
    }
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/projects/');
  expect(githubApiRequests).toEqual([]);
  await expect(page.getByRole('heading', { level: 1, name: 'Featured Projects' })).toBeVisible();
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

test('hero uses decorative concept artwork and remains readable at desktop and mobile widths', async ({ page }) => {
  const hero = page.locator('.projects-hero');
  const heroImage = hero.locator('.projects-hero-art img');
  const heading = hero.getByRole('heading', { level: 1, name: 'Featured Projects' });
  const summary = hero.locator('.projects-summary');

  await expect(heroImage).toHaveAttribute(
    'src',
    /\/images\/projects\/cyberpunk_developer_desk_under_moonlight_fullsize\.png$/,
  );
  await expect(hero.locator('.projects-hero-art')).toHaveAttribute('aria-hidden', 'true');
  await expect(heroImage).toHaveAttribute('alt', '');
  await expect(heroImage).toBeVisible();
  await expect.poll(() => heroImage.evaluate((image: HTMLImageElement) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }))).toEqual({ width: 1920, height: 768 });
  await expect(heading).toBeVisible();
  await expect(summary).toBeVisible();

  const desktop = await hero.evaluate((element) => {
    const art = element.querySelector('.projects-hero-art')!.getBoundingClientRect();
    const copy = element.querySelector('.projects-hero-copy')!.getBoundingClientRect();
    const image = element.querySelector('img')!;
    const styles = getComputedStyle(element);
    const nav = document.querySelector('body > header')!.getBoundingClientRect();
    return {
      heroWidth: element.getBoundingClientRect().width,
      artLeft: art.left,
      artTop: art.top,
      artWidth: art.width,
      artHeight: art.height,
      navBottom: nav.bottom,
      imageRatio: image.naturalWidth / image.naturalHeight,
      copyLeft: copy.left,
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
      objectFit: getComputedStyle(image).objectFit,
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
  expect(desktop.columns).toBe(2);
  expect(desktop.artLeft).toBeGreaterThan(desktop.copyLeft);
  expect(desktop.objectFit).toBe('cover');
  expect(Math.abs(desktop.artTop - desktop.navBottom)).toBeLessThanOrEqual(1);
  expect(Math.abs(desktop.artWidth / desktop.artHeight - desktop.imageRatio)).toBeLessThan(0.03);
  expect(desktop.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(desktop.borderTopWidth).toBe('0px');
  expect(desktop.borderRightWidth).toBe('0px');
  expect(desktop.borderLeftWidth).toBe('0px');
  expect(desktop.borderBottomWidth).toBe('1px');
  expect(desktop.borderRadius).toBe('0px');
  expect(desktop.boxShadow).toBe('none');
  expect(desktop.scrollWidth).toBeLessThanOrEqual(desktop.viewportWidth);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(heading).toBeVisible();
  await expect(summary).toBeVisible();
  const mobile = await hero.evaluate((element) => ({
    heroWidth: element.getBoundingClientRect().width,
    artWidth: element.querySelector('.projects-hero-art')!.getBoundingClientRect().width,
    artTop: element.querySelector('.projects-hero-art')!.getBoundingClientRect().top,
    navBottom: document.querySelector('body > header')!.getBoundingClientRect().bottom,
    columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(mobile.columns).toBe(1);
  expect(mobile.artWidth).toBeLessThanOrEqual(mobile.heroWidth);
  expect(Math.abs(mobile.artTop - mobile.navBottom)).toBeLessThanOrEqual(1);
  expect(mobile.scrollWidth).toBeLessThanOrEqual(mobile.viewportWidth);
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
});

test('card text remains readable in light and dark themes', async ({ page }) => {
  const card = page.locator(`${myProjects} .project-card`).first();
  const contrast = async () => card.evaluate((element) => {
    const parseColor = (value: string) => value.match(/[\d.]+/g)!.map(Number);
    const composite = (foreground: number[], background: number[]) => {
      const alpha = foreground[3] ?? 1;
      return foreground.slice(0, 3).map((channel, index) =>
        channel * alpha + background[index] * (1 - alpha));
    };
    const luminance = (color: number[]) => {
      const channels = color.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const ratio = (foreground: number[], background: number[]) => {
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };

    const bodyColor = parseColor(getComputedStyle(document.body).backgroundColor);
    const pageColor = composite(
      parseColor(getComputedStyle(document.querySelector('main')!).backgroundColor),
      bodyColor,
    );
    const cardColor = composite(parseColor(getComputedStyle(element).backgroundColor), pageColor);
    const title = parseColor(getComputedStyle(element.querySelector('.project-card-title')!).color);
    const description = parseColor(getComputedStyle(element.querySelector('.project-description')!).color);
    return {
      title: ratio(title, cardColor),
      description: ratio(description, cardColor),
    };
  });

  const light = await contrast();
  expect(light.title).toBeGreaterThanOrEqual(4.5);
  expect(light.description).toBeGreaterThanOrEqual(4.5);

  await page.locator('html').evaluate((element) => element.classList.add('dark'));
  const dark = await contrast();
  expect(dark.title).toBeGreaterThanOrEqual(4.5);
  expect(dark.description).toBeGreaterThanOrEqual(4.5);
});
