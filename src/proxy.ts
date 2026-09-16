import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DISABLED_PATHS = ["/admin", "/forge/signup"];

// Keep local dev host for studio rewriting; remove the production
// host so the live site won't be transparently rewritten to /studio.
// This prevents requests to /studio from being redirected to the
// production subdomain (studio.mvsingh.in).
const STUDIO_HOSTS = ["studio.localhost:3000"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // robots.txt is a root-only Next.js convention — there's no nested
  // app/studio/robots.ts equivalent to the app/studio/sitemap.ts trick below
  // (confirmed: Next.js silently generates no route for one). Without this,
  // studio.mvsingh.in/robots.txt would fall into the generic rewrite below,
  // resolve to nonexistent /studio/robots.txt, and 404. Serve it directly.
  if (STUDIO_HOSTS.includes(host) && pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nAllow: /\n\nSitemap: https://studio.mvsingh.in/sitemap.xml\n", {
      headers: { "content-type": "text/plain" },
    });
  }

  // studio.mvsingh.in serves the Studio site transparently from /studio/*,
  // so visitors see clean URLs (studio.mvsingh.in/ instead of .../studio).
  // (/studio/sitemap.xml does exist — Next.js supports nested sitemap.ts
  // per route segment — so studio.mvsingh.in/sitemap.xml resolves correctly
  // through this same rewrite.)
  if (STUDIO_HOSTS.includes(host) && !pathname.startsWith("/studio")) {
    const url = request.nextUrl.clone();
    url.pathname = `/studio${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (DISABLED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/tech" || pathname.startsWith("/tech/")) {
    const rest = pathname.slice("/tech".length);
    return NextResponse.redirect(new URL(`/portfolio${rest}`, request.url), 308);
  }

  if (pathname === "/portfolio/tech" || pathname.startsWith("/portfolio/tech/")) {
    const rest = pathname.slice("/portfolio/tech".length);
    return NextResponse.redirect(new URL(`/portfolio${rest}`, request.url), 308);
  }

  if (pathname === "/home" || pathname.startsWith("/home/")) {
    const rest = pathname.slice("/home".length);
    return NextResponse.redirect(new URL(`/${rest}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
