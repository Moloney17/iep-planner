import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'moloney.conor@gmail.com';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = Object.fromEntries(new URL(request.url).searchParams);

    if (type === 'stats') {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === 'users') {
      const { data, error } = await supabase.rpc('get_all_users');
      if (error) throw error;
      return NextResponse.json(data || []);
    }

    if (type === 'daily') {
      const { data, error } = await supabase.rpc('get_daily_iep_counts');
      if (error) throw error;
      return NextResponse.json(data || []);
    }

    if (type === 'recent') {
      const { data, error } = await supabase
        .from('usage_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return NextResponse.json(data || []);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
