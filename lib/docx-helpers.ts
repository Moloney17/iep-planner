import {
  Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType,
  Footer, PageNumber, LevelFormat, IPropertiesOptions,
} from 'docx';

// Shared visual language for every generated Word document (IEP, progress
// report, and any future export). Pulled out of export-docx/route.ts and
// export-report-docx/route.ts, which had each redefined this independently.
export const DOCX_BLUE = '1a3a6b';
export const DOCX_GRAY = '666666';

export function formatDocxDate(d: string): string {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

// Standard US-Letter page setup shared by every generated document.
export const DOCX_PAGE_PROPERTIES: NonNullable<IPropertiesOptions['sections']>[number]['properties'] = {
  page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
};

export interface HeadingSizes { h1: number; h2: number; }

export function makeHeadingBuilder(sizes: HeadingSizes) {
  return (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) => new Paragraph({
    heading: level,
    spacing: { before: 280, after: 120 },
    border: level === HeadingLevel.HEADING_1 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: DOCX_BLUE, space: 4 } } : {},
    children: [new TextRun({ text, font: 'Arial', bold: true, size: level === HeadingLevel.HEADING_1 ? sizes.h1 : sizes.h2, color: DOCX_BLUE })],
  });
}

export function makeBodyBuilder(defaultSpacing: number) {
  return (text: string, spacing = defaultSpacing) => new Paragraph({
    spacing: { after: spacing },
    children: [new TextRun({ text, font: 'Arial', size: 22 })],
  });
}

export function docxParagraphStyles(sizes: HeadingSizes) {
  return [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: sizes.h1, bold: true, font: 'Arial', color: DOCX_BLUE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: sizes.h2, bold: true, font: 'Arial', color: DOCX_BLUE }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
  ];
}

const BULLET_LEVEL = { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] };
const NUMBER_LEVEL = { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] };

export function docxNumberingConfig(includeNumbers: boolean) {
  return includeNumbers ? [BULLET_LEVEL, NUMBER_LEVEL] : [BULLET_LEVEL];
}

// labelText is everything before " | Page X of Y", e.g.
// "Jane Doe | IEP | Generated August 1, 2026"
export function buildDocxFooter(labelText: string): Footer {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `${labelText} | Page `, font: 'Arial', size: 18, color: DOCX_GRAY }),
        new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: DOCX_GRAY }),
        new TextRun({ text: ' of ', font: 'Arial', size: 18, color: DOCX_GRAY }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: DOCX_GRAY }),
      ],
    })],
  });
}
