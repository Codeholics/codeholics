import { test, expect } from '@playwright/test';

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

  test('Theme toggle persists across reloads', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.classList.contains('dark'));
    }).toBe(true);

    await page.reload();

    await expect.poll(async () => {
      return page.evaluate(() => ({
        dark: document.documentElement.classList.contains('dark'),
        stored: window.localStorage.getItem('theme'),
      }));
    }).toEqual({ dark: true, stored: 'dark' });
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
