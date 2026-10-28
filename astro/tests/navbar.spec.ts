import { test, expect, type Page } from '@playwright/test';

async function readDesktopHeaderMetrics(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('header nav');
    const searchButton = document.getElementById('search-btn');
    const themeToggle = document.getElementById('theme-toggle');

    if (!(nav instanceof HTMLElement) || !(searchButton instanceof HTMLElement) || !(themeToggle instanceof HTMLElement)) {
      throw new Error('Desktop header metrics are unavailable');
    }

    const navRect = nav.getBoundingClientRect();
    const searchRect = searchButton.getBoundingClientRect();
    const themeRect = themeToggle.getBoundingClientRect();

    return {
      navLeft: navRect.left,
      navWidth: navRect.width,
      searchLeft: searchRect.left,
      themeLeft: themeRect.left,
    };
  });
}

async function readThemeState(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const bodyStyle = window.getComputedStyle(document.body);
    const rgb = (bodyStyle.backgroundColor.match(/\d+/g) || []).slice(0, 3).map(Number);
    const [r = 0, g = 0, b = 0] = rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return {
      mode: root.dataset.themeMode ?? null,
      resolved: root.dataset.theme ?? (root.classList.contains('dark') ? 'dark' : 'light'),
      stored: window.localStorage.getItem('theme'),
      backgroundColor: bodyStyle.backgroundColor,
      brightness,
    };
  });
}

test.describe('Navbar', () => {
  test('Header and desktop nav are visible', async ({ page }) => {
    // desktop viewport (set before navigation so responsive classes take effect)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Brand/title scoped to header
    await expect(header.getByRole('link', { name: 'Codeholics' })).toBeVisible();

    // Desktop nav links (should be visible at md+) - scope to the first <nav> inside header (desktop nav)
    const desktopNav = header.locator('nav').first();
    await expect(desktopNav.getByRole('link', { name: '~/', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Coding', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'SysAdmin', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'InfoSec', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'OS', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Hardware', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Reviews', exact: true })).toBeVisible();
  });

  test('Mobile hamburger toggles mobile menu', async ({ page }) => {
    // mobile viewport (set before navigation so responsive classes take effect)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    const toggle = page.locator('#nav-toggle');
    await expect(toggle).toBeVisible();

    // Panel should be hidden initially
    const panel = page.locator('#nav-panel');
    await expect(panel).toBeHidden();

    // Click to open
    await toggle.click();
    await expect(panel).toBeVisible();

    // Links inside panel
    await expect(panel.getByRole('link', { name: '~/' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Coding' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Reviews' })).toBeVisible();
  });

  test('Theme toggle cycles through dark, light, and auto modes and persists selection', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();

    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'dark',
      resolved: 'dark',
      stored: 'dark',
    });

    await page.reload();

    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'dark',
      resolved: 'dark',
      stored: 'dark',
    });

    await themeToggle.click();

    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'light',
      resolved: 'light',
      stored: 'light',
    });

    await themeToggle.click();

    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'auto',
      resolved: 'light',
      stored: 'auto',
    });
  });

  test('Theme selector makes light mode visibly distinct and auto follows system preference', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();
    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'dark',
      resolved: 'dark',
      stored: 'dark',
    });
    const darkState = await readThemeState(page);

    await themeToggle.click();
    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'light',
      resolved: 'light',
      stored: 'light',
    });
    const lightState = await readThemeState(page);

    expect(lightState.backgroundColor).not.toBe(darkState.backgroundColor);
    expect(lightState.brightness).toBeGreaterThan(darkState.brightness);

    await themeToggle.click();
    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'auto',
      resolved: 'light',
      stored: 'auto',
    });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();

    await expect.poll(() => readThemeState(page)).toMatchObject({
      mode: 'auto',
      resolved: 'dark',
      stored: 'auto',
    });
  });

  test('Desktop search opens without shifting the desktop header layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const before = await readDesktopHeaderMetrics(page);

    await page.locator('#search-btn').click();
    await expect(page.locator('#desktop-search-form')).toBeVisible();

    const after = await readDesktopHeaderMetrics(page);

    expect(after.navLeft).toBe(before.navLeft);
    expect(after.navWidth).toBe(before.navWidth);
    expect(after.searchLeft).toBe(before.searchLeft);
    expect(after.themeLeft).toBe(before.themeLeft);
  });

  test('Desktop search opens and closes accessibly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const searchButton = page.locator('#search-btn');
    const searchForm = page.locator('#desktop-search-form');
    const searchInput = page.locator('#desktop-search-input');

    await expect(searchButton).toBeVisible();
    await expect(searchButton).toHaveAttribute('aria-expanded', 'false');
    await expect(searchForm).toBeHidden();

    await searchButton.click();

    await expect(searchButton).toHaveAttribute('aria-expanded', 'true');
    await expect(searchForm).toBeVisible();
    await expect(searchInput).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(searchButton).toHaveAttribute('aria-expanded', 'false');
    await expect(searchForm).toBeHidden();
    await expect(searchButton).toBeFocused();
  });

  test('Desktop and mobile search forms target the site search page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.locator('#desktop-search-form')).toHaveAttribute('action', '/search.html');
    await expect(page.locator('#desktop-search-input')).toHaveAttribute('name', 'q');

    await expect(page.locator('#nav-panel form')).toHaveAttribute('action', '/search.html');
    await expect(page.locator('#mobile-search-input')).toHaveAttribute('name', 'q');
  });

  test('Desktop search submits to the Astro search page and shows results', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await page.locator('#search-btn').click();
    await page.locator('#desktop-search-input').fill('docker');
    await page.locator('#desktop-search-form').press('Enter');

    await expect(page).toHaveURL(/\/search\.html\?q=docker$/);
    await expect(page.locator('h1')).toHaveText('Search');
    await expect(page.locator('#search-status')).toContainText('docker');
    await expect(page.locator('#search-results article').first()).toBeVisible();
  });

  test('Desktop search is keyboard reachable and labelled', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const searchButton = page.getByRole('button', { name: 'Search' });

    for (let i = 0; i < 20; i += 1) {
      await page.keyboard.press('Tab');
      if (await searchButton.evaluate((node) => node === document.activeElement)) {
        break;
      }
    }

    await expect(searchButton).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(page.locator('#desktop-search-input')).toBeFocused();
  });

  test('Keyboard flow opens and closes the mobile menu accessibly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const toggle = page.locator('#nav-toggle');
    const panel = page.locator('#nav-panel');

    await toggle.focus();
    await page.keyboard.press('Enter');

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(page.locator('#nav-panel a').first()).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});


