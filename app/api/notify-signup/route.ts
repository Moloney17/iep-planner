import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SmartIEP <onboarding@resend.dev>',
        to: 'moloney.conor@gmail.com',
        subject: '🎉 New SmartIEP signup',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <svg width="32" height="48" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block">
              <path d="M4 16 C4 6 24 6 24 16 C24 22 20 26 18 30 L10 30 C8 26 4 22 4 16Z" fill="#f5c842"/>
              <rect x="9" y="31" width="10" height="2.5" rx="1" fill="#c08000"/>
              <rect x="9" y="34" width="10" height="2" rx="1" fill="#b07000"/>
              <rect x="10" y="37" width="8" height="3" rx="1.5" fill="#888"/>
            </svg><span style="color: white; font-family: Georgia, serif; font-size: 20px; font-weight: bold; vertical-align: middle; margin-left: 10px;">SmartIEP</span>
            </div>
            <h2 style="color: #1a1a2e; margin-bottom: 16px;">New user signed up</h2>
            <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name || 'Not provided'}</p>
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

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify signup error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
