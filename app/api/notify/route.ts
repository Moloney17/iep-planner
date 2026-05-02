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
    const FROM_EMAIL = 'SmartIEP <onboarding@resend.dev>';

    const sendEmail = async (to: string, subject: string, html: string) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
      }
      return res;
    };

    if (type === 'new_user') {
      // Notify admin of new signup
      await sendEmail(
        ADMIN_EMAIL,
        '🎉 New SmartIEP signup',
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-family: Georgia, serif;">💡 Smart<span style="color: #f5c842;">IEP</span></h1>
          </div>
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">New user signed up</h2>
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
        `
      );
    }

    if (type === 'iep_generated') {
      const studentName = data?.studentName || 'your student';
      const studentId = data?.studentId || '';
      const teacherEmail = user.email!;
      const teacherName = user.user_metadata?.full_name || 'Teacher';

      // 1. Notify the teacher that their IEP is ready
      await sendEmail(
        teacherEmail,
        `✅ IEP ready for ${studentName}`,
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-family: Georgia, serif;">💡 Smart<span style="color: #f5c842;">IEP</span></h1>
          </div>
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Your IEP draft is ready</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Hi ${teacherName}, the AI-generated IEP draft for <strong>${studentName}</strong> is ready for your review.
          </p>
          <div style="background: #f0f7ff; border: 1px solid #b5d4f4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #185fa5;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 0 0 8px; color: #185fa5;"><strong>Grade:</strong> ${data?.grade || 'N/A'}</p>
            <p style="margin: 0; color: #185fa5;"><strong>Disability Category:</strong> ${data?.disability || 'N/A'}</p>
          </div>
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #92400e;">
              ⚠️ <strong>Important:</strong> This is an AI-generated draft. Please review all content carefully with your IEP team before using it in any official capacity.
            </p>
          </div>
          <a href="https://www.smartiep.co/students/${studentId}"
            style="display: inline-block; background: #1a1a2e; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">
            View IEP Draft →
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
            You're receiving this because you generated an IEP on SmartIEP. 
            <a href="https://www.smartiep.co" style="color: #4a90d9;">smartiep.co</a>
          </p>
        </div>
        `
      );

      // 2. Notify admin
      await sendEmail(
        ADMIN_EMAIL,
        `📄 IEP generated — ${studentName}`,
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: #1a1a2e; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-family: Georgia, serif;">💡 Smart<span style="color: #f5c842;">IEP</span></h1>
          </div>
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">IEP Generated</h2>
          <div style="background: #f8f7f4; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px;"><strong>Teacher:</strong> ${teacherEmail}</p>
            <p style="margin: 0 0 8px;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 0 0 8px;"><strong>Grade:</strong> ${data?.grade || 'N/A'}</p>
            <p style="margin: 0 0 8px;"><strong>Disability:</strong> ${data?.disability || 'N/A'}</p>
            <p style="margin: 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
          </div>
        </div>
        `
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
