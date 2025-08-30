"use client";

import React, { useState } from "react";
import {
  HeaderConfig,
  defaultHeaderConfig,
  getCurrentWeather,
  getCurrentDate,
} from "../../lib/navigation";

interface HeaderProps {
  config?: HeaderConfig;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  config = defaultHeaderConfig,
  className = "",
}) => {
  const weather = getCurrentWeather();
  const currentDate = getCurrentDate();

  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
    >
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
              {config.topNavigation.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="hover:text-red-200 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Weather & Date */}
            {config.showWeather && (
              <div className="flex items-center space-x-4 text-sm">
                <span>
                  {weather.icon} {weather.temperature} - {weather.location}
                </span>
                <span>{currentDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Main Categories */}
          <nav className="flex items-center space-x-8">
            {config.mainNavigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-900 hover:text-red-600 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {config.showSearch && (
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                🔍
              </button>
            )}
            {config.showLogin && (
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-12 text-sm">
            {config.subNavigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
