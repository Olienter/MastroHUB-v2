import React, { useState, useEffect } from "react";
import { Post } from "../../lib/types";
import { PostCard } from "../cards/PostCard";

import { Skeleton } from "../ui/Skeleton";

interface PostGridProps {
  posts: Post[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  loading?: boolean;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  title,
  subtitle,
  showViewAll = false,
  viewAllLink,
  loading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="w-full">
          {/* Header Skeleton */}
          {(title || subtitle) && (
            <div className="text-center mb-12">
              <Skeleton variant="title" className="mx-auto mb-4" />
              <Skeleton
                variant="text"
                lines={2}
                className="mx-auto max-w-2xl"
              />
            </div>
          )}

          {/* Grid Skeleton */}
          <div className="grid grid-cols-12 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <Skeleton variant="card" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div data-testid="articles-column" className="w-full">
        {/* Header with fade-in animation */}
        {(title || subtitle) && (
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
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

        {/* Grid with staggered animations */}
        <div className="grid grid-cols-12 gap-8">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="col-span-12 md:col-span-6 lg:col-span-4"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } ${
                  hoveredIndex === index
                    ? "transform -translate-y-2 shadow-2xl"
                    : ""
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button with enhanced hover effects */}
        {showViewAll && viewAllLink && (
          <div
            className={`text-center mt-12 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <a
              href={viewAllLink}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              View All Articles
              <svg
                className="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
