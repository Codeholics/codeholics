import { test, expect } from '@playwright/test';

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
    await expect(desktopNav.locator('a', { hasText: 'Home' })).toBeVisible();
    await expect(desktopNav.locator('a', { hasText: 'About' })).toBeVisible();
    await expect(desktopNav.locator('a', { hasText: 'Posts' })).toBeVisible();
    await expect(desktopNav.locator('a', { hasText: 'Tags' })).toBeVisible();
    await expect(desktopNav.locator('a', { hasText: 'Categories' })).toBeVisible();
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
    await expect(panel.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'About' })).toBeVisible();
  });
});
