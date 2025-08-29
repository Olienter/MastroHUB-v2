# MastroHUB Homepage Documentation

## Overview

MastroHUB homepage is a premium gastronomy and hospitality magazine platform that serves as the main entry point for users. The homepage combines a hero section with featured content, a main grid displaying latest articles and sidebar widgets, and a comprehensive footer with navigation.

## Architecture

### File Structure
```
app/
├── (public)/
│   ├── layout.tsx          # Main layout with MainContainer
│   ├── page.tsx            # Homepage skeleton
│   └── globals.css         # Global styles (single source)
├── api/
│   └── posts/
│       └── route.ts        # GET /api/posts endpoint
└── styles/
    ├── tokens.css          # Design tokens
    └── typography.css      # Typography system

lib/
├── types.ts                # TypeScript interfaces
├── contracts.ts            # Zod validation schemas
└── mock-data.ts            # Mock data for development

mocks/
└── handlers.ts             # MSW handlers for testing

tests/
└── e2e/
    └── homepage.spec.ts    # E2E tests for homepage
```

## Components Structure

### Homepage Layout
1. **Hero Section** (`role="banner"`)
   - Main title and description
   - Featured post card with category, title, excerpt, author, read time

2. **Main Content Grid** (`role="main"`)
   - Left column (2/3): Latest articles list with ArticleCard components
   - Right column (1/3): Sidebar with LiveFeedWidget and TrendingTags

3. **Sections Grid**
   - 6 category sections (Fine Dining, Street Food, Wine & Spirits, etc.)
   - Each section displays icon, name, and description

4. **Footer** (`role="contentinfo"`)
   - 4-column layout with sections, about, and connect links
   - Copyright information

## API Contracts

### GET /api/posts
**Query Parameters:**
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 10, max: 100): Items per page
- `category` (string, optional): Filter by category slug
- `tag` (string, optional): Filter by tag slug
- `search` (string, optional): Search in title, excerpt, content
- `featured` (boolean, optional): Filter featured posts
- `author` (string, optional): Filter by author ID

**Response Schema:**
```typescript
{
  success: boolean;
  data: {
    items: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}
```

### Data Types
- **Post**: Complete article with author, category, tags, metadata
- **Section**: Category with icon, color, and description
- **Tag**: Tag with color and description
- **Author**: Author information with avatar and bio

## Design System

### CSS Architecture
- **Single source of truth**: `app/(public)/globals.css` imports design tokens
- **Design tokens**: `styles/tokens.css` for colors, spacing, typography
- **Typography**: `styles/typography.css` for font scales and line heights
- **Responsive**: Mobile-first approach with Tailwind CSS breakpoints

### Accessibility
- **Semantic HTML**: Proper use of `<main>`, `<section>`, `<article>`, `<footer>`
- **ARIA roles**: `role="main"`, `role="banner"`, `role="contentinfo"`
- **Heading hierarchy**: H1 → H2 → H3 structure maintained
- **Screen reader friendly**: Alt text for images, proper link descriptions

## Testing Strategy

### E2E Tests (Playwright)
- **Page loading**: Title, main content visibility
- **Accessibility**: Landmark roles, semantic structure
- **Content display**: Hero, articles, sidebar, sections, footer
- **Responsiveness**: Mobile viewport testing
- **HTML structure**: Heading hierarchy, article structure

### Test Coverage
- Homepage loads successfully
- All landmark roles are present and visible
- Hero section displays featured post correctly
- Article cards render with required elements
- Sidebar widgets display live feed and trending tags
- Sections grid shows all 6 categories
- Footer contains navigation and copyright
- Mobile responsiveness works correctly
- Semantic HTML structure is maintained

## Development Workflow

### Phase A (Current)
- ✅ Remove duplicate layout.tsx and globals.css
- ✅ Create homepage skeleton with placeholder components
- ✅ Implement TypeScript types and Zod contracts
- ✅ Create mock API endpoint for posts
- ✅ Add MSW handlers for testing
- ✅ Write comprehensive E2E tests
- ✅ Document architecture and contracts

### Phase B (Future)
- Build reusable components from features/home
- Implement real data fetching and state management
- Add search and filtering functionality
- Implement user authentication and profiles
- Add comment system and social features
- Optimize performance and SEO

## Definition of Done (DoD)

### Functional Requirements
- [x] Homepage renders without errors
- [x] All sections display correctly (Hero, MainGrid, Sections, Footer)
- [x] API endpoint `/api/posts` returns valid data
- [x] Mock data provides realistic content
- [x] Responsive design works on mobile and desktop

### Quality Requirements
- [x] No duplicate CSS or layout files
- [x] TypeScript types are comprehensive and accurate
- [x] Zod schemas validate all API contracts
- [x] E2E tests pass with 100% coverage
- [x] Accessibility landmarks are properly implemented
- [x] Semantic HTML structure is maintained

### Technical Requirements
- [x] Build process completes successfully
- [x] No TypeScript compilation errors
- [x] MSW handlers work in development and testing
- [x] File structure follows Next.js 13+ app directory conventions
- [x] CSS follows design system architecture
- [x] All imports resolve correctly

## Performance Considerations

- **Image optimization**: Next.js Image component for featured images
- **Lazy loading**: Implement for non-critical content
- **CSS optimization**: Single globals.css file to reduce HTTP requests
- **Bundle splitting**: Component-level code splitting for future phases
- **SEO optimization**: Proper meta tags and structured data

## Security

- **Input validation**: Zod schemas validate all API inputs
- **XSS prevention**: Proper escaping of user-generated content
- **CSRF protection**: Built-in Next.js protection
- **Content Security Policy**: Implement CSP headers in production

## Monitoring and Analytics

- **Error tracking**: Implement error boundaries and logging
- **Performance monitoring**: Core Web Vitals tracking
- **User analytics**: Page views, engagement metrics
- **API monitoring**: Response times, error rates
