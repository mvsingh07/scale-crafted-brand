import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// /forge/login — open (accessible via Ctrl+Alt+L shortcut)
// /admin       — disabled (replaced by forge/login)
// /forge/signup — disabled (no public sign-up)
const DISABLED_PATHS = ["/admin", "/forge/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (DISABLED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // /tech → /portfolio (permanent redirect)
  if (pathname === "/tech" || pathname.startsWith("/tech/")) {
    const rest = pathname.slice("/tech".length);
    return NextResponse.redirect(new URL(`/portfolio${rest}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all paths except _next internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
