import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const cookies = request.cookies.getAll();
  const isLoggedIn = cookies.some(c =>
    c.name.startsWith('sb-') && c.name.includes('-auth-token')
  );

  const isAuthPage = path.startsWith('/auth');
  const isLanding = path === '/landing' || path === '/';
  const isDashboardArea =
    path.startsWith('/dashboard') ||
    path.startsWith('/students') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/archived') ||
    path.startsWith('/admin');

  if (!isLoggedIn && isDashboardArea) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  if (isLoggedIn && (isAuthPage || isLanding)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // /auth/callback is excluded — it must always run its own logic to
    // complete the OAuth code exchange, regardless of any cookies present
    // on the incoming request (a leftover PKCE verifier cookie was being
    // misread as a valid session, causing this route to get redirected
    // away before it could ever run).
    '/((?!_next/static|_next/image|favicon.ico|api/|auth/callback).*)',
  ],
};
