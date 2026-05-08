import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Student, GeneratedIEP } from '@/lib/types';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer,
} from 'docx';

export const maxDuration = 30;

function formatDate(d: string): string {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function buildDocx(student: Student, iep: GeneratedIEP): Document {
  const BLUE = '1a3a6b';
  const GRAY = '666666';
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const borders = { top: border, bottom: border, left: border, right: border };

  const heading = (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) => new Paragraph({
    heading: level,
    spacing: { before: 280, after: 120 },
    border: level === HeadingLevel.HEADING_1 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } } : {},
    children: [new TextRun({ text, font: 'Arial', bold: true, size: level === HeadingLevel.HEADING_1 ? 28 : 24, color: BLUE })],
  });

  const body = (text: string, spacing = 160) => new Paragraph({
    spacing: { after: spacing },
    children: [new TextRun({ text, font: 'Arial', size: 22 })],
  });

  const infoCell = (labelText: string, value: string, width = 4680) => new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 150, right: 150 },
    children: [
      new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: labelText.toUpperCase(), font: 'Arial', size: 17, bold: true, color: GRAY })] }),
      new Paragraph({ children: [new TextRun({ text: value || 'N/A', font: 'Arial', size: 22 })] }),
    ],
  });

  const th = (text: string, width: number) => new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: 'e8f0fb', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text.toUpperCase(), font: 'Arial', size: 18, bold: true, color: BLUE })] })],
  });

  const td = (text: string, width: number) => new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text || '', font: 'Arial', size: 20 })] })],
  });

  const infoTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [infoCell('Student Name', student.name), infoCell('Date of Birth', formatDate(student.dateOfBirth))] }),
      new TableRow({ children: [infoCell('Grade / Level', student.grade), infoCell('Disability Category', student.disabilityCategory)] }),
      new TableRow({ children: [infoCell('IEP Meeting Date', formatDate(student.meetingDate)), infoCell('Annual Review Date', formatDate(student.reviewDate))] }),
      new TableRow({ children: [infoCell('Parent / Guardian', student.parentName || ''), infoCell('Contact', student.parentPhone || '')] }),
    ],
  });

  const svcColWidths = [2400, 1500, 1500, 2160, 1800];
  const servicesTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: svcColWidths,
    rows: [
      new TableRow({ children: ['Service Type','Frequency','Duration','Setting','Provider'].map((h, i) => th(h, svcColWidths[i])) }),
      ...iep.services.map(s => new TableRow({
        children: [td(s.serviceType, svcColWidths[0]), td(s.frequency, svcColWidths[1]), td(s.duration, svcColWidths[2]), td(s.setting, svcColWidths[3]), td(s.provider, svcColWidths[4])],
      })),
    ],
  });

  const pmColWidths = [2000, 2800, 1200, 1800, 1560];
  const progressTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: pmColWidths,
    rows: [
      new TableRow({ children: ['Domain','Data Collection Method','Frequency','Responsible Party','Reporting'].map((h, i) => th(h, pmColWidths[i])) }),
      ...iep.progressMonitoring.map(p => new TableRow({
        children: [td(p.goalDomain, pmColWidths[0]), td(p.dataCollectionMethod, pmColWidths[1]), td(p.frequency, pmColWidths[2]), td(p.responsibleParty, pmColWidths[3]), td(p.reportingSchedule, pmColWidths[4])],
      })),
    ],
  });

  const sigLine = (role: string) => new TableCell({
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    width: { size: 3120, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 0, right: 120 },
    children: [
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '333333', space: 2 } }, spacing: { after: 80 }, children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: role, font: 'Arial', size: 18, color: GRAY })] }),
    ],
  });

  const signatureTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [sigLine('Special Education Teacher'), sigLine('General Education Teacher'), sigLine('Parent / Guardian')] }),
      new TableRow({ children: [sigLine('School Psychologist'), sigLine('Administrator / LEA Rep'), sigLine('Student (if applicable)')] }),
    ],
  });

  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Individualized Education Program (IEP)', font: 'Arial', size: 36, bold: true, color: BLUE })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: `${student.name} · ${student.grade} · ${student.disabilityCategory}`, font: 'Arial', size: 22, color: GRAY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Generated: ${formatDate(iep.generatedAt)}`, font: 'Arial', size: 18, italics: true, color: GRAY })] }),
    new Paragraph({
      spacing: { after: 240 },
      border: { left: { style: BorderStyle.SINGLE, size: 16, color: 'f0a500', space: 8 } },
      children: [
        new TextRun({ text: 'DRAFT — FOR PROFESSIONAL REVIEW ONLY. ', font: 'Arial', size: 20, bold: true, color: '7a4f00' }),
        new TextRun({ text: 'Must be reviewed and approved by a qualified IEP team before implementation.', font: 'Arial', size: 20, color: '7a4f00' }),
      ],
    }),

    heading('Student Information'),
    infoTable,
    new Paragraph({ spacing: { after: 120 }, children: [] }),

    heading('Present Levels of Academic Achievement & Functional Performance'),
    ...iep.plaafp.split('\n\n').map(p => body(p)),
    new Paragraph({ spacing: { after: 120 }, children: [] }),

    heading('Measurable Annual Goals'),
    ...iep.goals.flatMap((g, i) => [
      new Paragraph({
        spacing: { before: i > 0 ? 200 : 0, after: 60 },
        children: [new TextRun({ text: `Goal ${i + 1}: ${g.domain}`, font: 'Arial', size: 22, bold: true, color: BLUE })],
      }),
      body(g.goalStatement, 100),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'SHORT-TERM OBJECTIVES', font: 'Arial', size: 18, bold: true, color: GRAY })] }),
      ...g.benchmarks.map(b => new Paragraph({
        numbering: { reference: 'numbers', level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: b, font: 'Arial', size: 20 })],
      })),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Success Criteria: ', font: 'Arial', size: 20, bold: true }), new TextRun({ text: g.successCriteria, font: 'Arial', size: 20 })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Timeframe: ', font: 'Arial', size: 20, bold: true }), new TextRun({ text: g.timeframe, font: 'Arial', size: 20 })] }),
    ]),

    heading('Special Education & Related Services'),
    servicesTable,
    new Paragraph({ spacing: { after: 120 }, children: [] }),

    heading('Classroom Accommodations & Supports'),
    ...iep.accommodations.map(a => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: a, font: 'Arial', size: 22 })] })),
    new Paragraph({ spacing: { after: 120 }, children: [] }),

    ...(iep.assessmentAccommodations.length > 0 ? [
      heading('Assessment Accommodations'),
      ...iep.assessmentAccommodations.map(a => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: a, font: 'Arial', size: 22 })] })),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
    ] : []),

    heading('Progress Monitoring Plan'),
    progressTable,
    new Paragraph({ spacing: { after: 120 }, children: [] }),

    ...(iep.lreStatement ? [
      heading('Least Restrictive Environment (LRE)'),
      body(iep.lreStatement),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
    ] : []),

    heading('IEP Team Signatures'),
    new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'By signing below, IEP team members confirm participation in the development of this IEP.', font: 'Arial', size: 20, italics: true, color: GRAY })] }),
    signatureTable,
  ];

  return new Document({
    numbering: {
      config: [
        { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: BLUE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: BLUE }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${student.name} | IEP | Generated ${formatDate(iep.generatedAt)} | Page `, font: 'Arial', size: 18, color: GRAY }),
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

    const { student, iep }: { student: Student; iep: GeneratedIEP } = await request.json();

    const doc = buildDocx(student, iep);
    const buffer = await Packer.toBuffer(doc);
    const filename = `IEP_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;

    supabase.from('usage_events').insert({
      user_id: user.id,
      event_type: 'docx_exported',
      metadata: { student_name: student.name },
    }).catch(() => {});

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
      },
    });

  } catch (error) {
    console.error('DOCX export error:', error);
    return NextResponse.json({ error: 'Failed to generate Word document' }, { status: 500 });
  }
}