const PRIMARY_DESTINATIONS = [
  { name: '~/', href: '/' },
  { name: 'Coding', href: '/tags/coding' },
  { name: 'SysAdmin', href: '/tags/sysadmin' },
  { name: 'InfoSec', href: '/tags/infosec' },
  { name: 'OS', href: '/tags/os' },
  { name: 'Hardware', href: '/tags/hardware' },
  { name: 'Projects', href: '/projects/' },
  { name: 'Reviews', href: '/tags/review' },
];

const LAYOUT_PAGES = ['/', '/tags/coding/', '/posts/migrating-codeholics-from-pelican-to-astro/', '/projects/'];
const LAYOUT_WIDTHS = [320, 375, 767, 768, 1023, 1024, 1279, 1280, 1536];

const desktopNav = (page: Page) => page.locator('header nav[aria-label="Primary"]');
const appBarSocial = (page: Page) => page.locator('header > div:first-child [aria-label="Social links"]');
const drawerSocial = (page: Page) => page.locator('#nav-panel [aria-label="Social links"]');
const footerSocial = (page: Page) => page.locator('footer nav[aria-labelledby="footer-social-heading"]');

async function readHeaderLayout(page: Page) {
  return page.evaluate(() => {
    const header = document.querySelector('body > header')!;
    const brandLink = header.querySelector('a[href="/"]') as HTMLElement;
    const brand = header.querySelector('.theme-appbar-brand') as HTMLElement;
    const lineHeight = parseFloat(getComputedStyle(brand).lineHeight);
    const isShown = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
    };
    const controls = Array.from(header.querySelectorAll('a, button'))
      .filter((element) => !element.closest('#nav-panel') && !element.closest('#desktop-search-form'))
      .filter(isShown)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.getAttribute('aria-label') ?? element.textContent?.trim(), left: rect.left, right: rect.right };
      });
    const inlineLinks = Array.from(header.querySelectorAll('nav[aria-label="Primary"] a')).filter(isShown);

    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      headerHeight: header.getBoundingClientRect().height,
      brandLines: brand.getClientRects().length,
      brandHeight: brandLink.getBoundingClientRect().height,
      lineHeight,
      outsideControls: controls.filter((control) => control.left < -0.5 || control.right > window.innerWidth + 0.5),
      inlineFontSizes: [...new Set(inlineLinks.map((link) => getComputedStyle(link).fontSize))],
      inlineLinkMinHeight: Math.min(...inlineLinks.map((link) => link.getBoundingClientRect().height)),
      themeToggleHeight: document.getElementById('theme-toggle')!.getBoundingClientRect().height,
    };
  });
}

