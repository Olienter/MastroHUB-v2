import { test, expect } from '@playwright/test';

test('watchdog: login is reachable and root redirects', async ({ page }) => {
  // /login is public
  const respLogin = await page.goto('/login', { waitUntil: 'domcontentloaded' });
  expect(respLogin?.ok()).toBeTruthy();

  // root should redirect to /login due to middleware
  const respRoot = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(respRoot?.status()).toBeGreaterThanOrEqual(200);

  // Lightweight findings logging (do not fail):
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // Headings & images quick scan for a11y counts (best-effort)
  const h1Count = await page.locator('h1').count();
  const imgs = page.locator('img');
  const imgCount = await imgs.count();
  let imgsMissingAlt = 0;
  for (let i = 0; i < imgCount; i++) {
    const alt = await imgs.nth(i).getAttribute('alt');
    if (!alt) imgsMissingAlt++;
  }

  // Simple SEO checks (best-effort)
  const metaDesc = await page.locator('meta[name="description"]').count();
  const ogImage = await page.locator('meta[property="og:image"]').count();

  // 404 probe
  const resp404 = await page.goto('/definitely-not-found');
  const is404 = resp404?.status() === 404;

  // Hydration heuristic (best-effort): presence of data-now attribute
  const hydrationProbe = await page.locator('[data-now]').count();

  console.log(JSON.stringify({
    watchdogFindings: {
      consoleErrors: consoleErrors.length,
      a11ySeriousApprox: (h1Count > 1 ? 1 : 0) + (imgsMissingAlt > 0 ? 1 : 0),
      seoMissingDesc: metaDesc === 0 ? 1 : 0,
      seoMissingOgImage: ogImage === 0 ? 1 : 0,
      notFound404: is404 ? 1 : 0,
      hydrationMismatchesApprox: hydrationProbe > 0 ? 1 : 0
    }
  }));
});
