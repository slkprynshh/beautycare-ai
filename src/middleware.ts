// ============================================================================
// File: src/middleware.ts
// Purpose: Resilient Edge RBAC Guard with conditional Clerk activation
// ============================================================================

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types/clerk";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(
  clerkKey && 
  clerkKey.trim() !== "" && 
  clerkKey.startsWith("pk_") && 
  !clerkKey.includes("Y2xlcms") && 
  !clerkKey.includes("mock")
);

// 1. Define Public Routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/calendar(.*)",
  "/customers(.*)",
  "/recovery(.*)",
  "/services(.*)",
  "/messages(.*)",
  "/settings(.*)",
  "/team(.*)",
  "/assistant(.*)",
  "/bottega(.*)",
  "/ea-portal(.*)",
  "/login(.*)",
  "/onboarding(.*)",
  "/boutique(.*)",
  "/shop(.*)",
  "/quiz(.*)",
  "/clinical(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/access-denied(.*)",
  "/api/webhooks(.*)",
]);

// 2. Define Protected Routes
const isDirectorRoute = createRouteMatcher([
  "/salon-portal(.*)",
  "/api/director(.*)",
]);

const isStaffRoute = createRouteMatcher([
  "/staff-calendar(.*)",
  "/api/artisan(.*)",
]);

// Instantiate Clerk middleware only if valid keys are present
const clerkHandler = isClerkConfigured
  ? clerkMiddleware((auth, req) => {
      const { pathname } = req.nextUrl;
      const authObject = auth();
      const userId = authObject.userId;

      // Allow public routes
      if (isPublicRoute(req)) {
        return NextResponse.next();
      }

      // Handle unauthenticated requests
      if (!userId) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Unauthorized", message: "Authentication required." },
            { status: 401 }
          );
        }
        return authObject.redirectToSignIn({ returnBackUrl: req.url });
      }

      // Extract Role from JWT Session Claims
      const sessionClaims = authObject.sessionClaims;
      const userRole = (sessionClaims?.metadata?.role || sessionClaims?.role || "client") as UserRole;

      // Director Role Check
      if (isDirectorRoute(req) && userRole !== "director") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Forbidden", message: "Director credentials required." },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }

      // Artisan/Staff Role Check
      if (isStaffRoute(req) && userRole !== "artisan" && userRole !== "director") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Forbidden", message: "Master Artisan or Director credentials required." },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }

      return NextResponse.next();
    })
  : null;

export default function middleware(req: NextRequest, event: any) {
  if (clerkHandler) {
    return clerkHandler(req, event);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
