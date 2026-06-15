import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() instead of getUser() — reads from cookie, no network call
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith('/auth');
  const isLanding = path === '/landing' || path === '/';
  const isLegal = path.startsWith('/legal');
  const isDashboardArea =
    path.startsWith('/dashboard') ||
    path.startsWith('/students') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/archived') ||
    path.startsWith('/admin');

  // Unauthenticated: redirect protected pages to landing
  if (!user && isDashboardArea) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  // Authenticated: redirect away from auth/landing to dashboard
  if (user && (isAuthPage || isLanding)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  // Only run middleware on actual page routes — skip static files, api routes, images
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
