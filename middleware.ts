import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has a session token by looking for nextauth session cookie
  const hasSession = request.cookies.has('next-auth.session-token') ||
                     request.cookies.has('__Secure-next-auth.session-token');

  const isLoginPage = request.nextUrl.pathname === '/login';

  // Redirect to login if no session and not already on login page
  if (!hasSession && !isLoginPage) {
    const newUrl = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  // Redirect to home if has session and trying to access login page
  if (hasSession && isLoginPage) {
    const newUrl = new URL('/', request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
