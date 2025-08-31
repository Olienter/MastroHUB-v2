# MastroHUB v2

A gastronomy and hospitality magazine-style platform in English where users can register, create profiles, follow, comment, and discuss. Built with modern AI automation to run at the highest level.

## 🎯 Project Vision

**Gastro Hub** - A unified platform combining:

- 📰 **Magazine**: Curated gastronomy content with editorial quality
- 🌐 **Social Network**: User interaction, engagement, and community building
- 📊 **Dashboard**: Content management, analytics, and insights
- 🔐 **Secure Platform**: Enterprise-grade security framework with AI-powered quality gates

## 🚀 Current Status

- ✅ **MCP Server**: Successfully integrated and running
- ✅ **Core Infrastructure**: Build system stabilized and optimized
- ✅ **Security Framework**: UI security phase in development
- 🔄 **UI Development**: MVP baseline layout + 1 card + basic SEO (planned)
- 🔄 **Authentication**: JWT framework architecture designed
- ❌ **Production Ready**: Not yet (security hardening in progress)

## 🛠️ Technology Stack

### Frontend

- **Next.js 14.2.32** - React framework with App Router and modern features
- **TypeScript 5.9.2** - Type-safe development with strict configuration
- **Tailwind CSS 3.4.0** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Component library for consistent design system (planned)

### Backend & Infrastructure

- **Node.js** - Runtime environment with latest LTS features
- **pnpm 10.14.0** - Fast, efficient package manager
- **MCP Server** - AI integration framework for development automation
- **JWT Authentication** - Security framework with refresh tokens (in development)

### Development Tools

- **ESLint** - Code quality and consistency enforcement
- **TypeScript** - Static type checking and IntelliSense
- **Git** - Version control with AI-powered quality gates
- **AI Quality Gates** - Automated development rules and evidence collection

## 🚀 Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (for fast, efficient package management)
- Git (for version control)

### Installation

```bash
# Clone the repository
git clone <repository>
cd Mastro

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development Commands

```bash
# Development server (with hot reload)
pnpm dev

# Build project for production
pnpm build

# Start production server
pnpm start

# Run smoke tests
pnpm run smoke

# Run core verification
pnpm run verify:core

# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Build with type checking
pnpm run build:typed

# Code quality and formatting
pnpm run format
pnpm run lint:fix
pnpm run health:check

# Performance monitoring
pnpm run perf:monitor
pnpm run perf:report

# Development setup
pnpm run setup:dev
pnpm run dev:clean

