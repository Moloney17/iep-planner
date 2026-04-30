import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/lib/types';

export const maxDuration = 120;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
- Age: calculated from DOB
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
  "plaafp": "Comprehensive PLAAFP narrative in 3-5 paragraphs. Cover all assessed domains. Include specific data from present levels. Explain how the disability affects participation in general education. Reference family priorities.",
  "goals": [
    {
      "domain": "Exact domain name from: Cognitive/Academic, Communication/Language, Social-Emotional, Adaptive/Self-Help, Physical/Motor",
      "goalStatement": "Full SMART goal using the format: Given [conditions], [student name] will [observable behavior] with [measurable criteria] as measured by [method], by [timeframe].",
      "benchmarks": [
        "Benchmark 1 — intermediate step toward the annual goal",
        "Benchmark 2 — intermediate step toward the annual goal",
        "Benchmark 3 — intermediate step toward the annual goal"
      ],
      "successCriteria": "Specific, measurable criteria for goal mastery",
      "timeframe": "By annual review date or specific month"
    }
  ],
  "services": [
    {
      "serviceType": "Full service name (e.g., Special Education — Resource Support, Speech-Language Therapy, Occupational Therapy)",
      "frequency": "X times per week",
      "duration": "X minutes per session",
      "setting": "Setting description (e.g., general education classroom, resource room, therapy room)",
      "provider": "Provider title (e.g., Special Education Teacher, Speech-Language Pathologist)"
    }
  ],
  "accommodations": [
    "Specific accommodation description"
  ],
  "assessmentAccommodations": [
    "Specific assessment accommodation"
  ],
  "progressMonitoring": [
    {
      "goalDomain": "Domain name",
      "dataCollectionMethod": "Specific method (e.g., weekly probes, observation checklists, work samples)",
      "frequency": "Daily / Weekly / Bi-weekly / Monthly",
      "responsibleParty": "Role/title of person responsible",
      "reportingSchedule": "Quarterly progress reports / With report cards / Monthly"
    }
  ],
  "lreStatement": "Explanation of the extent to which the student will participate with non-disabled peers and justification for any pull-out services."
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    // Check if response was cut off before completing
    if (response.stop_reason === 'max_tokens') {
      throw new Error('Response was too long to complete. Try filling in fewer domain fields at once, or contact support.');
    }

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error(`Unexpected response format from Claude (stop_reason: ${response.stop_reason}). Please try again.`);
    }

    let rawText = textBlock.text.trim();

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    const fenceMatch = rawText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (fenceMatch) rawText = fenceMatch[1];

    let iepData;
    try {
      iepData = JSON.parse(rawText);
    } catch {
      // Last resort: find the outermost { ... } block
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          iepData = JSON.parse(match[0]);
        } catch {
          console.error('Raw Claude response:', rawText.slice(0, 500));
          throw new Error('Claude returned invalid JSON. Please try again — this is usually a one-time issue.');
        }
      } else {
        console.error('Raw Claude response:', rawText.slice(0, 500));
        throw new Error('Claude did not return the expected format. Please try again.');
      }
    }

    iepData.generatedAt = new Date().toISOString();
    return NextResponse.json(iepData);
  } catch (error) {
    console.error('IEP generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate IEP' },
      { status: 500 }
    );
  }
}