type Rgba = [number, number, number, number];

function parseColor(value: string): Rgba {
  const parts = (value.match(/[\d.]+/g) ?? []).map(Number);
  const [r = 0, g = 0, b = 0, a = 1] = parts;
  return [r, g, b, parts.length > 3 ? a : 1];
}

function composite(top: Rgba, bottom: Rgba): Rgba {
  const [r, g, b, a] = top;
  return [r * a + bottom[0] * (1 - a), g * a + bottom[1] * (1 - a), b * a + bottom[2] * (1 - a), 1];
}

function luminance([r, g, b]: Rgba) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground: Rgba, background: Rgba) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

async function readVariableColors(page: Page, variables: string[]) {
  return page.evaluate((names) => Object.fromEntries(names.map((name) => {
    const probe = document.createElement('span');
    probe.style.backgroundColor = `var(${name})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return [name, color];
  })), variables);
}

/** Lowest contrast of a foreground against a translucent surface composited over each page-gradient stop. */
async function minContrastOnSurface(page: Page, foreground: string, surfaceVariable: string) {
  const colors = await readVariableColors(page, [surfaceVariable, '--bg', '--bg-accent']);
  const surface = parseColor(colors[surfaceVariable]);
  return Math.min(...['--bg', '--bg-accent'].map((stop) =>
    contrast(parseColor(foreground), composite(surface, parseColor(colors[stop])))));
}

async function openWithTheme(page: Page, path: string, theme: 'light' | 'dark', width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript((mode) => window.localStorage.setItem('theme', mode), theme);
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(path);
}

test.describe('Navbar breakpoints', () => {
  for (const width of [767, 768, 1023]) {
    test(`uses the menu drawer at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(page.locator('#nav-toggle')).toBeVisible();
      await expect(desktopNav(page)).toBeHidden();

      await page.locator('#nav-toggle').click();
      const panel = page.locator('#nav-panel');
      await expect(panel).toBeVisible();
      for (const destination of PRIMARY_DESTINATIONS) {
        await expect(panel.getByRole('link', { name: destination.name, exact: true })).toHaveAttribute('href', destination.href);
      }
    });
  }

  for (const width of [1024, 1279, 1280]) {
    test(`shows inline navigation at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(page.locator('#nav-toggle')).toBeHidden();
      for (const destination of PRIMARY_DESTINATIONS) {
        await expect(desktopNav(page).getByRole('link', { name: destination.name, exact: true })).toBeVisible();
      }
    });
  }

  test('an open drawer resets when the viewport crosses into the desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 900 });
    await page.goto('/');

    const toggle = page.locator('#nav-toggle');
    await toggle.click();
    await expect(page.locator('#nav-panel')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.setViewportSize({ width: 1100, height: 900 });

    await expect(page.locator('#nav-panel')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(desktopNav(page)).toBeVisible();
  });
});

test.describe('Navbar layout fits every width', () => {
  for (const path of LAYOUT_PAGES) {
    test(`no overflow and a single-line brand on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: LAYOUT_WIDTHS[0], height: 900 });
      await page.goto(path);

      const headerHeights = new Map<number, number>();
      for (const width of LAYOUT_WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        const layout = await readHeaderLayout(page);
        const label = `${path} @ ${width}px`;

        expect(layout.scrollWidth, label).toBeLessThanOrEqual(layout.viewportWidth);
        expect(layout.brandLines, label).toBe(1);
        expect(Math.abs(layout.brandHeight - layout.lineHeight), label).toBeLessThanOrEqual(1);
        expect(layout.outsideControls, label).toEqual([]);

        if (width >= 1024) {
          expect(layout.inlineFontSizes, label).toHaveLength(1);
          expect(layout.inlineLinkMinHeight, label).toBeGreaterThanOrEqual(layout.themeToggleHeight);
        }
        headerHeights.set(width, layout.headerHeight);
      }

      // Identical across the 1024/1279/1280px desktop boundaries and between the drawer and inline layouts.
      expect(new Set(headerHeights.values()).size, `${path} header heights ${JSON.stringify([...headerHeights])}`).toBe(1);
    });
  }
});

