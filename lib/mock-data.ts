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
    id: "1",
    title:
      "The Art of Molecular Gastronomy: Breaking Boundaries in Modern Cuisine",
    slug: "molecular-gastronomy-modern-cuisine",
    excerpt:
      "Explore the fascinating world of molecular gastronomy where science meets culinary artistry. Discover how top chefs are pushing the boundaries of traditional cooking.",
    content: "Full article content about molecular gastronomy...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    views: 15670,
    likes: 892,
    isFeatured: true,
    isPublished: true,
    category: mockSections[5], // Food Trends
    tags: [mockTags[1], mockTags[5]], // Asian Fusion, Food Photography
    author: {
      id: "author-1",
      name: "Chef Marco Rossi",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Award-winning chef and culinary innovator",
    },
  },
  {
    id: "2",
    title:
      "Sustainable Dining: How Restaurants Are Embracing Eco-Friendly Practices",
    slug: "sustainable-dining-eco-friendly-restaurants",
    excerpt:
      "From farm-to-table initiatives to zero-waste kitchens, discover how restaurants worldwide are leading the charge in sustainable dining practices.",
    content: "Full article content about sustainable dining...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    readTime: 6,
    views: 12350,
    likes: 756,
    isFeatured: false,
    isPublished: true,
    category: mockSections[5], // Food Trends
    tags: [mockTags[2]], // Sustainable Dining
    author: {
      id: "author-2",
      name: "Sarah Chen",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Food sustainability expert and journalist",
    },
  },
  {
    id: "3",
    title: "Wine Pairing Masterclass: Elevate Your Dining Experience",
    slug: "wine-pairing-masterclass-dining-experience",
    excerpt:
      "Master the art of wine pairing with expert tips from sommeliers. Learn how to enhance your dining experience with perfect wine selections.",
    content: "Full article content about wine pairing...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
    readTime: 7,
    views: 9870,
    likes: 634,
    isFeatured: false,
    isPublished: true,
    category: mockSections[2], // Wine & Spirits
    tags: [mockTags[3]], // Cocktail Culture
    author: {
      id: "author-3",
      name: "Pierre Dubois",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Master sommelier and wine educator",
    },
  },
  {
    id: "4",
    title: "Street Food Revolution: Global Flavors on the Go",
    slug: "street-food-revolution-global-flavors",
    excerpt:
      "From Bangkok to Mexico City, explore the world's most exciting street food scenes and the cultural stories behind these beloved dishes.",
    content: "Full article content about street food...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-12T11:20:00Z",
    updatedAt: "2024-01-12T11:20:00Z",
    readTime: 5,
    views: 8760,
    likes: 523,
    isFeatured: false,
    isPublished: true,
    category: mockSections[1], // Street Food
    tags: [mockTags[0], mockTags[1]], // Italian Cuisine, Asian Fusion
    author: {
      id: "author-4",
      name: "Maria Gonzalez",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Food culture writer and street food enthusiast",
    },
  },
  {
    id: "5",
    title: "Luxury Hotel Management: Secrets of Five-Star Service",
    slug: "luxury-hotel-management-five-star-service",
    excerpt:
      "Discover the behind-the-scenes secrets of luxury hotel management and how top establishments maintain their prestigious five-star standards.",
    content: "Full article content about luxury hotel management...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-11T09:15:00Z",
    updatedAt: "2024-01-11T09:15:00Z",
    readTime: 9,
    views: 11230,
    likes: 678,
    isFeatured: false,
    isPublished: true,
    category: mockSections[3], // Hotel Management
    tags: [mockTags[4]], // Luxury Hospitality
    author: {
      id: "author-5",
      name: "James Thompson",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Hospitality industry consultant and former hotel manager",
    },
  },
  {
    id: "6",
    title:
      "Chef's Table: Exclusive Interview with Michelin-Starred Chef Elena Rodriguez",
    slug: "chefs-table-interview-elena-rodriguez",
    excerpt:
      "An intimate conversation with Chef Elena Rodriguez about her journey to culinary excellence and the philosophy behind her innovative dishes.",
    content: "Full article content about Chef Elena Rodriguez...",
    featuredImage: "/images/placeholders/molecular-gastronomy.svg",
    publishedAt: "2024-01-10T13:00:00Z",
    updatedAt: "2024-01-10T13:00:00Z",
    readTime: 10,
    views: 13450,
    likes: 945,
    isFeatured: true,
    isPublished: true,
    category: mockSections[4], // Chef Interviews
    tags: [mockTags[0], mockTags[5]], // Italian Cuisine, Food Photography
    author: {
      id: "author-6",
      name: "David Kim",
      avatar: "/images/placeholders/avatar-default.svg",
      bio: "Culinary journalist and food critic",
    },
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
  } catch {
    // Error in getHomePageData, using fallback

    // Fallback data structure with LOCAL placeholder images
    const fallbackPost = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Welcome to MastroHUB",
      slug: "welcome-mastrohub",
      excerpt:
        "Your premier destination for gastronomy and hospitality insights",
      content:
        "Welcome to MastroHUB, where culinary excellence meets hospitality innovation in perfect harmony. Our platform serves as the premier destination for gastronomy enthusiasts, hospitality professionals, and food lovers worldwide. We bring together the finest culinary minds, cutting-edge industry insights, and innovative hospitality practices to create a comprehensive resource that inspires, educates, and connects the global food and hospitality community. From exclusive chef interviews to groundbreaking hospitality technology, MastroHUB is your gateway to the future of gastronomy and hospitality excellence.",
      featuredImage: "/images/placeholders/hero-gastronomy.svg",
      author: {
        id: "550e8400-e29b-41d4-a716-446655440200",
        name: "MastroHUB Team",
        avatar: "/images/placeholders/avatar-default.svg",
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
