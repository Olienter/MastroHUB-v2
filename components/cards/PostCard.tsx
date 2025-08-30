import React from "react";
import { Post } from "../../lib/types";
import { ArticleCard } from "./ArticleCard";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return <ArticleCard post={post} variant="default" />;
};
