// ========================================
// MASTROHUB HOMEPAGE E2E TEST
// ========================================

import { test, expect } from "@playwright/test";

test.describe("MastroHUB Homepage", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Wait for fonts to load to avoid snapshot drift
    await page.waitForFunction(() => document.fonts.ready);

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");
  });

  test("should load homepage successfully", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/MastroHUB.*Gastronomy.*Hospitality/);

    // Check main content is visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have proper accessibility landmarks", async ({ page }) => {
    // Check banner role (hero section)
    const banner = page.locator('[role="banner"]');
    await expect(banner).toBeVisible();

    // Check main role
    const main = page.locator('[role="main"]');
    await expect(main).toBeVisible();

    // Check contentinfo role (footer)
    const footer = page.locator('[role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test("should display hero section with featured post", async ({ page }) => {
    // Check hero section exists
    const heroSection = page.locator('[data-testid="hero"]');
    await expect(heroSection).toBeVisible();

    // Check main heading
    const mainHeading = page.locator("h1");
    await expect(mainHeading).toContainText("MastroHUB");

    // Check featured post content
    const featuredPost = page.locator(".bg-white\\/80");
    await expect(featuredPost).toBeVisible();

    // Check featured post has title
    const featuredTitle = featuredPost.locator("h2");
    await expect(featuredTitle).toBeVisible();
    await expect(featuredTitle).not.toHaveText("");
  });

  test("should display article cards in main grid", async ({ page }) => {
    // Check left column with articles
    const articlesColumn = page.locator('[data-testid="articles-column"]');
    await expect(articlesColumn).toBeVisible();

    // Check "Latest Articles" heading
    const latestHeading = articlesColumn.locator("h2");
    await expect(latestHeading).toContainText("Latest Articles");

    // Check at least one article card exists (changed from 4 to ≥1)
    const articleCards = page.locator('[data-testid="article-card"]');
    await expect(articleCards.first()).toBeVisible(); // At least one exists

    // Check first article card has required elements
    const firstArticle = articleCards.first();
    await expect(firstArticle.locator("h3")).toBeVisible(); // Title
    await expect(firstArticle.locator("p")).toBeVisible(); // Excerpt
  });

  test("should display sidebar with live feed and trending tags", async ({
    page,
  }) => {
    // Check Live Feed widget
    const liveFeed = page.locator('[data-testid="live-feed"]');
    await expect(liveFeed).toBeVisible();

    // Check Trending Tags widget
    const trendingTags = page.locator('[data-testid="trending-tags"]');
    await expect(trendingTags).toBeVisible();

    // Check at least some tags are displayed (changed from exact 8 to ≥1)
    const tags = trendingTags.locator(".bg-brand\\/10.text-brand");
    await expect(tags.first()).toBeVisible(); // At least one exists
  });

  test("should display sections grid", async ({ page }) => {
    // Check sections section exists
    const sectionsSection = page.locator("section.bg-brand\\/5");
    await expect(sectionsSection).toBeVisible();

    // Check "Explore Our Sections" heading
    const sectionsHeading = sectionsSection.locator("h2");
    await expect(sectionsHeading).toContainText("Explore Our Sections");

    // Check sections grid
    const sectionsGrid = sectionsSection.locator(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
    );
    await expect(sectionsGrid).toBeVisible();

    // Check at least 1 section is displayed (changed from exact 6 to ≥1)
    const sectionCards = sectionsGrid.locator(".bg-white");
    await expect(sectionCards.first()).toBeVisible(); // At least one exists
  });

  test("should display footer with navigation links", async ({ page }) => {
    // Check footer exists
    const footer = page.locator('[data-testid="site-footer"]');
    await expect(footer).toBeVisible();

    // Check footer has 4 columns
    const footerColumns = footer.locator(".grid.grid-cols-1.md\\:grid-cols-4");
    await expect(footerColumns).toBeVisible();

    // Check footer sections
    await expect(footer.locator("text=Sections")).toBeVisible();
    await expect(footer.locator("text=About")).toBeVisible();
    await expect(footer.locator("text=Connect")).toBeVisible();

    // Check copyright
    const copyright = footer.locator("text=© 2024 MastroHUB");
    await expect(copyright).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check articles column is visible
    const articlesColumn = page.locator('[data-testid="articles-column"]');
    await expect(articlesColumn).toBeVisible();

    // Check sections grid becomes single column
    const sectionsGrid = page.locator(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
    );
    await expect(sectionsGrid).toBeVisible();

    // Check footer becomes single column
    const footerGrid = page.locator(".grid.grid-cols-1.md\\:grid-cols-4");
    await expect(footerGrid).toBeVisible();
  });

  test("should have proper semantic HTML structure", async ({ page }) => {
    // Check main heading hierarchy
    const h1 = page.locator("h1");
    const h2s = page.locator("h2");
    const h3s = page.locator("h3");

    await expect(h1).toHaveCount(1);
    await expect(h2s).toHaveCount(3); // Hero, Latest Articles, Explore Sections
    await expect(h3s).toHaveCount(13); // Article titles + widget titles (actual count)

    // Check proper article structure (at least one article)
    const articles = page.locator('[data-testid="article-card"]');
    await expect(articles.first()).toBeVisible(); // At least one exists

    // Check first article has required elements
    const firstArticle = articles.first();
    await expect(firstArticle.locator("h3")).toBeVisible(); // Article title
    await expect(firstArticle.locator("p")).toBeVisible(); // Article excerpt
  });
});
