import { test, expect } from "@playwright/test";

test.describe("UI Smoke Test - MastroHUB v2", () => {
  test("Root page smoke test", async ({ page }) => {
    // Navigate to root page
    await page.goto("/");

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/MastroHUB/i);

    // Verify MastroHUB in title (case-insensitive)
    await expect(page).toHaveTitle(/MastroHUB/i);

    // Verify MastroHUB in H1 (case-insensitive)
    const h1Element = page.locator("h1");
    await expect(h1Element).toContainText(/MastroHUB/i);

    // Check if mobile toggle exists and test it (only if visible)
    const mobileToggle = page.locator('[aria-controls="mobile-menu"]');
    if ((await mobileToggle.count()) > 0 && (await mobileToggle.isVisible())) {
      // Mobile toggle exists and is visible, test it
      await expect(mobileToggle).toBeVisible();

      // Click mobile toggle
      await mobileToggle.click();

      // Verify aria-expanded is true
      await expect(mobileToggle).toHaveAttribute("aria-expanded", "true");

      // Verify mobile menu is visible
      const mobileMenu = page.locator("#mobile-menu");
      await expect(mobileMenu).toBeVisible();
    }

    // Take screenshot for evidence
    await page.screenshot({ path: "screenshots/ui-smoke-root.png" });
  });
});
