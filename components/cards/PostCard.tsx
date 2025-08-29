import React from "react";
import Image from "next/image";
import { Post } from "../../lib/types";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image - Optimized with sizes and aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.featuredImage || "/images/placeholder.jpg"}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 backdrop-blur-sm">
            {post.category.icon} {post.category.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
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
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          <a href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </a>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-2">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar || "/images/avatar-placeholder.jpg"}
                alt={post.author.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author.name}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-500">
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
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>{post.readTime} min read</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
};
