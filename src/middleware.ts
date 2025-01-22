import { NextResponse } from "next/server";

import {
  adminRoutes,
  authRoutes,
  isUserSpecificRoute,
  publicRoutes,
  superAdminRoutes,
  userRoutes,
} from "./lib/session/routes";
import { getSession } from "./lib/session/session";

export async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Skip middleware for all OAuth callback related routes
  if (
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/fetching-data") ||
    pathname.includes("oauth")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Get session and user details
    const session = await getSession();

    // Handle auth routes (login, register, etc.)
    if (authRoutes.includes(pathname)) {
      if (session) {
        // If user is already logged in, redirect based on their role
        if (session.user.role === "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/SUPER_ADMIN/dashboard", url));
        } else if (session.user.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/home", url));
        } else {
          return NextResponse.redirect(new URL(`/dashboard/${session.user.id}/home`, url));
        }
      }
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!session) {
      // Delete the session cookie if it exists but is invalid
      const response = NextResponse.redirect(new URL("/auth/login", url));
      response.cookies.delete("bytealley");
      return response;
    }

    // Handle routes based on user role
    switch (session.user.role) {
      case "SUPER_ADMIN": {
        // Super admin can access everything
        if (
          [...superAdminRoutes, ...adminRoutes, ...userRoutes].some((route) => pathname.startsWith(route.split(":")[0]))
        ) {
          return NextResponse.next();
        }
        break;
      }

      case "ADMIN": {
        // Admin can access admin routes and user routes
        if ([...adminRoutes, ...userRoutes].some((route) => pathname.startsWith(route.split(":")[0]))) {
          return NextResponse.next();
        }
        break;
      }

      case "USER": {
        // Users can only access their own routes
        const isUserRoute = userRoutes.some((route) => {
          if (isUserSpecificRoute(session.user.id!, route)) {
            const actualRoute = route.replace(":userID", session.user.id!);
            return pathname.startsWith(actualRoute);
          }
          return false;
        });

        if (isUserRoute) {
          return NextResponse.next();
        }
        break;
      }

      default: {
        // Invalid role or no role
        return NextResponse.redirect(new URL("/auth/login", url));
      }
    }

    // If none of the above conditions are met, redirect to appropriate homepage
    if (session.user.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/SUPER_ADMIN/dashboard", url));
    } else if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/home", url));
    } else {
      return NextResponse.redirect(new URL(`/dashboard/${session.user.id}/home`, url));
    }
  } catch {
    // Handle any session errors (including expired tokens)
    if (pathname !== "/auth/login") {
      const response = NextResponse.redirect(new URL("/auth/login", url));
      response.cookies.delete("bytealley");
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static (static files)
     * - images (image files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    "/((?!api|_next|static|images|favicon.ico|public).*)",
  ],
};