# Pre-release checks
pnpm run preflight
pnpm run release:check
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Security Configuration
JWT_SECRET=your-super-secure-jwt-secret
PUBLIC_ROUTES=/,/login,/api/health,/api/auth/login
ENABLE_RATE_LIMIT=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# API Configuration
API_BASE_URL=http://localhost:3000
ENABLE_SECURITY_HEADERS=true
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
HSTS_MAX_AGE=31536000
```

## 🔐 Security Framework

### Current Implementation

- **Route Security**: Public/protected route management with middleware
- **Rate Limiting**: Edge-friendly request limiting with configurable thresholds
- **Security Headers**: Comprehensive security headers (CSP, HSTS, XSS protection)
- **Middleware**: Security-first approach with automatic threat detection

### Planned Features

- **JWT Authentication**: Token-based authentication with refresh mechanism
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Request data validation and sanitization
- **Security Monitoring**: Real-time security alerts and logging

### Security Configuration

Security is configured via environment variables for flexibility:

- `PUBLIC_ROUTES` - Define public access routes (comma-separated)
- `ENABLE_RATE_LIMIT` - Enable/disable rate limiting
- `RATE_LIMIT_MAX` - Maximum requests per time window
- `JWT_SECRET` - JWT signing secret (use strong, unique secrets)
- `CSP_POLICY` - Content Security Policy configuration
- `HSTS_MAX_AGE` - HTTP Strict Transport Security duration

## 🏗️ Project Architecture

### Directory Structure

```
Mastro/
├── app/                    # Next.js App Router (pages and API routes)
│   ├── api/               # API endpoints
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout component
├── components/            # React components and UI primitives
│   └── ui/               # Base UI components
├── lib/                   # Utility libraries and helpers
├── tools/                 # Development tools and scripts
│   ├── diag/             # Diagnostic and verification scripts
│   └── mcp-ai-evidence/  # MCP server integration
├── .ai/                   # AI development rules and quality gates
│   ├── checks/           # Quality gate evidence and reports
│   ├── chronicle/        # Project timeline and decisions
│   ├── handoff/          # Development handoffs and status
│   └── manifest.json     # Project manifest and policies
├── scripts/               # Build, test, and deployment scripts
└── tests/                 # Test suites and specifications
```

### Development Workflow

1. **AI Quality Gates**: All changes must pass automated checks and generate evidence
2. **Evidence-Based Development**: Every change creates evidence files for traceability
3. **Progressive Development**: Maximum 5 files per development step for controlled scope
4. **Security-First Approach**: Security framework implementation before feature development
5. **Continuous Verification**: Automated testing and validation at every step

## 🗺️ Development Roadmap

### Phase 1: Security Foundation ✅

- [x] Core infrastructure stabilization and optimization
- [x] MCP server integration and automation
- [x] Build system optimization and smoke tests
- [x] CORE verification protocols implementation
- [ ] UI security framework implementation (current)

### Phase 2: UI Development 🔄

- [ ] MVP baseline layout with responsive design
- [ ] Feed component system (card-based content)
- [ ] Basic SEO implementation (meta tags, sitemap)
- [ ] Tailwind CSS integration and design system
- [ ] shadcn/ui component library integration

### Phase 3: Authentication & Features 📋

- [ ] JWT authentication system with refresh tokens
- [ ] User registration and login system
- [ ] Content management and creation tools
- [ ] Social features (follow, comment, like)
- [ ] User profiles and settings

### Phase 4: Production Readiness 🚀

- [ ] Security hardening and penetration testing
- [ ] Performance optimization and monitoring
- [ ] Testing automation and CI/CD pipeline
- [ ] Deployment pipeline and infrastructure
- [ ] Production monitoring and alerting

## 🔍 Quality Gates & Evidence

### AI-Powered Development Rules

- **Single Source of Truth**: The `/.ai` directory contains all development rules
- **WRITE Only After Approved**: No code changes without explicit human approval
- **≤5 Files Per Step**: Progressive development with controlled scope
- **Evidence Collection**: Every change generates evidence files for validation

### Verification Commands

```bash
# Core system verification
pnpm run verify:core

# Operations health check
pnpm run diag:ops

# Smoke testing
pnpm run smoke

# Type checking and linting
pnpm run typecheck
pnpm run lint
```

## 🤝 Contributing

### Development Guidelines

1. **Follow AI Quality Gates**: All changes must pass automated checks
2. **Generate Evidence**: Every change creates evidence files
3. **Respect Scope Limits**: Maximum 5 files per development step
4. **Security First**: Implement security before features
5. **Document Changes**: Update relevant documentation

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Code formatting and style consistency
- **Testing**: Automated testing for all new features

## 📚 Additional Resources

### Documentation

- **API Documentation**: Available at `/api/docs` (planned)
- **Component Library**: Storybook integration (planned)
- **Security Guide**: Comprehensive security documentation (in development)

### Support & Community

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Community discussions and Q&A via GitHub Discussions
- **Wiki**: Project knowledge base and guides (planned)

---

## 📊 Project Metrics

**Last Updated**: 2025-08-23  
**Current Version**: v2.0.0-alpha  
**Build Status**: ✅ Stable  
**Security Status**: 🔄 In Development  
**UI Status**: 📋 Planned

---

_Built with ❤️ and AI automation for the highest quality standards._