test.describe('Navbar light-mode readability at desktop widths', () => {
  for (const width of [1024, 1280]) {
    test(`app-bar text and icons stay readable at ${width}px`, async ({ page }) => {
      await openWithTheme(page, '/', 'light', width);

      const colors = await page.evaluate(() => ({
        brand: getComputedStyle(document.querySelector('.theme-appbar-brand')!).color,
        links: Array.from(document.querySelectorAll('header nav[aria-label="Primary"] a'), (link) => getComputedStyle(link).color),
        icons: Array.from(document.querySelectorAll('#search-btn, #theme-toggle'), (icon) => getComputedStyle(icon).color),
      }));

      expect(await minContrastOnSurface(page, colors.brand, '--header-bg')).toBeGreaterThanOrEqual(4.5);
      for (const link of colors.links) {
        expect(await minContrastOnSurface(page, link, '--header-bg')).toBeGreaterThanOrEqual(4.5);
      }
      for (const icon of colors.icons) {
        expect(await minContrastOnSurface(page, icon, '--header-bg')).toBeGreaterThanOrEqual(3);
      }
    });

    test(`desktop search stays in place and inside the viewport at ${width}px`, async ({ page }) => {
      await openWithTheme(page, '/', 'light', width);

      const before = await desktopNav(page).boundingBox();
      await page.locator('#search-btn').click();
      const form = page.locator('#desktop-search-form');
      await expect(form).toBeVisible();
      await expect(page.locator('#desktop-search-input')).toBeFocused();

      expect(await desktopNav(page).boundingBox()).toEqual(before);
      const box = (await form.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
});

test.describe('Social links at every width', () => {
  for (const width of [1280, 1536]) {
    test(`app-bar social links are visible at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(appBarSocial(page)).toBeVisible();
      await expect(appBarSocial(page).getByRole('link')).toHaveCount(4);
      await expect(footerSocial(page)).toBeVisible();
    });
  }

  for (const width of [1024, 1279]) {
    test(`footer social group replaces the app-bar group at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(appBarSocial(page)).toBeHidden();
      await expect(page.locator('#nav-toggle')).toBeHidden();
      await expect(footerSocial(page)).toBeVisible();
    });
  }

  for (const width of [375, 768, 1023]) {
    test(`drawer and footer provide social links at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect(appBarSocial(page)).toBeHidden();
      await page.locator('#nav-toggle').click();
      await expect(drawerSocial(page).getByRole('link')).toHaveCount(4);
      await expect(drawerSocial(page)).toBeVisible();
      await expect(footerSocial(page)).toBeVisible();
    });
  }

  test('footer social group is a dedicated, accessible icon group separate from the copyright', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const group = footerSocial(page);
    await expect(group.getByRole('heading', { name: 'Follow Codeholics' })).toBeVisible();

    const expected = [
      { name: 'X', href: 'https://twitter.com/root_codeholics', external: true },
      { name: 'Facebook', href: 'https://www.facebook.com/RootCodeholics', external: true },
      { name: 'Github', href: 'https://www.github.com/Codeholics', external: true },
      { name: 'RSS', href: '/rss.xml', external: false },
    ];
    await expect(group.getByRole('link')).toHaveCount(expected.length);
    for (const link of expected) {
      const locator = group.getByRole('link', { name: link.name, exact: true });
      await expect(locator).toHaveAttribute('href', link.href);
      if (link.external) {
        await expect(locator).toHaveAttribute('target', '_blank');
        await expect(locator).toHaveAttribute('rel', 'noopener noreferrer');
      }
      const box = (await locator.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    const separated = await page.evaluate(() => {
      const nav = document.querySelector('footer nav[aria-labelledby="footer-social-heading"]')!;
      const copyright = Array.from(document.querySelectorAll('footer *')).find((element) =>
        element.children.length === 0 && element.textContent?.includes('©'))!;
      return !nav.contains(copyright) && nav.getBoundingClientRect().bottom <= copyright.getBoundingClientRect().top;
    });
    expect(separated).toBe(true);
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`footer icons and focus rings meet 3:1 contrast in ${theme} mode`, async ({ page }) => {
      await openWithTheme(page, '/', theme, 1280);

      const links = footerSocial(page).getByRole('link');
      for (let index = 0; index < 4; index += 1) {
        const link = links.nth(index);
        await link.focus();
        await expect.poll(() => link.evaluate((element) => getComputedStyle(element).boxShadow))
          .toMatch(/rgb\(\d+, \d+, \d+\) 0px 0px 0px 2px/);
        const styles = await link.evaluate((element) => ({
          color: getComputedStyle(element).color,
          ring: getComputedStyle(element).boxShadow,
        }));
        const ringColor = (styles.ring.match(/rgba?\([^)]*\)/g) ?? []).find((color) => parseColor(color)[3] > 0);
        expect(ringColor, `focus ring for link ${index}`).toBeTruthy();
        expect(await minContrastOnSurface(page, styles.color, '--surface-bg')).toBeGreaterThanOrEqual(3);
        expect(await minContrastOnSurface(page, ringColor!, '--surface-bg')).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
