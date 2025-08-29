import React from "react";
import { Post } from "../../lib/types";

interface LiveNewsSidebarProps {
  posts: Post[];
}

export const LiveNewsSidebar: React.FC<LiveNewsSidebarProps> = ({ posts }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Live News Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">LIVE NEWS</h3>
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            🔴 LIVE
          </span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md">
            PREMIUM
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-red-600">
            NEWS
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-red-600">
            REGIONS
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-red-600">
            ECONOMY
          </button>
        </div>

        {/* Featured Content */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            On the occasion of the end of one era in gastronomy, we recommend an
            archival interview with the legendary chef from under the Alps,
            Viktor Beránek, who is about to retire after almost 50 years of
            service.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-red-600 mt-1">•</span>
              <span className="text-gray-700">
                Whoever wants to earn by cooking, goes the wrong way (archival
                interview)
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-600 mt-1">•</span>
              <span className="text-gray-700">
                The pride of our culinary heritage will be entrusted to another
                (current news)
              </span>
            </li>
          </ul>
          <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Share
          </button>
        </div>
      </div>

      {/* Today's Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          TODAY{" "}
          {new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </h3>

        <div className="space-y-4">
          {posts.slice(0, 3).map((post, index) => (
            <article
              key={post.id}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">
                    {formatTime(post.publishedAt)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-3 leading-relaxed">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  {post.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {post.category.name.toUpperCase()}
                    </span>
                  )}
                  <button className="w-full mt-3 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs">
                    Share
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          TRENDING TOPICS
        </h3>
        <div className="space-y-2">
          <a
            href="#"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">
              #MolecularGastronomy
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              2.5K mentions
            </span>
          </a>
          <a
            href="#"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">
              #SustainableDining
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              1.8K mentions
            </span>
          </a>
          <a
            href="#"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">
              #WinePairing
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              1.2K mentions
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
};
