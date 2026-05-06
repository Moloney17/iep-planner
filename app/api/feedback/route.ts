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

    const { type, message, page } = await request.json();
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    const typeLabels: Record<string, string> = {
      bug: '🐛 Bug Report',
      feature: '💡 Feature Request',
      general: '💬 General Feedback',
    };

    const typeColors: Record<string, string> = {
      bug: '#dc2626',
      feature: '#2563eb',
      general: '#16a34a',
    };

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SmartIEP <noreply@smartiep.co>',
        to: 'moloney.conor@gmail.com',
        subject: `${typeLabels[type] || '💬 Feedback'} from ${user.email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="background: #1a1a2e; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">💡</span>
              <span style="color: white; font-family: Georgia, serif; font-size: 18px; font-weight: bold;">SmartIEP</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <span style="background: ${typeColors[type] || '#374151'}; color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 100px;">${typeLabels[type] || 'Feedback'}</span>
            </div>

            <h2 style="color: #1a1a2e; margin-bottom: 16px; font-size: 18px;">New feedback received</h2>
            
            <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px;"><strong>From:</strong> ${user.email}</p>
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${user.user_metadata?.full_name || 'Not provided'}</p>
              <p style="margin: 0;"><strong>Page:</strong> ${page || 'Unknown'}</p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #111; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
            </p>
          </div>
        `,
      }),
    });

    // Log to usage_events
    try {
      await supabase.from('usage_events').insert({
        user_id: user.id,
        event_type: 'feedback_submitted',
        metadata: { type, page }
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
  }
}
