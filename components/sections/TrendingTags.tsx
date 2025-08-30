import React from "react";
import { Tag } from "../../lib/types";

interface TrendingTagsProps {
  tags: Tag[];
  title?: string;
  subtitle?: string;
}

export const TrendingTags: React.FC<TrendingTagsProps> = ({
  tags,
  title,
  subtitle,
}) => {
  return (
    <section className="py-16">
      <div data-testid="trending-tags" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Tags Grid */}
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-opacity-30"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `2px solid ${tag.color}40`,
              }}
            >
              <span className="mr-2">#</span>
              {tag.name}
              {tag.description && (
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
                  ({tag.description})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View All Tags Link */}
        <div className="text-center mt-8">
          <a
            href="/tags"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All Tags
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
