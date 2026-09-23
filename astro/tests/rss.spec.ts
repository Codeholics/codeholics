import { test, expect } from '@playwright/test';

test.describe('RSS feed', () => {
  test('navbar RSS links point to the Astro feed on desktop and mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const desktopRss = page.locator('header [aria-label="Social links"]').first().getByRole('link', { name: 'RSS' });
    await expect(desktopRss).toHaveAttribute('href', '/rss.xml');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#nav-toggle').click();

    const mobileRss = page.locator('#nav-panel [aria-label="Social links"]').getByRole('link', { name: 'RSS' });
    await expect(mobileRss).toHaveAttribute('href', '/rss.xml');
  });

  test('rss.xml exposes published posts with absolute links and no draft entry', async ({ request }) => {
    const response = await request.get('/rss.xml');

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type'] || '').toContain('xml');

    const body = await response.text();

    expect(body).toContain('<rss');
    expect(body).toContain('<item>');
    expect(body).toContain('https://www.codeholics.com/posts/');
    expect(body).toContain('<description>');
    expect(body).not.toContain('migrating-codeholics-from-pelican-to-astro');
  });
});
