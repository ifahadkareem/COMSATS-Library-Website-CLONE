/**
 * Next.js Proxy — Route Protection
 *
 * Enforces authentication and role-based authorization at the edge.
 * Checks for the session cookie existence and, for protected routes,
 * fully decrypts and validates the session.
 *
 * This is the FIRST layer of defense. Protected pages also
 * call requireAuth() / requireRole() server-side for defense in depth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SESSION_OPTIONS, type SessionData, type UserRole } from '@/lib/auth';

/** Routes that require authentication */
const PROTECTED_ROUTES = ['/dashboard', '/librarian', '/admin'];

/** Required roles per route prefix */
const ROUTE_ROLES: Record<string, UserRole[]> = {
  '/dashboard': ['STUDENT', 'FACULTY'],
  '/librarian': ['LIBRARIAN'],
  '/admin': ['ADMIN'],
};

/** Routes that should redirect to dashboard if already logged in */
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and _next internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  const session = await getIronSession<SessionData>(request.cookies, SESSION_OPTIONS);
  const isAuthenticated = session.isLoggedIn === true && !!session.userId;

  // Check if current path matches a protected route
  const matchedProtected = PROTECTED_ROUTES.find(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check if current path is an auth page
  const matchedAuth = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (matchedProtected) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check
    const allowedRoles = ROUTE_ROLES[matchedProtected];
    if (allowedRoles && !allowedRoles.includes(session.role as UserRole)) {
      // User is authenticated but doesn't have the right role
      // Redirect to their own dashboard
      const userDashboard =
        session.role === 'STUDENT' || session.role === 'FACULTY'
          ? '/dashboard'
          : session.role === 'LIBRARIAN'
            ? '/librarian'
            : '/admin';
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }
  }

  if (matchedAuth && isAuthenticated) {
    // Already logged in — redirect to appropriate dashboard
    const dashboardPath =
      session.role === 'STUDENT' || session.role === 'FACULTY'
        ? '/dashboard'
        : session.role === 'LIBRARIAN'
          ? '/librarian'
          : '/admin';
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
