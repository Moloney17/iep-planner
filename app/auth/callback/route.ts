import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Force this route to always run fresh — never cached, never marked "public".
// Without this, Next.js may mark the response as cacheable, which causes
// Vercel/Cloudflare's edge layer to strip the Set-Cookie header entirely
// to avoid leaking one user's session into a shared cache.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);
    response.headers.set('Cache-Control', 'no-store, max-age=0');

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
