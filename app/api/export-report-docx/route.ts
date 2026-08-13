import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Student, ProgressReport } from '@/lib/types';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, WidthType, LevelFormat, PageNumber, Footer,
  HeadingLevel,
} from 'docx';

export const maxDuration = 30;

function formatDate(d: string): string {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function buildReportDocx(student: Student, report: ProgressReport): Document {
  const BLUE = '1a3a6b';
  const PURPLE = '6b21a8';
  const GRAY = '666666';

  const heading = (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) => new Paragraph({
    heading: level,
    spacing: { before: 280, after: 120 },
    border: level === HeadingLevel.HEADING_1 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } } : {},
    children: [new TextRun({ text, font: 'Arial', bold: true, size: level === HeadingLevel.HEADING_1 ? 26 : 22, color: BLUE })],
  });

  const body = (text: string, spacing = 140) => new Paragraph({
    spacing: { after: spacing },
    children: [new TextRun({ text, font: 'Arial', size: 22 })],
  });

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
      children: [new TextRun({ text: `Generated: ${formatDate(report.generatedAt)}`, font: 'Arial', size: 18, italics: true, color: GRAY })],
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
    numbering: {
      config: [
        { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: BLUE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, font: 'Arial', color: BLUE }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${student.name} | Progress Report — ${report.reportingPeriod} | Page `, font: 'Arial', size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: GRAY }),
              new TextRun({ text: ' of ', font: 'Arial', size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: GRAY }),
            ],
          })],
        }),
      },
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
