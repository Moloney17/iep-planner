import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Simple lightweight query to keep Supabase awake
    const { error } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Keep-alive failed:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
