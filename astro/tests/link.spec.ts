import { test, expect } from '@playwright/test';

// Check that internal site links do not return 404+ status codes
test('internal links return non-404', async ({ page, request, baseURL }) => {
  const origin = baseURL ?? 'http://localhost:3000';
  await page.goto('/');

  // collect hrefs from anchors in the main content area and header/nav/footer
  const hrefs = await page.locator('a').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')));
  const unique = Array.from(new Set(hrefs.filter(Boolean)));

  const internal = unique.filter((h) => typeof h === 'string' && (h.startsWith('/') || (!h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('#'))));

  expect(internal.length).toBeGreaterThan(0);

  for (const href of internal) {
    const url = new URL(href as string, origin).toString();
    const resp = await request.get(url);
    expect(resp.status(), `Link ${href} should not be 404`).toBeLessThan(400);
  }
});
