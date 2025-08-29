// ========================================
// MASTROHUB API CONTRACTS (ZOD SCHEMAS)
// ========================================

import { z } from "zod";

// ===== BASE SCHEMAS =====

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  description: z.string().max(200).optional(),
});

export const SectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  parentSection: z.string().uuid().optional(),
});

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  bio: z.string().max(300).optional(),
});

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(100),
  featuredImage: z.string().url().optional(),
  author: AuthorSchema,
  category: SectionSchema,
  tags: z.array(TagSchema).min(1).max(10),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  readTime: z.number().int().min(1).max(480), // 1-8 hours
  views: z.number().int().min(0),
  likes: z.number().int().min(0),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

// ===== API RESPONSE SCHEMAS =====

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const PostListResponseSchema = z.object({
  items: z.array(PostSchema),
  pagination: PaginationSchema,
});

export const HomePageDataSchema = z.object({
  featuredPost: PostSchema,
  latestPosts: z.array(PostSchema).min(1).max(10),
  popularPosts: z.array(PostSchema).min(1).max(10),
  sections: z.array(SectionSchema).min(1).max(20),
  trendingTags: z.array(TagSchema).min(1).max(15),
});

// ===== API REQUEST SCHEMAS =====

export const PostListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  author: z.string().optional(),
});

export const PostSearchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ===== EXPORT TYPES =====

export type PostListQuery = z.infer<typeof PostListQuerySchema>;
export type PostSearchQuery = z.infer<typeof PostSearchQuerySchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type HomePageData = z.infer<typeof HomePageDataSchema>;
