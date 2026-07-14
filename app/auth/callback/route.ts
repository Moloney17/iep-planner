import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    // Create the response ONCE and only ever attach cookies to this same
    // object. Recreating the response inside setAll (as a previous version
    // of this file did) silently drops cookies whenever setAll is called
    // more than once during the exchange — which it is: once to clear the
    // temporary PKCE verifier cookie, and again to set the real session.
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }

    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
}
