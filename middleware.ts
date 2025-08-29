import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/", // Home page - CRITICAL for UI development
  "/login",
  "/dashboard", // Dashboard - CRITICAL for UI testing
  "/docs", // Documentation - for UI testing
  "/about", // About page - for UI testing
  "/demo", // Phase 3 demo page - CRITICAL for component testing
  "/api", // All API routes
  "/api/health",
  "/api/auth",
  "/favicon.ico",
  "/logo.png", // Logo access for UI development
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap.txt",
  "/_next", // Next.js static assets
  "/assets", // Custom static assets
  "/settings", // Settings page - allow for now
  "/.well-known", // Allow well-known requests (Chrome devtools, etc.)
];

function isPublic(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next.js internal paths
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/assets/")) return true;

  // Check exact matches first
  if (PUBLIC_PATHS.includes(pathname)) return true;

  // Check if path starts with any public path (but not just "/")
  for (const publicPath of PUBLIC_PATHS) {
    if (publicPath === "/") {
      // Special case: only exact "/" is public, not everything starting with "/"
      continue;
    }
    if (pathname.startsWith(publicPath + "/")) return true;
  }

  return false;
}

function passThrough() {
  const res = NextResponse.next();
  // diagnostika len v dev/test; v produkcii header nesetujeme
  if (process.env.NODE_ENV !== "production") {
    res.headers.set("x-mhv2-mw", "hit");
  }
  return res;
}

export function middleware(req: NextRequest) {
  console.log("🔒 MIDDLEWARE EXECUTED:", req.nextUrl.pathname);

  const authed = Boolean(req.cookies.get("mhv2_auth")?.value);
  const url = req.nextUrl.clone();

  // allow public paths
  if (isPublic(req)) {
    console.log("📖 PUBLIC PATH:", req.nextUrl.pathname);
    // if user is authed and tries to open /login, redirect home
    if (authed && url.pathname === "/login") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return passThrough();
  }

  // protect everything else
  if (!authed) {
    console.log("🚫 UNAUTHORIZED ACCESS:", req.nextUrl.pathname);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  console.log("✅ AUTHORIZED ACCESS:", req.nextUrl.pathname);
  return passThrough();
}

export const config = {
  // match všetko; výnimky už riešime v kóde vyššie (isPublic)
  matcher: ["/:path*"],
};
