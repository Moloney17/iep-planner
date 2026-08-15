import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Student, ProgressReport } from '@/lib/types';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle,
} from 'docx';
import {
  DOCX_BLUE, DOCX_GRAY, formatDocxDate, DOCX_PAGE_PROPERTIES,
  makeHeadingBuilder, makeBodyBuilder, docxParagraphStyles, docxNumberingConfig, buildDocxFooter,
} from '@/lib/docx-helpers';

export const maxDuration = 30;

function buildReportDocx(student: Student, report: ProgressReport): Document {
  const BLUE = DOCX_BLUE;
  const PURPLE = '6b21a8';
  const GRAY = DOCX_GRAY;

  const heading = makeHeadingBuilder({ h1: 26, h2: 22 });
  const body = makeBodyBuilder(140);

  const label = (text: string) => new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), font: 'Arial', size: 17, bold: true, color: GRAY })],
  });

  const children = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: 'IEP Progress Report', font: 'Arial', size: 36, bold: true, color: BLUE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: `${student.name} · ${student.grade} · ${student.disabilityCategory}`, font: 'Arial', size: 22, color: GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: `Reporting Period: ${report.reportingPeriod}`, font: 'Arial', size: 22, bold: true, color: PURPLE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `Generated: ${formatDocxDate(report.generatedAt)}`, font: 'Arial', size: 18, italics: true, color: GRAY })],
    }),

    // Disclaimer
    new Paragraph({
      spacing: { after: 240 },
      border: { left: { style: BorderStyle.SINGLE, size: 16, color: 'f0a500', space: 8 } },
      children: [
        new TextRun({ text: 'AI-GENERATED REPORT — FOR PROFESSIONAL REVIEW ONLY. ', font: 'Arial', size: 19, bold: true, color: '7a4f00' }),
        new TextRun({ text: 'Review all content before sharing with families or using in official records.', font: 'Arial', size: 19, color: '7a4f00' }),
      ],
    }),

    // Narratives
    ...report.narratives.flatMap((n, i) => [
      new Paragraph({
        spacing: { before: i > 0 ? 240 : 0, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'e8f0fb', space: 4 } },
        children: [new TextRun({ text: n.goalDomain, font: 'Arial', size: 26, bold: true, color: BLUE })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: 'Status: ', font: 'Arial', size: 20, bold: true, color: GRAY }),
          new TextRun({ text: n.currentStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), font: 'Arial', size: 20, bold: true }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: 'GOAL', font: 'Arial', size: 17, bold: true, color: GRAY })],
      }),
      new Paragraph({
        spacing: { after: 140 },
        children: [new TextRun({ text: n.goalStatement, font: 'Arial', size: 20, italics: true, color: '444444' })],
      }),
      label('Progress Summary'),
      body(n.summary),
      ...(n.dataPoints.length > 0 ? [
        label('Key Data Points'),
        ...n.dataPoints.map(dp => new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: dp, font: 'Arial', size: 20 })],
        })),
        new Paragraph({ spacing: { after: 80 }, children: [] }),
      ] : []),
      label('Recommendation'),
      new Paragraph({
        spacing: { after: 160 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: '3b82f6', space: 8 } },
        children: [new TextRun({ text: n.recommendation, font: 'Arial', size: 21, color: '1e40af' })],
      }),
    ]),

    // Overall summary
    heading('Overall Summary'),
    body(report.overallSummary, 240),
  ];

  return new Document({
    numbering: { config: docxNumberingConfig(false) },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: docxParagraphStyles({ h1: 26, h2: 22 }),
    },
    sections: [{
      properties: DOCX_PAGE_PROPERTIES,
      footers: { default: buildDocxFooter(`${student.name} | Progress Report — ${report.reportingPeriod}`) },
      children,
    }],
  });
}

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

    const { student, report }: { student: Student; report: ProgressReport } = await request.json();

    // Verify student belongs to requesting user
    const { data: studentRecord, error: studentError } = await supabase
      .from('students')
      .select('id, user_id')
      .eq('id', student.id)
      .single();
    if (studentError || !studentRecord || studentRecord.user_id !== user.id) {
      return NextResponse.json({ error: 'Student not found or access denied.' }, { status: 403 });
    }

    const doc = buildReportDocx(student, report);
    const buffer = await Packer.toBuffer(doc);
    const filename = `ProgressReport_${student.name.replace(/\s+/g, '_')}_${report.reportingPeriod.replace(/[^a-z0-9]/gi, '_')}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
      },
    });

  } catch (error) {
    console.error('Progress report DOCX error:', error);
    return NextResponse.json({ error: 'Failed to generate Word document' }, { status: 500 });
  }
}
