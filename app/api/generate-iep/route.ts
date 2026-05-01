import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/lib/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const maxDuration = 120;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Rate limiting using a simple in-memory store ---
// For production scale, swap this for Redis/Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const DAILY_LIMIT = 5;        // max IEP generations per user per day
const MINUTE_LIMIT = 3;       // max requests per IP per minute
const minuteStore = new Map<string, { count: number; resetAt: number }>();

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
  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
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

// Clean up old entries every hour to prevent memory leak
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
    // --- IP-based minute rate limit ---
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkMinuteLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // --- Auth check + daily per-user rate limit ---
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
        { error: `You've reached your daily limit of ${DAILY_LIMIT} IEP generations. Your limit resets at midnight. Please try again tomorrow.` },
        { status: 429 }
      );
    }

    const student: Student = await request.json();

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

Return this exact JSON structure (no other text):
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

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    if (response.stop_reason === 'max_tokens') {
      throw new Error('Response was too long to complete. Try filling in fewer domain fields at once.');
    }

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude. Please try again.');
    }

    let rawText = textBlock.text.trim();
    const fenceMatch = rawText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (fenceMatch) rawText = fenceMatch[1];

    let iepData;
    try {
      iepData = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { iepData = JSON.parse(match[0]); }
        catch { throw new Error('Claude returned invalid JSON. Please try again.'); }
      } else {
        throw new Error('Claude did not return the expected format. Please try again.');
      }
    }

    iepData.generatedAt = new Date().toISOString();
    // Fire-and-forget admin notification
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://www.smartiep.co' : 'http://localhost:3000';
    fetch(`${baseUrl}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
      body: JSON.stringify({ type: 'iep_generated', data: { studentName: student.name, grade: student.grade, disability: student.disabilityCategory, studentId: student.id } }),
    }).catch(() => {});


    const res = NextResponse.json(iepData);
    res.headers.set('X-RateLimit-Remaining', String(remaining));
    return res;

  } catch (error) {
    console.error('IEP generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate IEP' },
      { status: 500 }
    );
  }
}
