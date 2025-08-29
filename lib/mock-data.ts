// ========================================
// MASTROHUB MOCK DATA
// ========================================

import { Post, Tag, Section } from "./types";

// ===== SECTIONS (CATEGORIES) =====

export const mockSections: Section[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Fine Dining",
    slug: "fine-dining",
    description: "Exclusive culinary experiences and haute cuisine",
    icon: "🍽️",
    color: "#8B4513",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Street Food",
    slug: "street-food",
    description: "Authentic street food from around the world",
    icon: "🌮",
    color: "#FF6B35",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Wine & Spirits",
    slug: "wine-spirits",
    description: "Wine tasting, cocktail culture, and spirits",
    icon: "🍷",
    color: "#722F37",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Hotel Management",
    slug: "hotel-management",
    description: "Hospitality industry insights and best practices",
    icon: "🏨",
    color: "#2E86AB",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Chef Interviews",
    slug: "chef-interviews",
    description: "Exclusive interviews with world-renowned chefs",
    icon: "👨‍🍳",
    color: "#A23B72",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Food Trends",
    slug: "food-trends",
    description: "Latest culinary trends and innovations",
    icon: "🚀",
    color: "#F18F01",
  },
];

// ===== TAGS =====

export const mockTags: Tag[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Italian Cuisine",
    slug: "italian-cuisine",
    color: "#CD853F",
    description: "Traditional and modern Italian dishes",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    name: "Asian Fusion",
    slug: "asian-fusion",
    color: "#DC143C",
    description: "Innovative Asian-inspired cuisine",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    name: "Sustainable Dining",
    slug: "sustainable-dining",
    color: "#228B22",
    description: "Eco-friendly and sustainable food practices",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    name: "Cocktail Culture",
    slug: "cocktail-culture",
    color: "#FF69B4",
    description: "Artisanal cocktails and mixology",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440105",
    name: "Luxury Hospitality",
    slug: "luxury-hospitality",
    color: "#FFD700",
    description: "Premium hotel and service experiences",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440106",
    name: "Food Photography",
    slug: "food-photography",
    color: "#9932CC",
    description: "Culinary photography and styling",
  },
];

// ===== POSTS =====

export const mockPosts: Post[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    title: "The Art of Molecular Gastronomy: A Chef's Journey",
    slug: "art-of-molecular-gastronomy",
    excerpt:
      "Discover how modern chefs are pushing culinary boundaries with science and creativity in this exclusive deep-dive into molecular gastronomy.",
    content:
      "Molecular gastronomy represents the intersection of culinary art and scientific innovation...",
    featuredImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440201",
      name: "Chef Marco Rossi",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bio: "Award-winning chef and molecular gastronomy pioneer",
    },
    category: mockSections[0], // Fine Dining
    tags: [mockTags[2], mockTags[5], mockTags[6]],
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    views: 15420,
    likes: 892,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    title: "Street Food Revolution: From Bangkok to Brooklyn",
    slug: "street-food-revolution",
    excerpt:
      "How street food is transforming urban dining culture and creating new culinary destinations around the world.",
    content:
      "Street food has evolved from simple sustenance to a global culinary movement...",
    featuredImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440202",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      bio: "Food culture journalist and street food enthusiast",
    },
    category: mockSections[1], // Street Food
    tags: [mockTags[1], mockTags[5]],
    publishedAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    readTime: 6,
    views: 12350,
    likes: 567,
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    title: "Wine Pairing Masterclass: Redefining the Dining Experience",
    slug: "wine-pairing-masterclass",
    excerpt:
      "Learn the secrets of perfect wine and food pairing from sommeliers and enhance your dining experiences.",
    content:
      "The art of wine pairing goes beyond simple red-with-meat, white-with-fish rules...",
    featuredImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440203",
      name: "Pierre Dubois",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bio: "Master sommelier with 20+ years of experience",
    },
    category: mockSections[2], // Wine & Spirits
    tags: [mockTags[3], mockTags[5]],
    publishedAt: "2024-01-13T16:00:00Z",
    updatedAt: "2024-01-13T16:00:00Z",
    readTime: 7,
    views: 9870,
    likes: 423,
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    title: "The Future of Luxury Hotels: AI and Personalization",
    slug: "future-of-luxury-hotels",
    excerpt:
      "How artificial intelligence is revolutionizing luxury hospitality and creating personalized guest experiences.",
    content:
      "Luxury hotels are embracing technology to deliver unprecedented levels of personalization...",
    featuredImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440204",
      name: "Elena Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      bio: "Hospitality technology consultant and industry expert",
    },
    category: mockSections[3], // Hotel Management
    tags: [mockTags[4], mockTags[5]],
    publishedAt: "2024-01-12T11:15:00Z",
    updatedAt: "2024-01-12T11:15:00Z",
    readTime: 9,
    views: 8760,
    likes: 345,
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440105",
    title: "Chef's Table: An Intimate Evening with Gordon Ramsay",
    slug: "chefs-table-gordon-ramsay",
    excerpt:
      "Exclusive behind-the-scenes look at an intimate chef's table experience with culinary legend Gordon Ramsay.",
    content:
      "The kitchen is quiet except for the rhythmic sound of knives on cutting boards...",
    featuredImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440205",
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bio: "Food critic and culinary journalist",
    },
    category: mockSections[4], // Chef Interviews
    tags: [mockTags[0], mockTags[5], mockTags[6]],
    publishedAt: "2024-01-11T09:45:00Z",
    updatedAt: "2024-01-11T09:45:00Z",
    readTime: 10,
    views: 21560,
    likes: 1234,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440106",
    title: "Plant-Based Revolution: The New Face of Fine Dining",
    slug: "plant-based-revolution-fine-dining",
    excerpt:
      "How plant-based cuisine is transforming fine dining and challenging traditional culinary norms.",
    content:
      "The plant-based movement has evolved far beyond simple salads and tofu dishes...",
    featuredImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    author: {
      id: "550e8400-e29b-41d4-a716-446655440206",
      name: "Chef Isabella Green",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      bio: "Pioneering plant-based chef and sustainability advocate",
    },
    category: mockSections[0], // Fine Dining
    tags: [mockTags[2], mockTags[5], mockTags[6]],
    publishedAt: "2024-01-10T13:20:00Z",
    updatedAt: "2024-01-10T13:20:00Z",
    readTime: 8,
    views: 13450,
    likes: 678,
    isFeatured: false,
    isPublished: true,
  },
];

