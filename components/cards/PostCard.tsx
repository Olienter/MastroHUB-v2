import React from "react";
import { Post } from "../../lib/types";
import { ArticleCard } from "./ArticleCard";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured";
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  variant = "default",
  className 
}) => {
  return <ArticleCard post={post} variant={variant} className={className} />;
};

// Convenience component for featured posts
export const FeaturedPostCard: React.FC<Omit<PostCardProps, 'variant'>> = (props) => {
  return <PostCard {...props} variant="featured" />;
};
