import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/lib/types';
import { sanitizeStudentData } from '@/lib/sanitize';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const maxDuration = 120;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Rate limiting ---
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const minuteStore = new Map<string, { count: number; resetAt: number }>();
const DAILY_LIMIT = 5;
const MINUTE_LIMIT = 3;

function checkDailyLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const resetAt = midnight.getTime();
  const entry = rateLimitStore.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }
  if (entry.count >= DAILY_LIMIT) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

function checkMinuteLimit(ip: string): boolean {
  const now = Date.now();
  const resetAt = now + 60_000;
  const entry = minuteStore.get(ip);
  if (!entry || now > entry.resetAt) {
    minuteStore.set(ip, { count: 1, resetAt });
    return true;
  }
  if (entry.count >= MINUTE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((v, k) => { if (now > v.resetAt) rateLimitStore.delete(k); });
  minuteStore.forEach((v, k) => { if (now > v.resetAt) minuteStore.delete(k); });
}, 3_600_000);

const SYSTEM_PROMPT = `You are an expert special education coordinator certified in early childhood special education (ECSE) with deep expertise in IDEA 2004 compliance. You create legally sound, educationally meaningful IEPs for children ages 3–8.

LEGAL REQUIREMENTS (IDEA 2004, 34 CFR §300.320):

PLAAFP — Present Levels of Academic Achievement and Functional Performance:
- Describe CURRENT performance using specific, observable, measurable data
- Explain HOW the disability affects involvement in the general education curriculum
- Address ALL areas of identified need
- Use percentages, frequency counts, or standardized scores when data is available
- Include baseline data that makes goals clearly measurable

MEASURABLE ANNUAL GOALS:
- Must be achievable within ONE academic year
- Use format: "Given [conditions], [student] will [observable behavior] with [X%/X out of X] accuracy/frequency as measured by [method], by [timeframe]."
- Every goal must have 2–3 short-term objectives/benchmarks (intermediate steps)
- Write at least one goal per identified area of need
- Goals must be ambitious yet realistic

SERVICES:
- Specify exact frequency (e.g., "3 times per week"), duration ("30 minutes per session"), setting, and provider type
- Tie each service directly to identified needs and goals
- Consider Least Restrictive Environment — maximize inclusion

ACCOMMODATIONS:
- Environmental (seating, sensory, lighting)
- Instructional (visual supports, extended time, modified materials)
- Assessment accommodations (separate setting, read-aloud, scribe)

PROGRESS MONITORING:
- Specify data collection method for each goal domain
- Include who collects data, how often, and the reporting schedule

IMPORTANT: Use person-first language. Be specific and data-driven. Reflect family priorities. Return ONLY a valid JSON object — no markdown, no code fences, no preamble.`;

export async function POST(request: NextRequest) {
  try {
    // IP rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkMinuteLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // Auth check
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
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { allowed, remaining } = checkDailyLimit(user.id);
    if (!allowed) {
      return NextResponse.json(
        { error: `You've reached your daily limit of ${DAILY_LIMIT} IEP generations. Your limit resets at midnight.` },
        { status: 429 }
      );
    }

    const rawStudent = await request.json();
    const student: Student = sanitizeStudentData(rawStudent) as unknown as Student;

    // Ownership check
    const { data: studentRecord, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('id', student.id)
      .single();
    if (studentError || !studentRecord) {
      return NextResponse.json({ error: 'Student not found or access denied.' }, { status: 403 });
    }

    const filledDomains = [
      student.presentLevels.cognitive && 'Cognitive/Academic',
      student.presentLevels.communication && 'Communication/Language',
      student.presentLevels.socialEmotional && 'Social-Emotional',
      student.presentLevels.adaptive && 'Adaptive/Self-Help',
      student.presentLevels.physical && 'Physical/Motor',
    ].filter(Boolean);

    const prompt = `Generate a comprehensive, IDEA-compliant IEP for the following student:

STUDENT INFORMATION:
- Name: ${student.name}
- Date of Birth: ${student.dateOfBirth}
- Grade/Level: ${student.grade}
- IDEA Disability Category: ${student.disabilityCategory}
- IEP Meeting Date: ${student.meetingDate || 'To be determined'}
- Annual Review Date: ${student.reviewDate || 'One year from meeting date'}

PRESENT LEVELS OF PERFORMANCE:
Cognitive/Academic: ${student.presentLevels.cognitive || 'Not assessed — omit goals for this domain'}
Communication/Language: ${student.presentLevels.communication || 'Not assessed — omit goals for this domain'}
Social-Emotional: ${student.presentLevels.socialEmotional || 'Not assessed — omit goals for this domain'}
Adaptive/Self-Help: ${student.presentLevels.adaptive || 'Not assessed — omit goals for this domain'}
Physical/Motor: ${student.presentLevels.physical || 'Not assessed — omit goals for this domain'}

STUDENT STRENGTHS: ${student.strengths || 'Not specified'}
PRIMARY AREAS OF CONCERN: ${student.concerns || 'Not specified'}
FAMILY PRIORITIES: ${student.familyPriorities || 'Not specified'}
CURRENT SERVICES/INTERVENTIONS: ${student.currentServices || 'None reported'}
ENVIRONMENTAL/CONTEXTUAL FACTORS: ${student.environmentalFactors || 'Not specified'}

Identified areas needing goals: ${filledDomains.join(', ')}

Return this exact JSON structure (no other text, no markdown fences):
{
  "plaafp": "Comprehensive PLAAFP narrative in 3-5 paragraphs.",
  "goals": [
    {
      "domain": "Exact domain name",
      "goalStatement": "Full SMART goal",
      "benchmarks": ["Benchmark 1", "Benchmark 2", "Benchmark 3"],
      "successCriteria": "Specific measurable criteria",
      "timeframe": "By annual review date"
    }
  ],
  "services": [
    {
      "serviceType": "Full service name",
      "frequency": "X times per week",
      "duration": "X minutes per session",
      "setting": "Setting description",
      "provider": "Provider title"
    }
  ],
  "accommodations": ["Specific accommodation"],
  "assessmentAccommodations": ["Specific assessment accommodation"],
  "progressMonitoring": [
    {
      "goalDomain": "Domain name",
      "dataCollectionMethod": "Specific method",
      "frequency": "Weekly",
      "responsibleParty": "Role/title",
      "reportingSchedule": "Quarterly"
    }
  ],
  "lreStatement": "LRE justification"
}`;

    // ── STREAMING — pipes chunks directly to client so Vercel never times out ──
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',  // faster than opus for same quality on structured output
      max_tokens: 8000,            // reduced from 16000 — more than enough for a full IEP
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();

          // Log usage after stream completes (fire and forget)
          supabase.from('usage_events').insert({
            user_id: user.id,
            event_type: 'iep_generated',
            metadata: {
              student_name: student.name,
              grade: student.grade,
              disability: student.disabilityCategory,
            }
          }).catch((e: unknown) => console.error('Usage log error:', e));

        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-RateLimit-Remaining': String(remaining),
      },
    });

  } catch (error) {
    console.error('IEP generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate IEP' },
      { status: 500 }
    );
  }
}
