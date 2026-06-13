import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DISABLED_PATHS = ["/admin", "/forge/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (DISABLED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/tech" || pathname.startsWith("/tech/")) {
    const rest = pathname.slice("/tech".length);
    return NextResponse.redirect(new URL(`/portfolio${rest}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
