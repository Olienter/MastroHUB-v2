"use client";

import { TrendingTags } from "./TrendingTags";
import { LiveNewsSidebar } from "./LiveNewsSidebar";

export function Sidebar() {

  return (
    <aside className="space-y-6">
      {/* Live News Feed */}
      <LiveNewsSidebar />
      
      {/* Trending Tags */}
      <TrendingTags />
      
      {/* Newsletter Signup */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Stay Updated</h3>
        <p className="text-sm text-blue-700 mb-3">
          Get the latest gastronomy news and AI-generated content delivered to your inbox.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </aside>
  );
}
