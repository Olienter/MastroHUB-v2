import { test, expect } from "@playwright/test";

test.describe("UI Component Snapshot Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto("/", { waitUntil: "networkidle" });

    // Disable animations and transitions for stable screenshots
    await page.addStyleTag({
      content: "* { transition: none !important; animation: none !important; }",
    });

    // Wait for fonts to be ready
    await page.evaluate(
      () => (document as any).fonts?.ready ?? Promise.resolve()
    );

    // Wait for DOM to be ready (fast, reliable)
    await page.waitForLoadState("domcontentloaded");

    // Wait for critical content to be visible (specific, fast)
    await page.waitForSelector('h1:has-text("MastroHUB")', {
      state: "visible",
      timeout: 10000, // 10s instead of 60s
    });
  });

  test("Hero Section - Desktop View", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for hero section to be visible
    await page.waitForSelector('[data-testid="hero"]', { state: "visible" });

    // Take screenshot of the hero section
    const heroSection = page.locator('[data-testid="hero"]');
    await expect(heroSection).toBeVisible();

    // Verify hero content
    await expect(page.locator('h1:has-text("MastroHUB")')).toBeVisible();
    await expect(
      page.locator(
        '[data-testid="hero"] p:has-text("Premium gastronomy and hospitality magazine")'
      )
    ).toBeVisible();

    // Take snapshot of hero section
    await expect(heroSection).toHaveScreenshot("hero-section-desktop.png");
  });

  test("Hero Section - Mobile View", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for hero section to be visible
    await page.waitForSelector('[data-testid="hero"]', { state: "visible" });

    // Take screenshot of the hero section on mobile
    const heroSection = page.locator('[data-testid="hero"]');
    await expect(heroSection).toBeVisible();

    // Verify hero content on mobile
    await expect(page.locator('h1:has-text("MastroHUB")')).toBeVisible();
    await expect(
      page.locator(
        '[data-testid="hero"] p:has-text("Premium gastronomy and hospitality magazine")'
      )
    ).toBeVisible();

    // Take snapshot of hero section on mobile
    await expect(heroSection).toHaveScreenshot("hero-section-mobile.png");
  });

  test("Articles Section - Layout and Content", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for articles section to be visible
    await page.waitForSelector('[data-testid="articles-column"]', {
      state: "visible",
    });

    // Verify articles content
    await expect(page.locator('h2:has-text("Latest Articles")')).toBeVisible();
    await expect(
      page.locator('[data-testid="article-card"]').first()
    ).toBeVisible();

    // Take snapshot of articles section
    const articlesSection = page.locator('[data-testid="articles-column"]');
    await expect(articlesSection).toHaveScreenshot("articles-section.png");
  });

  test("Sidebar Components - Live Feed and Tags", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for sidebar components to be visible
    await page.waitForSelector('[data-testid="live-feed"]', {
      state: "visible",
    });

    // Verify sidebar components are present
    await expect(page.locator('[data-testid="live-feed"]')).toBeVisible();
    await expect(page.locator('[data-testid="trending-tags"]')).toBeVisible();

    // Take snapshot of sidebar
    const sidebar = page.locator('[data-testid="live-feed"]').locator("..");
    await expect(sidebar).toHaveScreenshot("sidebar-components.png");
  });

  test("Sections Grid - Layout and Content", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for sections grid to be visible
    await page.waitForSelector('h2:has-text("Explore Our Sections")', {
      state: "visible",
    });

    // Verify sections grid elements
    await expect(
      page.locator('h2:has-text("Explore Our Sections")')
    ).toBeVisible();

    // Check for at least one section (more flexible)
    const sectionCards = page.locator("section.bg-brand\\/5 .bg-white");
    await expect(sectionCards.first()).toBeVisible();

    // Take snapshot of sections grid
    const sectionsGrid = page
      .locator('h2:has-text("Explore Our Sections")')
      .locator("..")
      .locator("..");
    await expect(sectionsGrid).toHaveScreenshot("sections-grid.png");
  });

  test("Responsive Design - Mobile Layout", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for critical content
    await page.waitForSelector('h1:has-text("MastroHUB")', {
      state: "visible",
      timeout: 10000,
    });

    // Verify mobile layout elements
    await expect(page.locator('h1:has-text("MastroHUB")')).toBeVisible();
    await expect(page.locator('h2:has-text("Latest Articles")')).toBeVisible();

    // Take snapshot of mobile layout
    await expect(page).toHaveScreenshot("mobile-layout.png");
  });

  test("Responsive Design - Tablet Layout", async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wait for critical content
    await page.waitForSelector('h1:has-text("MastroHUB")', {
      state: "visible",
      timeout: 10000,
    });

    // Verify tablet layout elements
    await expect(page.locator('h1:has-text("MastroHUB")')).toBeVisible();
    await expect(page.locator('h2:has-text("Latest Articles")')).toBeVisible();

    // Take snapshot of tablet layout
    await expect(page).toHaveScreenshot("tablet-layout.png");
  });

  test("Component Accessibility - Focus States", async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to first article card and focus it
    const firstArticle = page.locator('[data-testid="article-card"]').first();
    await firstArticle.click(); // Click to ensure focus
    await firstArticle.focus();

    // Verify focus state is visible
    await expect(firstArticle).toBeFocused();

    // Take snapshot of focused article card
    await expect(firstArticle).toHaveScreenshot("article-card-focused.png");

    // Navigate to trending tag
    const firstTag = page
      .locator('[data-testid="trending-tags"] .bg-brand\\/10')
      .first();
    await firstTag.click(); // Click to ensure focus
    await firstTag.focus();

    // Verify tag focus state
    await expect(firstTag).toBeFocused();

    // Take snapshot of focused tag
    await expect(firstTag).toHaveScreenshot("tag-focused.png");
  });
});
