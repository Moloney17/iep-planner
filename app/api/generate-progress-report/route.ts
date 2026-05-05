import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Student, ProgressNote, PROGRESS_STATUS_LABELS } from '@/lib/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const maxDuration = 120;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    const { student, notes, reportingPeriod }: { student: Student; notes: ProgressNote[]; reportingPeriod: string } = await request.json();

    if (!notes || notes.length === 0) {
      return NextResponse.json({ error: 'No progress notes found to generate report from.' }, { status: 400 });
    }

    // Group notes by goal domain
    const notesByDomain: Record<string, ProgressNote[]> = {};
    notes.forEach(note => {
      if (!notesByDomain[note.goalDomain]) notesByDomain[note.goalDomain] = [];
      notesByDomain[note.goalDomain].push(note);
    });

    const notesText = Object.entries(notesByDomain).map(([domain, domainNotes]) => {
      const sortedNotes = [...domainNotes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return `
DOMAIN: ${domain}
Goal: ${domainNotes[0].goalStatement}
Progress Notes (oldest to newest):
${sortedNotes.map(n => `  - ${n.date}: ${n.currentPerformance} | Status: ${PROGRESS_STATUS_LABELS[n.status]}${n.notes ? ` | Teacher note: ${n.notes}` : ''}`).join('\n')}
Most Recent Status: ${PROGRESS_STATUS_LABELS[sortedNotes[sortedNotes.length - 1].status]}
`;
    }).join('\n---\n');

    const prompt = `You are an expert special education coordinator writing a formal IEP progress report for the following student.

STUDENT: ${student.name}
GRADE: ${student.grade}
DISABILITY CATEGORY: ${student.disabilityCategory}
REPORTING PERIOD: ${reportingPeriod}

ANNUAL GOALS AND PROGRESS DATA:
${notesText}

Write a comprehensive, formal progress report that:
1. For each goal domain, provides a narrative paragraph describing the student's progress with specific data points from the notes
2. Clearly states whether the student is on track, emerging, not yet meeting, or has mastered the goal
3. Notes when a goal has been mastered so the teacher knows to move to the next goal
4. Provides a specific recommendation for each goal (continue current approach / modify instruction / consider goal revision / goal mastered - develop next goal)
5. Ends with an overall summary paragraph suitable for sharing with parents
6. Uses person-first, strengths-based, professional language appropriate for an official IEP progress report
7. References specific data points and dates from the progress notes

Return ONLY valid JSON in this exact format:
{
  "generatedAt": "${new Date().toISOString()}",
  "reportingPeriod": "${reportingPeriod}",
  "narratives": [
    {
      "goalDomain": "domain name",
      "goalStatement": "full goal text",
      "summary": "2-3 paragraph narrative",
      "dataPoints": ["specific data point 1", "specific data point 2"],
      "currentStatus": "on_track|emerging|not_yet|mastered",
      "recommendation": "specific recommendation"
    }
  ],
  "overallSummary": "2-3 paragraph overall summary suitable for parents"
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('Unexpected response format');

    let rawText = textBlock.text.trim();
    const fenceMatch = rawText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (fenceMatch) rawText = fenceMatch[1];

    const report = JSON.parse(rawText);
    return NextResponse.json(report);

  } catch (error) {
    console.error('Progress report error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate report' }, { status: 500 });
  }
}
