"use client";

import React, { useState } from "react";
import { Post } from "../../lib/types";
import {
  colors,
  spacing,
  typography,
  shadows,
  transitions,
  borderRadius,
} from "../../lib/design-tokens";

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
      <div
        data-testid="live-feed"
        className="bg-white border-0 hover:shadow-xl transition-all duration-300"
        style={{
          boxShadow: shadows.md,
          borderRadius: borderRadius.lg,
          padding: spacing.component.padding,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl font-bold text-gray-900"
            style={{
              fontFamily: typography.presets.h3.fontFamily,
              fontSize: typography.presets.h3.fontSize,
              fontWeight: typography.presets.h3.fontWeight,
              lineHeight: typography.presets.h3.lineHeight,
            }}
          >
            LIVE NEWS
          </h3>
          <span
            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse"
            style={{
              backgroundColor: colors.primary[500],
              boxShadow: shadows.sm,
            }}
          >
            🔴 LIVE
          </span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colors.primary[600],
              boxShadow: shadows.md,
            }}
          >
            PREMIUM
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
            NEWS
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
            REGIONS
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
            ECONOMY
          </button>
        </div>

        {/* Featured Content */}
        <div className="space-y-3">
          <p
            className="text-gray-700 leading-relaxed"
            style={{
              fontFamily: typography.presets.body.fontFamily,
              fontSize: typography.presets.body.fontSize,
              fontWeight: typography.presets.body.fontWeight,
              lineHeight: typography.presets.body.lineHeight,
            }}
          >
            On the occasion of the end of one era in gastronomy, we recommend an
            archival interview with the legendary chef from under the Alps,
            Viktor Beránek, who is about to retire after almost 50 years of
            service.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3 group cursor-pointer">
              <span
                className="text-red-500 mt-1.5 text-lg font-bold group-hover:text-red-600 transition-colors duration-200"
                style={{ color: colors.primary[500] }}
              >
                •
              </span>
              <span
                className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                style={{
                  fontFamily: typography.presets.bodySmall.fontFamily,
                  fontSize: typography.presets.bodySmall.fontSize,
                  lineHeight: typography.presets.bodySmall.lineHeight,
                }}
              >
                Whoever wants to earn by cooking, goes the wrong way (archival
                interview)
              </span>
            </li>
            <li className="flex items-start space-x-3 group cursor-pointer">
              <span
                className="text-red-500 mt-1.5 text-lg font-bold group-hover:text-red-600 transition-colors duration-200"
                style={{ color: colors.primary[500] }}
              >
                •
              </span>
              <span
                className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
                style={{
                  fontFamily: typography.presets.bodySmall.fontFamily,
                  fontSize: typography.presets.bodySmall.fontSize,
                  lineHeight: typography.presets.bodySmall.lineHeight,
                }}
              >
                The pride of our culinary heritage will be entrusted to another
                (current news)
              </span>
            </li>
          </ul>
          <button
            className="w-full mt-4 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200 text-sm font-medium"
            style={{
              boxShadow: shadows.sm,
            }}
          >
            Share
          </button>
        </div>
      </div>

      {/* Today's Articles */}
      <div
        className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300"
        style={{
          boxShadow: shadows.lg,
          borderRadius: borderRadius.xl,
        }}
      >
        <h3
          className="text-xl font-bold text-gray-900 mb-6"
          style={{
            fontFamily: typography.presets.h3.fontFamily,
            fontSize: typography.presets.h3.fontSize,
            fontWeight: typography.presets.h3.fontWeight,
            lineHeight: typography.presets.h3.lineHeight,
          }}
        >
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
      <div
        className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300"
        style={{
          boxShadow: shadows.lg,
          borderRadius: borderRadius.xl,
        }}
      >
        <h3
          className="text-xl font-bold text-gray-900 mb-6"
          style={{
            fontFamily: typography.presets.h3.fontFamily,
            fontSize: typography.presets.h3.fontSize,
            fontWeight: typography.presets.h3.fontWeight,
            lineHeight: typography.presets.h3.lineHeight,
          }}
        >
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
