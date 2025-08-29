// ========================================
// MASTROHUB HOMEPAGE - UI BUILD PHASE B
// ========================================

import { getHomePageData } from "@/lib/mock-data";
import { Header } from "../../components/layout/Header";
import { HeroSection } from "../../components/sections/HeroSection";
import { FeaturedPostCard } from "../../components/cards/FeaturedPostCard";
import { PostGrid } from "../../components/sections/PostGrid";
import { LiveNewsSidebar } from "../../components/sections/LiveNewsSidebar";

export default function HomePage() {
  const homeData = getHomePageData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main role="main">
        {/* Hero Section */}
        <HeroSection
          title="Discover the Art of Gastronomy"
          subtitle="Premium Magazine"
          description="Your premier destination for gastronomy and hospitality insights, featuring exclusive content from world-renowned chefs and industry experts."
          ctaText="Explore Articles"
          ctaLink="/posts"
          backgroundImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Post Section */}
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Featured Article
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Our top pick for this week - a must-read for gastronomy
                    enthusiasts
                  </p>
                </div>
                <FeaturedPostCard post={homeData.featuredPost} />
              </section>

              {/* Latest Posts Section */}
              <PostGrid
                posts={homeData.latestPosts.slice(0, 6)}
                title="Latest Articles"
                subtitle="Stay updated with the newest insights from the gastronomy world"
                showViewAll={true}
                viewAllLink="/posts"
              />

              {/* Popular Posts Section */}
              <PostGrid
                posts={homeData.popularPosts.slice(0, 6)}
                title="Popular Articles"
                subtitle="Most read and shared content from our community"
                showViewAll={true}
                viewAllLink="/posts/popular"
              />
            </div>

            {/* Right Column - Live News Sidebar */}
            <div className="lg:col-span-1">
              <LiveNewsSidebar posts={homeData.latestPosts} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-fg text-fg-fg p-8"
        role="contentinfo"
        data-testid="site-footer"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-step-2 font-semibold mb-4">MastroHUB</h3>
              <p className="text-step-1 text-fg-subtle">
                Premium gastronomy and hospitality magazine
              </p>
            </div>
            <div>
              <h4 className="text-step-1 font-semibold mb-4">Sections</h4>
              <ul className="space-y-2 text-step-0 text-fg-subtle">
                {homeData.sections.slice(0, 4).map((section) => (
                  <li key={section.id}>
                    <a
                      href={`/section/${section.slug}`}
                      className="hover:text-fg transition-colors"
                    >
                      {section.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-step-1 font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-step-0 text-fg-subtle">
                <li>
                  <a href="/about" className="hover:text-fg transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="/team" className="hover:text-fg transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-fg transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-step-1 font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-step-0 text-fg-subtle">
                <li>
                  <a
                    href="/newsletter"
                    className="hover:text-fg transition-colors"
                  >
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="/social" className="hover:text-fg transition-colors">
                    Social Media
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-fg transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-fg-subtle mt-8 pt-8 text-center text-step-0 text-fg-subtle">
            <p>&copy; 2024 MastroHUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
