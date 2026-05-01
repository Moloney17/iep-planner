import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, data } = await request.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = 'moloney.conor@gmail.com';
    const FROM_EMAIL = 'notifications@smartiep.co';

    if (type === 'new_user') {
      // Notify admin of new signup
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: '🎉 New SmartIEP signup',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
              <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 20px;">📋 SmartIEP</h1>
              </div>
              <h2 style="color: #1a1a2e;">New user signed up</h2>
              <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <p style="margin: 0 0 8px;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 0 0 8px;"><strong>Name:</strong> ${data?.name || 'Not provided'}</p>
                <p style="margin: 0;"><strong>Signed up:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
              </div>
              <a href="https://supabase.com/dashboard/project/ngqexevbjkvohvxqtfzo/auth/users" 
                style="display: inline-block; background: #4a90d9; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                View in Supabase →
              </a>
            </div>
          `,
        }),
      });
    }

    if (type === 'iep_generated') {
      // Notify admin of IEP generation
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `📄 IEP generated — ${data?.studentName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
              <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 20px;">📋 SmartIEP</h1>
              </div>
              <h2 style="color: #1a1a2e;">IEP Generated</h2>
              <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <p style="margin: 0 0 8px;"><strong>Teacher:</strong> ${user.email}</p>
                <p style="margin: 0 0 8px;"><strong>Student:</strong> ${data?.studentName || 'Unknown'}</p>
                <p style="margin: 0 0 8px;"><strong>Grade:</strong> ${data?.grade || 'Unknown'}</p>
                <p style="margin: 0 0 8px;"><strong>Disability:</strong> ${data?.disability || 'Unknown'}</p>
                <p style="margin: 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
              </div>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
