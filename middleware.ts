import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check for Supabase auth cookie directly — no network call needed
  const cookies = request.cookies.getAll();
  const isLoggedIn = cookies.some(c =>
    c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  const isAuthPage = path.startsWith('/auth');
  const isLanding = path === '/landing' || path === '/';
  const isDashboardArea =
    path.startsWith('/dashboard') ||
    path.startsWith('/students') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/archived') ||
    path.startsWith('/admin');

  // Not logged in trying to access protected pages → send to landing
  if (!isLoggedIn && isDashboardArea) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  // Logged in hitting landing or auth pages → send to dashboard
  if (isLoggedIn && (isAuthPage || isLanding)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
