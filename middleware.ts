import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/api/health",
  "/api/auth",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap.txt",
];

function isPublic(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/assets/")) return true;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return true;
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