// ===== HOME PAGE DATA =====

export const getHomePageData = () => {
  try {
    // Ensure we have valid data
    const featuredPost =
      mockPosts.find((post) => post.isFeatured) || mockPosts[0];
    const latestPosts = mockPosts.slice(0, 6);
    const popularPosts = mockPosts
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
    const sections = mockSections;
    const trendingTags = mockTags.slice(0, 8);

    // Validate that we have at least one post
    if (!featuredPost || latestPosts.length === 0) {
      throw new Error("No posts available");
    }

    return {
      featuredPost,
      latestPosts,
      popularPosts,
      sections,
      trendingTags,
    };
  } catch (error) {
    console.warn("Error in getHomePageData, using fallback:", error);

    // Fallback data structure
    const fallbackPost = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Welcome to MastroHUB",
      slug: "welcome-mastrohub",
      excerpt:
        "Your premier destination for gastronomy and hospitality insights",
      content:
        "Welcome to MastroHUB, where culinary excellence meets hospitality innovation...",
      featuredImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      author: {
        id: "550e8400-e29b-41d4-a716-446655440200",
        name: "MastroHUB Team",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        bio: "Your trusted source for gastronomy insights",
      },
      category: {
        id: "550e8400-e29b-41d4-a716-446655440300",
        name: "General",
        slug: "general",
        description: "General gastronomy content",
        icon: "🍽️",
      },
      tags: [
        {
          id: "550e8400-e29b-41d4-a716-446655440400",
          name: "Welcome",
          slug: "welcome",
          color: "#8B4513",
          description: "Welcome content",
        },
      ],
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: 3,
      views: 100,
      likes: 10,
      isFeatured: true,
      isPublished: true,
    };

    return {
      featuredPost: fallbackPost,
      latestPosts: [fallbackPost],
      popularPosts: [fallbackPost],
      sections: [
        {
          id: "550e8400-e29b-41d4-a716-446655440300",
          name: "General",
          slug: "general",
          description: "General gastronomy content",
          icon: "🍽️",
        },
      ],
      trendingTags: [
        {
          id: "550e8400-e29b-41d4-a716-446655440400",
          name: "Welcome",
          slug: "welcome",
          color: "#8B4513",
          description: "Welcome content",
        },
      ],
    };
  }
};
