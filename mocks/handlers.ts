// ========================================
// MASTROHUB MSW HANDLERS
// ========================================

import { http, HttpResponse } from "msw";
import { mockPosts } from "@/lib/mock-data";

// ===== POSTS API HANDLER =====

export const postsHandler = http.get("/api/posts", ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const search = url.searchParams.get("search");
  const featured = url.searchParams.get("featured");

  // Filter posts based on query parameters
  let filteredPosts = [...mockPosts];

  if (category) {
    filteredPosts = filteredPosts.filter(post => 
      post.category.slug === category
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(t => t.slug === tag)
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  if (featured !== null) {
    const isFeatured = featured === "true";
    filteredPosts = filteredPosts.filter(post => 
      post.isFeatured === isFeatured
    );
  }

  // Calculate pagination
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Create response data
  const responseData = {
    items: paginatedPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  return HttpResponse.json({
    success: true,
    data: responseData,
    message: "Posts retrieved successfully",
  });
});

// ===== DEFAULT HANDLERS =====

export const defaultHandlers = [
  postsHandler,
];
