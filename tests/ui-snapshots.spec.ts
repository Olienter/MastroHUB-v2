import { test, expect } from "@playwright/test";

test.describe("UI Component Snapshot Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto("/", { waitUntil: 'networkidle' });

    // Disable animations and transitions for stable screenshots
    await page.addStyleTag({ 
      content: '* { transition: none !important; animation: none !important; }' 
    });

    // Wait for fonts to be ready
    await page.evaluate(() => (document as any).fonts?.ready ?? Promise.resolve());

    // Wait for DOM to be ready (fast, reliable)
    await page.waitForLoadState("domcontentloaded");

    // Wait for critical content to be visible (specific, fast)
    await page.waitForSelector('h1:has-text("MastroHUB v2")', {
      state: "visible",
      timeout: 10000, // 10s instead of 60s
    });
  });

  test("NavBar Component - Desktop View", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for navigation to be visible
    await page.waitForSelector("nav", { state: "visible" });

    // Take screenshot of the entire navigation bar
    const navBar = page.locator("nav");
    await expect(navBar).toBeVisible();

    // Verify navigation elements are present
    await expect(page.locator('nav a:has-text("MastroHUB")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Documentation")')).toBeVisible();
    await expect(page.locator('nav a:has-text("About")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Login")')).toBeVisible();

    // Take snapshot of navigation bar
    await expect(navBar).toHaveScreenshot("navbar-desktop.png");
  });

  test("NavBar Component - Mobile View", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for navigation to be visible
    await page.waitForSelector("nav", { state: "visible" });

    // Verify mobile menu button is visible
    const mobileMenuButton = page.locator(
      'button[aria-label="Toggle mobile menu"]'
    );
    await expect(mobileMenuButton).toBeVisible();

    // Click mobile menu to open it
    await mobileMenuButton.click();

    // Wait for mobile menu to be visible
    await page.waitForSelector('[data-testid="mobile-menu"]', {
      state: "visible",
    });

    // Take snapshot of mobile navigation
    const navBar = page.locator("nav");
    await expect(navBar).toHaveScreenshot("navbar-mobile-open.png");
  });

  test("Hero Section - Layout and Content", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for hero section to be visible
    await page.waitForSelector('section:has-text("MastroHUB v2")', {
      state: "visible",
    });

    // Verify hero content
    await expect(page.locator('h1:has-text("MastroHUB v2")')).toBeVisible();
    await expect(
      page.locator('p:has-text("Advanced AI-powered quality monitoring")')
    ).toBeVisible();

    // Take snapshot of hero section
    const heroSection = page.locator('section:has-text("MastroHUB v2")');
    await expect(heroSection).toHaveScreenshot("hero-section.png");
  });

  test("Card Components - Feature Grid", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for feature grid to be visible
    await page.waitForSelector("text=AI-Powered", { state: "visible" });

    // Verify all feature cards are present
    await expect(page.locator('h3:has-text("AI-Powered")')).toBeVisible();
    await expect(page.locator('h3:has-text("Real-time")')).toBeVisible();
    await expect(page.locator('h3:has-text("Secure")')).toBeVisible();

    // Take snapshot of feature grid
    const featureGrid = page.locator('[data-testid="feature-grid"]');
    await expect(featureGrid).toHaveScreenshot("feature-grid.png");
  });

  test("Email Form - Card Integration", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for email form to be visible
    await page.waitForSelector("text=Get Started", { state: "visible" });

    // Verify form elements
    await expect(page.locator('h2:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Take snapshot of email form card
    const emailFormCard = page
      .locator("text=Get Started")
      .locator("..")
      .locator("..");
    await expect(emailFormCard).toHaveScreenshot("email-form-card.png");
  });

  test("Responsive Design - Mobile Layout", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for critical content instead of networkidle
    await page.waitForSelector('h1:has-text("MastroHUB v2")', {
      state: "visible",
      timeout: 10000,
    });

    // Verify mobile layout elements
    await expect(page.locator('h1:has-text("MastroHUB v2")')).toBeVisible();
    await expect(page.locator('h2:has-text("Get Started")')).toBeVisible();

    // Take snapshot of mobile layout
    await expect(page).toHaveScreenshot("mobile-layout.png");
  });

  test("Responsive Design - Tablet Layout", async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wait for critical content instead of networkidle
    await page.waitForSelector('h1:has-text("MastroHUB v2")', {
      state: "visible",
      timeout: 10000,
    });

    // Verify tablet layout elements
    await expect(page.locator('h1:has-text("MastroHUB v2")')).toBeVisible();
    await expect(page.locator('h2:has-text("Get Started")')).toBeVisible();

    // Take snapshot of tablet layout
    await expect(page).toHaveScreenshot("tablet-layout.png");
  });

  test("Component Accessibility - Focus States", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();

    // Verify focus state is visible
    await expect(emailInput).toBeFocused();

    // Take snapshot of focused input
    await expect(emailInput).toHaveScreenshot("email-input-focused.png");

    // Navigate to submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.focus();

    // Verify button focus state
    await expect(submitButton).toBeFocused();

    // Take snapshot of focused button
    await expect(submitButton).toHaveScreenshot("submit-button-focused.png");
  });
});
