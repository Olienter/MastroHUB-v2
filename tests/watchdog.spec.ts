import { test, expect } from "@playwright/test";

test.describe("Watchdog Crawl", () => {
  test("should check console errors and basic functionality", async ({
    page,
  }) => {
    // Navigate to main page
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Basic page checks
    await expect(page).toHaveTitle(/MastroHUB/);

    // Check for main content
    await expect(page.locator("h1")).toBeVisible();

    // Check for navigation
    await expect(page.locator("nav")).toBeVisible();

    // Report console errors
    if (consoleErrors.length > 0) {
      console.log(`Console errors found: ${consoleErrors.length}`);
      consoleErrors.forEach((error) => console.log(`  - ${error}`));
    } else {
      console.log("No console errors found");
    }

    // Basic accessibility check
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").count();
    console.log(`Headings found: ${headings}`);

    // Check for images with alt text
    const images = await page.locator("img").count();
    const imagesWithAlt = await page.locator("img[alt]").count();
    console.log(`Images: ${images}, with alt text: ${imagesWithAlt}`);

    // Performance check
    const loadTime = await page.evaluate(
      () => performance.timing.loadEventEnd - performance.timing.navigationStart
    );
    console.log(`Page load time: ${loadTime}ms`);

    // Basic assertions
    expect(consoleErrors.length).toBeLessThan(5); // Warning threshold
    expect(headings).toBeGreaterThan(0);
    expect(imagesWithAlt).toBeGreaterThanOrEqual(images * 0.8); // 80% should have alt text
  });

  test("should check login page functionality", async ({ page }) => {
    await page.goto("/login");

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check for proper labels
    const emailLabel = await page
      .locator("label")
      .filter({ hasText: "Email" })
      .count();
    const passwordLabel = await page
      .locator("label")
      .filter({ hasText: "Password" })
      .count();

    expect(emailLabel).toBeGreaterThan(0);
    expect(passwordLabel).toBeGreaterThan(0);
  });
});
