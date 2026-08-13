import { NextRequest, NextResponse } from 'next/server';

// This route runs right after supabase.auth.signUp() on the client, before
// email confirmation completes — there is no session yet, so it can't
// require auth like the other routes. Instead it's rate-limited per IP and
// validates the email shape, since it's otherwise an open, unauthenticated
// trigger for outbound email sends.
const minuteStore = new Map<string, { count: number; resetAt: number }>();
const MINUTE_LIMIT = 5;

function checkMinuteLimit(ip: string): boolean {
  const now = Date.now();
  const entry = minuteStore.get(ip);
  if (!entry || now > entry.resetAt) {
    minuteStore.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= MINUTE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  minuteStore.forEach((v, k) => { if (now > v.resetAt) minuteStore.delete(k); });
}, 3_600_000);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkMinuteLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const { name, email } = await request.json();
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Missing or invalid email' }, { status: 400 });
    }
    const safeName = typeof name === 'string' ? name.slice(0, 200) : '';
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SmartIEP <admin@smartiep.co>',
        to: 'admin@smartiep.co',
        subject: '🎉 New SmartIEP signup',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-family: Georgia, serif;">💡 Smart<span style="color: #f5c842;">IEP</span></h1>
            </div>
            <h2 style="color: #1a1a2e; margin-bottom: 16px;">New user signed up</h2>
            <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(safeName) || 'Not provided'}</p>
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
