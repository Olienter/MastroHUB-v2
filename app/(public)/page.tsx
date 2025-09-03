// ========================================
// MASTROHUB HOMEPAGE - UI BUILD PHASE B
// TALK v1 Format Implementation
// ========================================

/*
## 🎯 CIEĽ
Implementácia TALK v1 formátu pre automatizovanú AI interakciu a compliance tracking

## IMPACT_MAP
- app/(public)/page.tsx - Hlavná stránka s TALK v1 formátom
- .ai/checks/HF-TALK-V1-IMPLEMENTATION-001.txt - Evidence tracking
- .ai/decisions/current-decisions.json - Decision tracking
- scripts/talk-v1-validator.mjs - Compliance validation

## ACCEPTANCE
- TALK v1 format compliance: 100%
- Evidence system: Operational
- Decision tracking: Active
- Automation readiness: Complete

## RISKS_FALLBACK
- Format compliance issues → Automated validation
- Evidence gaps → Pre-commit hook blocking
- Decision tracking failures → Manual intervention required

## NEXT_PROMPT_REQUEST
Cursor, implementuj TALK v1 formát vo všetkých AI interakciách a over compliance
*/

"use client";

import { useState, useEffect } from "react";
import { getHomePageData } from "../../lib/mock-data";
import { HomePageData } from "../../lib/types";
import { Header } from "../../components/layout/Header";
import { HeroSection } from "../../components/sections/HeroSection";
import { FeaturedPostCard } from "../../components/cards/PostCard";
import { PostGrid } from "../../components/sections/PostGrid";
import { LiveNewsSidebar } from "../../components/sections/LiveNewsSidebar";
import { NewsletterSection } from "../../components/sections/NewsletterSection";
import { SectionsGrid } from "../../components/sections/SectionsGrid";
import { TrendingTags } from "../../components/sections/TrendingTags";
import { Container } from "../../components/ui/Container";
import { Skeleton } from "../../components/ui/Skeleton";

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setHomeData(getHomePageData());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main role="main" className="relative">
          {/* Hero Section Skeleton */}
          <section className="relative min-h-[250px] md:min-h-[300px] lg:min-h-[350px] flex items-center justify-center overflow-hidden bg-gray-100">
            <div className="text-center space-y-6">
              <Skeleton variant="title" className="w-64 h-12" />
              <Skeleton variant="text" lines={2} className="w-96" />
              <Skeleton variant="button" className="w-32 h-12" />
            </div>
          </section>

          {/* Main Content Skeleton */}
          <Container variant="wide" className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2 space-y-12">
                {/* Featured Post Skeleton */}
                <section className="text-center">
                  <Skeleton variant="title" className="mx-auto mb-6" />
                  <Skeleton variant="card" className="max-w-2xl mx-auto" />
                </section>

                {/* Posts Grid Skeleton */}
                <PostGrid loading={true} posts={[]} title="" subtitle="" />
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1">
                <div className="space-y-8">
                  <Skeleton variant="title" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton variant="text" key={i} lines={2} />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Ensure homeData is available
  if (!homeData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main role="main" className="relative">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Loading...
              </h1>
              <p className="text-gray-600">
                Please wait while we prepare your content.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <Header />

      <main role="main" className="relative">
        {/* Hero Section - Enhanced */}
        <HeroSection
          title={
            homeData.featuredPost?.title || "Discover the Art of Gastronomy"
          }
          subtitle="Premium Magazine"
          description={
            homeData.featuredPost?.excerpt ||
            "Your premier destination for gastronomy and hospitality insights, featuring exclusive content from world-renowned chefs and industry experts."
          }
          ctaText="Explore Articles"
          ctaLink="/posts"
          backgroundImage={
            homeData.featuredPost?.featuredImage ||
            "/images/placeholders/hero-gastronomy.svg"
          }
        />

        {/* Enhanced Main Content Area - Premium Layout */}
        <Container variant="wide" className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Premium Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced Featured Post Section */}
              <section className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold mb-4 border border-red-200 shadow-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                    Chef&apos;s Pick: This Week&apos;s Must-Read
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Molecular Gastronomy: The Future of Fine Dining
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
                    Chef Heston Blumenthal reveals how science is
                    revolutionizing haute cuisine, transforming traditional
                    cooking into an art form that pushes culinary boundaries.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                      Read Time: 8 min
                    </span>
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                      Difficulty: Advanced
                    </span>
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                      Category: Innovation
                    </span>
                  </div>
                </div>

                {/* Enhanced Featured Post Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative">
                    {homeData?.featuredPost && (
                      <FeaturedPostCard post={homeData.featuredPost} />
                    )}
                  </div>
                </div>
              </section>

              {/* Enhanced Latest Posts Section - Premium Spacing */}
              <section className="relative">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Latest Articles
                  </h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">
                    Stay updated with the newest insights from the gastronomy
                    world
                  </p>
                </div>

                <PostGrid
                  posts={homeData?.latestPosts?.slice(0, 6) || []}
                  title="Latest Articles"
                  subtitle="Stay updated with the newest insights from the gastronomy world"
                  showViewAll={true}
                  viewAllLink="/posts"
                />
              </section>

              {/* Enhanced Popular Posts Section - Premium Spacing */}
              <section className="relative">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium mb-3 border border-orange-200">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                    Trending Now
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Popular Articles
                  </h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">
                    Most read and shared content from our community
                  </p>
                </div>

                <PostGrid
                  posts={homeData?.popularPosts?.slice(0, 6) || []}
                  title="Popular Articles"
                  subtitle="Most read and shared content from our community"
                  showViewAll={true}
                  viewAllLink="/posts/popular"
                />
              </section>

              {/* Enhanced Newsletter Section */}
              <NewsletterSection />
            </div>

            {/* Right Column - Premium Live News Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <LiveNewsSidebar posts={homeData?.latestPosts || []} />
              </div>
            </div>
          </div>
        </Container>

        {/* Enhanced Sections Grid - Premium Spacing */}
        <div className="py-12 bg-gray-50">
          <Container variant="wide">
            <SectionsGrid
              sections={homeData.sections || []}
              title="Explore Our Sections"
              subtitle="Discover curated content across gastronomy and hospitality"
            />
          </Container>
        </div>

        {/* Enhanced Trending Tags - Premium Spacing */}
        <div className="py-12 bg-white">
          <Container variant="wide">
            <TrendingTags
              tags={homeData.trendingTags || []}
              title="Trending Topics"
              subtitle="What's hot in the gastronomy world"
            />
          </Container>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer
        className="bg-gray-900 text-white py-12"
        role="contentinfo"
        data-testid="site-footer"
      >
        <Container variant="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">MastroHUB</h3>
              <p className="text-gray-300 leading-relaxed">
                Premium gastronomy and hospitality magazine delivering exclusive
                insights from world-renowned chefs and industry experts.
              </p>
              <div className="flex space-x-4">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <a
                  href="/instagram"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Sections
              </h4>
              <ul className="space-y-3">
                {homeData?.sections?.slice(0, 4).map((section) => (
                  <li key={section.id}>
                    <a
                      href={`/section/${section.slug}`}
                      className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                    >
                      <span
                        className="text-lg group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      >
                        {section.icon}
                      </span>
                      <span>{section.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">About</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="/team"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/newsletter"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Newsletter
                  </a>
                </li>
                <li>
                  <a
                    href="/social"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Social Media
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 MastroHUB. All rights reserved. | Made with ❤️ for
              gastronomy enthusiasts
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
