import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: We can't access localStorage in middleware, so we'll rely on the backend for auth
// This middleware only protects routes based on URL patterns

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no authentication needed)
  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/about' ||
    pathname.startsWith('/items');

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, we'll let the component handle authentication
  // The backend will validate the token
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};