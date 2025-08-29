import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Post } from "../../lib/types";

interface FeaturedPostCardProps {
  post: Post;
}

export const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.featuredImage || "/images/placeholder.jpg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 backdrop-blur-sm">
            {post.category.icon} {post.category.name}
          </span>
        </div>

        {/* Featured Badge */}
        {post.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `1px solid ${tag.color}40`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-2">
          {/* Author */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar || "/images/avatar-placeholder.jpg"}
                alt={post.author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author.name}
              </p>
              <p className="text-xs text-gray-500">{post.readTime} min read</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
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

        {/* CTA Button */}
        <div className="pt-4">
          <a
            href={`/posts/${post.slug}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </article>
  );
};
