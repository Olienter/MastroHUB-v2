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
    isAI?: boolean; // New: AI-generated content flag
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
  // New fields for AI content
  aiGenerated?: boolean;
  aiPrompt?: string;
  aiModel?: string;
  contentQuality?: 'draft' | 'review' | 'published' | 'archived';
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
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
  // New: AI content highlights
  aiGeneratedPosts?: Post[];
  dailyDigest?: {
    date: string;
    summary: string;
    posts: Post[];
  };
}

// ========================================
// AI AGENT TYPES
// ========================================

export interface AIAgent {
  id: string;
  name: string;
  role: 'content_creator' | 'editor' | 'curator' | 'analyst';
  capabilities: string[];
  lastActive: string;
  dailyQuota: number;
  contentQuality: number; // 0-100
}

export interface ContentGenerationRequest {
  id: string;
  prompt: string;
  category: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'academic' | 'conversational';
  keywords: string[];
  estimatedReadTime: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  generatedPost?: Post;
}

export interface ContentSchedule {
  id: string;
  title: string;
  category: string;
  scheduledDate: string;
  aiAgent: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
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

export type PostListApiResponse = ApiResponse<PostListResponse>;
export type HomePageApiResponse = ApiResponse<HomePageData>;
export type AIAgentResponse = ApiResponse<AIAgent[]>;
export type ContentGenerationResponse = ApiResponse<ContentGenerationRequest>;
