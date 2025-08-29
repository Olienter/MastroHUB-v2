// ========================================
// MASTROHUB HOMEPAGE SKELETON
// ========================================

import { getHomePageData } from "@/lib/mock-data";

export default function HomePage() {
  const homeData = getHomePageData();

  return (
    <main className="min-h-screen bg-bg text-fg" role="main">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-brand/10 to-brand/5 p-8"
        role="banner"
        data-testid="hero"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-step-5 font-bold text-brand mb-4">MastroHUB</h1>
            <p className="text-step-2 text-fg-subtle max-w-2xl mx-auto">
              Premium gastronomy and hospitality magazine with AI-powered
              insights, recipes, and industry trends
            </p>
          </div>

          {/* Featured Post Hero */}
          <div className="bg-white/80 backdrop-blur-sm rounded-radius-3 p-6 shadow-lg">
            <div className="text-left">
              <span className="inline-block bg-brand/20 text-brand px-3 py-1 rounded-radius-2 text-step-0 font-medium mb-3">
                {homeData.featuredPost.category.name}
              </span>
              <h2 className="text-step-4 font-bold text-fg mb-3">
                {homeData.featuredPost.title}
              </h2>
              <p className="text-step-1 text-fg-subtle mb-4">
                {homeData.featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={homeData.featuredPost.author.avatar}
                    alt={homeData.featuredPost.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-step-0 text-fg-subtle">
                    {homeData.featuredPost.author.name}
                  </span>
                </div>
                <span className="text-step-0 text-fg-subtle">
                  {homeData.featuredPost.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Articles List */}
            <div
              className="lg:col-span-2 space-y-6"
              data-testid="articles-column"
            >
              <h2 className="text-step-3 font-semibold text-fg mb-6">
                Latest Articles
              </h2>

              {/* Article Cards Placeholder */}
              {homeData.latestPosts.slice(0, 4).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-radius-3 p-6 shadow-sm border border-border/50"
                  data-testid="article-card"
                >
                  <div className="flex gap-4">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-24 h-24 rounded-radius-2 object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <span className="inline-block bg-brand/10 text-brand px-2 py-1 rounded-radius-1 text-step-0 font-medium mb-2">
                        {post.category.name}
                      </span>
                      <h3 className="text-step-2 font-semibold text-fg mb-2">
                        {post.title}
                      </h3>
                      <p className="text-step-1 text-fg-subtle mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-step-0 text-fg-subtle">
                        <span>{post.author.name}</span>
                        <span>{post.readTime} min read</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Live Feed Widget */}
              <div
                className="bg-white rounded-radius-3 p-6 shadow-sm border border-border/50"
                data-testid="live-feed"
              >
                <h3 className="text-step-2 font-semibold text-fg mb-4">
                  Live Feed
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-brand/5 rounded-radius-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-step-0 text-fg-subtle">
                      New article published: &ldquo;Street Food
                      Revolution&rdquo;
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-brand/5 rounded-radius-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-step-0 text-fg-subtle">
                      Trending: Molecular Gastronomy
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-brand/5 rounded-radius-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-step-0 text-fg-subtle">
                      New category: Sustainable Dining
                    </span>
                  </div>
                </div>
              </div>

              {/* Trending Tags */}
              <div
                className="bg-white rounded-radius-3 p-6 shadow-sm border border-border/50"
                data-testid="trending-tags"
              >
                <h3 className="text-step-2 font-semibold text-fg mb-4">
                  Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {homeData.trendingTags.slice(0, 8).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-radius-2 text-step-0 font-medium hover:bg-brand/20 transition-colors cursor-pointer"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="p-8 bg-brand/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-step-3 font-semibold text-fg mb-8 text-center">
            Explore Our Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeData.sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-radius-3 p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-step-2 font-semibold text-fg mb-2">
                    {section.name}
                  </h3>
                  <p className="text-step-1 text-fg-subtle">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </main>
  );
}
