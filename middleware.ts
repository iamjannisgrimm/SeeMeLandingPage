import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the analytics dashboard main route and subpages,
  // but allow the login page itself to load without a token.
  if (pathname.startsWith('/analytics-dashboard') && pathname !== '/analytics-dashboard/login') {
    // Check for authentication token in cookie or header
    const authToken = request.cookies.get('analytics_auth')?.value ||
                     request.headers.get('x-analytics-auth');

    const validToken = process.env.ANALYTICS_DASHBOARD_TOKEN;

    // If no valid token is set, block access
    if (!validToken || authToken !== validToken) {
      // Return 404 instead of 401 to hide the existence of the route
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/analytics-dashboard/:path*',
};
