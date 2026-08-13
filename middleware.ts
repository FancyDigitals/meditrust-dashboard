import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Always allow login page and api routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check page-level permissions
  const permissions: string[] = (req.auth?.user as any)?.permissions ?? [];
  const pageKey = pathname === "/" ? "dashboard" : pathname.replace("/", "");

  if (!permissions.includes(pageKey)) {
    return NextResponse.redirect(new URL("/denied", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|avatar.jpg).*)"],
};