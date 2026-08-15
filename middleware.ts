import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // `response` starts as a pass-through and gets reassigned inside setAll()
  // below whenever Supabase needs to write refreshed session cookies back
  // to the browser. It must be the object we ultimately return in the
  // fall-through case, or a refreshed token never makes it to the client.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Previously this only checked whether a cookie named like
  // `sb-*-auth-token` existed, without checking whether the session inside
  // it was still valid. A stale/expired cookie (left over from an earlier
  // sign-in) was enough to satisfy that check, so middleware would send
  // visitors straight to /dashboard even though they weren't really
  // authenticated. The page would then load with an empty student list and
  // no Sign Out button, because the client-side Supabase calls correctly
  // saw no valid session — there was just no way back to /landing.
  // getUser() actually verifies the session against Supabase Auth (and
  // refreshes it via setAll() above if needed), so isLoggedIn now reflects
  // reality instead of just cookie presence.
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

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

  return response;
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
