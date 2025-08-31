import React from "react";
import Image from "next/image";
import { Post } from "../../lib/types";

import { Button } from "../ui/Button";
import {
  getTagColorClasses,
  ASPECT_RATIOS,
  IMAGE_SIZES,
} from "../../lib/utils";

interface ArticleCardProps {
  post: Post;
  variant?: "default" | "featured";
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  variant = "default",
  className = "",
}) => {
  const isFeatured = variant === "featured";

  // Card styling based on variant
  const cardClasses = isFeatured
    ? "group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-xl transition-all duration-300"
    : "group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden";

  // Content padding based on variant
  const contentPadding = isFeatured ? "p-6" : "p-5";

  // Title styling based on variant
  const titleClasses = isFeatured
    ? "text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2"
    : "text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2";

  // Excerpt styling based on variant
  const excerptClasses = isFeatured
    ? "text-gray-600 line-clamp-3 leading-relaxed"
    : "text-gray-600 text-sm line-clamp-2 leading-relaxed";

  // Author avatar size based on variant
  const avatarSize = isFeatured ? "w-10 h-10" : "w-8 h-8";
  const avatarImageSizes = isFeatured
    ? IMAGE_SIZES.AVATAR_MD
    : IMAGE_SIZES.AVATAR_SM;

  return (
    <article className={`${cardClasses} ${className}`}>
      {/* Image Container */}
      <div
        className={`relative ${ASPECT_RATIOS.CARD} overflow-hidden bg-gray-100`}
      >
        <Image
          src={post.featuredImage || "/images/placeholders/article-default.jpg"}
          alt={post.title}
          fill
          sizes={isFeatured ? IMAGE_SIZES.FEATURED : IMAGE_SIZES.CARD}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={isFeatured}
        />

        {/* Category Badge */}
        <div
          className={`absolute ${isFeatured ? "top-4 left-4" : "top-3 left-3"}`}
        >
          <span
            className={`inline-flex items-center ${
              isFeatured ? "px-3 py-1" : "px-2 py-1"
            } rounded-full text-xs font-medium bg-white/90 text-gray-900 backdrop-blur-sm`}
          >
            <span className="mr-1" aria-hidden="true">
              {post.category.icon}
            </span>
            {post.category.name}
          </span>
        </div>

        {/* Featured Badge */}
        {post.isFeatured && isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
              <span className="mr-1" aria-hidden="true">
                ⭐
              </span>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${contentPadding} space-y-${isFeatured ? "4" : "3"}`}>
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, isFeatured ? 3 : 2).map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                isFeatured ? "rounded-md" : "rounded"
              }`}
              style={getTagColorClasses(tag.color || "#666666")}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={titleClasses}>
          <a href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </a>
        </h3>

        {/* Excerpt */}
        <p className={excerptClasses}>{post.excerpt}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-2">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div
              className={`relative ${avatarSize} rounded-full overflow-hidden`}
            >
              <Image
                src={
                  post.author.avatar ||
                  "/images/placeholders/avatar-default.jpg"
                }
                alt={post.author.name}
                fill
                className="object-cover"
                sizes={avatarImageSizes}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author.name}
              </p>
              {isFeatured && (
                <p className="text-xs text-gray-500">
                  {post.readTime} min read
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className={`flex items-center space-x-${isFeatured ? "4" : "3"} ${
              isFeatured ? "text-sm" : "text-xs"
            } text-gray-500`}
          >
            <span className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{post.views.toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{post.likes.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Read Time & Date */}
        {!isFeatured && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>{post.readTime} min read</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        )}

        {/* CTA Button for Featured */}
        {isFeatured && (
          <div className="pt-4">
            <a href={`/posts/${post.slug}`} className="block w-full">
              <Button variant="primary" size="md" className="w-full">
                Read Full Article
              </Button>
            </a>
          </div>
        )}
      </div>
    </article>
  );
};
