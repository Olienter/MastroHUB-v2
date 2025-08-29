// ========================================
// MASTROHUB BLOG/MAGAZINE TYPES
// ========================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: Section;
  tags: Tag[];
  publishedAt: string;
  updatedAt: string;
  readTime: number; // minutes
  views: number;
  likes: number;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  parentSection?: string; // for nested sections
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostListResponse {
  items: Post[];
  pagination: Pagination;
}

export interface HomePageData {
  featuredPost: Post;
  latestPosts: Post[];
  popularPosts: Post[];
  sections: Section[];
  trendingTags: Tag[];
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PostListApiResponse extends ApiResponse<PostListResponse> {}
export interface HomePageApiResponse extends ApiResponse<HomePageData> {}
