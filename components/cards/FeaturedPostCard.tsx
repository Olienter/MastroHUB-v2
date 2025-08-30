import React from "react";
import { Post } from "../../lib/types";
import { ArticleCard } from "./ArticleCard";

interface FeaturedPostCardProps {
  post: Post;
}

export const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  return <ArticleCard post={post} variant="featured" />;
};
