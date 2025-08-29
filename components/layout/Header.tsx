import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">MastroHUB</h1>
            </div>

            {/* Top Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <a
                href="/gastronomy"
                className="hover:text-red-200 transition-colors"
              >
                GASTRONOMY
              </a>
              <a
                href="/hospitality"
                className="hover:text-red-200 transition-colors"
              >
                HOSPITALITY
              </a>
              <a href="/chefs" className="hover:text-red-200 transition-colors">
                CHEFS
              </a>
              <a
                href="/recipes"
                className="hover:text-red-200 transition-colors"
              >
                RECIPES
              </a>
              <a
                href="/trends"
                className="hover:text-red-200 transition-colors"
              >
                TRENDS
              </a>
            </nav>

            {/* Weather & Date */}
            <div className="flex items-center space-x-4 text-sm">
              <span>🌤️ 22°C - Bratislava</span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Main Categories */}
          <nav className="flex items-center space-x-8">
            <a
              href="/fine-dining"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              FINE DINING
            </a>
            <a
              href="/street-food"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              STREET FOOD
            </a>
            <a
              href="/wine-spirits"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              WINE & SPIRITS
            </a>
            <a
              href="/hotels"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              HOTELS
            </a>
            <a
              href="/chef-interviews"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              CHEF INTERVIEWS
            </a>
            <a
              href="/food-trends"
              className="text-gray-900 hover:text-red-600 font-medium transition-colors"
            >
              FOOD TRENDS
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              🔍
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-12 text-sm">
            <a
              href="/latest"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Latest News
            </a>
            <a
              href="/featured"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Featured
            </a>
            <a
              href="/exclusive"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Exclusive
            </a>
            <a
              href="/podcast"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Podcast
            </a>
            <a
              href="/video"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Video
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
