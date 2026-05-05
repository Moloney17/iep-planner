import { NextRequest, NextResponse } from 'next/server';
import { Student, ProgressNote } from '@/lib/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function formatDate(d: string) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US'); } catch { return d; }
}

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map(row => headers.map(h => csvEscape(row[h])).join(',')),
  ];
  return lines.join('\n');
}

function buildUniversalCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  const rows: Record<string, unknown>[] = [];

  if (!iep) return 'No IEP generated for this student.';

  iep.goals.forEach((goal, i) => {
    const goalNotes = notes.filter(n => n.goalDomain === goal.domain);
    const latestNote = goalNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'Student Name': student.name,
      'Date of Birth': formatDate(student.dateOfBirth),
      'Grade': student.grade,
      'Disability Category': student.disabilityCategory,
      'IEP Meeting Date': formatDate(student.meetingDate),
      'Annual Review Date': formatDate(student.reviewDate),
      'Parent/Guardian': student.parentName || '',
      'Parent Email': student.parentEmail || '',
      'Parent Phone': student.parentPhone || '',
      'Goal #': i + 1,
      'Goal Domain': goal.domain,
      'Annual Goal': goal.goalStatement,
      'Success Criteria': goal.successCriteria,
      'Timeframe': goal.timeframe,
      'Benchmark 1': goal.benchmarks[0] || '',
      'Benchmark 2': goal.benchmarks[1] || '',
      'Benchmark 3': goal.benchmarks[2] || '',
      'Current Progress': latestNote?.currentPerformance || '',
      'Progress Status': latestNote ? latestNote.status.replace('_', ' ') : '',
      'Last Progress Date': latestNote ? formatDate(latestNote.date) : '',
      'IEP Generated Date': formatDate(iep.generatedAt),
    });
  });

  return toCSV(rows);
}

function buildFrontlineCSV(student: Student, notes: ProgressNote[]): string {
  // Frontline Special Ed (Exceed) commonly used field format
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const goalNotes = notes.filter(n => n.goalDomain === goal.domain);
    const latestNote = goalNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    rows.push({
      'LASID': '',
      'SASID': '',
      'LastName': student.name.split(' ').slice(-1)[0],
      'FirstName': student.name.split(' ')[0],
      'DOB': formatDate(student.dateOfBirth),
      'Grade': student.grade,
      'DisabilityCode': student.disabilityCategory,
      'MeetingDate': formatDate(student.meetingDate),
      'AnnualReviewDate': formatDate(student.reviewDate),
      'ParentName': student.parentName || '',
      'ParentEmail': student.parentEmail || '',
      'GoalNumber': i + 1,
      'GoalArea': goal.domain,
      'GoalDescription': goal.goalStatement,
      'Benchmark1': goal.benchmarks[0] || '',
      'Benchmark2': goal.benchmarks[1] || '',
      'Benchmark3': goal.benchmarks[2] || '',
      'MeasurementMethod': goal.successCriteria,
      'ProgressCode': latestNote ? latestNote.status : '',
      'ProgressNarrative': latestNote?.currentPerformance || '',
      'ProgressDate': latestNote ? formatDate(latestNote.date) : '',
    });
  });

  // Services
  iep.services.forEach(s => {
    rows.push({
      'LASID': '',
      'SASID': '',
      'LastName': student.name.split(' ').slice(-1)[0],
      'FirstName': student.name.split(' ')[0],
      'DOB': formatDate(student.dateOfBirth),
      'Grade': student.grade,
      'DisabilityCode': student.disabilityCategory,
      'MeetingDate': formatDate(student.meetingDate),
      'AnnualReviewDate': formatDate(student.reviewDate),
      'ParentName': student.parentName || '',
      'ParentEmail': student.parentEmail || '',
      'GoalNumber': 'SERVICE',
      'GoalArea': s.serviceType,
      'GoalDescription': `${s.frequency} | ${s.duration} | ${s.setting} | ${s.provider}`,
      'Benchmark1': '', 'Benchmark2': '', 'Benchmark3': '',
      'MeasurementMethod': '', 'ProgressCode': '', 'ProgressNarrative': '', 'ProgressDate': '',
    });
  });

  return toCSV(rows);
}

function buildIEPDirectCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const latestNote = notes
      .filter(n => n.goalDomain === goal.domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'student_last_name': student.name.split(' ').slice(-1)[0],
      'student_first_name': student.name.split(' ')[0],
      'student_dob': formatDate(student.dateOfBirth),
      'student_grade': student.grade,
      'disability_category': student.disabilityCategory,
      'iep_start_date': formatDate(student.meetingDate),
      'iep_end_date': formatDate(student.reviewDate),
      'guardian_name': student.parentName || '',
      'guardian_email': student.parentEmail || '',
      'goal_seq': i + 1,
      'goal_domain': goal.domain,
      'annual_goal': goal.goalStatement,
      'short_term_obj_1': goal.benchmarks[0] || '',
      'short_term_obj_2': goal.benchmarks[1] || '',
      'short_term_obj_3': goal.benchmarks[2] || '',
      'evaluation_criteria': goal.successCriteria,
      'progress_level': latestNote?.status || '',
      'progress_description': latestNote?.currentPerformance || '',
      'progress_date': latestNote ? formatDate(latestNote.date) : '',
    });
  });

  return toCSV(rows);
}

function buildSkywardCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const latestNote = notes
      .filter(n => n.goalDomain === goal.domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'StudentID': '',
      'StudentLastName': student.name.split(' ').slice(-1)[0],
      'StudentFirstName': student.name.split(' ')[0],
      'BirthDate': formatDate(student.dateOfBirth),
      'GradeLevel': student.grade,
      'PrimaryDisability': student.disabilityCategory,
      'IEPBeginDate': formatDate(student.meetingDate),
      'IEPEndDate': formatDate(student.reviewDate),
      'ParentGuardianName': student.parentName || '',
      'ContactEmail': student.parentEmail || '',
      'GoalSequence': i + 1,
      'GoalArea': goal.domain,
      'GoalText': goal.goalStatement,
      'Objective1': goal.benchmarks[0] || '',
      'Objective2': goal.benchmarks[1] || '',
      'Objective3': goal.benchmarks[2] || '',
      'MasteryLevel': goal.successCriteria,
      'ProgressIndicator': latestNote?.status || '',
      'ProgressComment': latestNote?.currentPerformance || '',
      'ProgressReportDate': latestNote ? formatDate(latestNote.date) : '',
      'LREStatement': iep.lreStatement || '',
    });
  });

  iep.services.forEach(s => {
    rows.push({
      'StudentID': '', 'StudentLastName': student.name.split(' ').slice(-1)[0],
      'StudentFirstName': student.name.split(' ')[0], 'BirthDate': formatDate(student.dateOfBirth),
      'GradeLevel': student.grade, 'PrimaryDisability': student.disabilityCategory,
      'IEPBeginDate': formatDate(student.meetingDate), 'IEPEndDate': formatDate(student.reviewDate),
      'ParentGuardianName': student.parentName || '', 'ContactEmail': student.parentEmail || '',
      'GoalSequence': 'SVC', 'GoalArea': s.serviceType,
      'GoalText': `${s.frequency} for ${s.duration} in ${s.setting} with ${s.provider}`,
      'Objective1': '', 'Objective2': '', 'Objective3': '', 'MasteryLevel': '',
      'ProgressIndicator': '', 'ProgressComment': '', 'ProgressReportDate': '', 'LREStatement': '',
    });
  });

  return toCSV(rows);
}

function buildPowerSchoolCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const latestNote = notes
      .filter(n => n.goalDomain === goal.domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'Local_ID': '',
      'State_ID': '',
      'Last_Name': student.name.split(' ').slice(-1)[0],
      'First_Name': student.name.split(' ')[0],
      'Date_of_Birth': formatDate(student.dateOfBirth),
      'Grade': student.grade,
      'Primary_Exceptionality': student.disabilityCategory,
      'Plan_Start_Date': formatDate(student.meetingDate),
      'Plan_End_Date': formatDate(student.reviewDate),
      'Parent_Name': student.parentName || '',
      'Parent_Email': student.parentEmail || '',
      'Goal_Number': i + 1,
      'Goal_Subject_Area': goal.domain,
      'Goal_Description': goal.goalStatement,
      'Benchmark_1': goal.benchmarks[0] || '',
      'Benchmark_2': goal.benchmarks[1] || '',
      'Benchmark_3': goal.benchmarks[2] || '',
      'Evaluation_Procedure': goal.successCriteria,
      'Progress_Code': latestNote?.status || '',
      'Progress_Notes': latestNote?.currentPerformance || '',
      'Progress_Date': latestNote ? formatDate(latestNote.date) : '',
    });
  });

  return toCSV(rows);
}

function buildSpediCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const latestNote = notes
      .filter(n => n.goalDomain === goal.domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'student_name': student.name,
      'dob': formatDate(student.dateOfBirth),
      'grade': student.grade,
      'disability': student.disabilityCategory,
      'iep_date': formatDate(student.meetingDate),
      'review_date': formatDate(student.reviewDate),
      'parent': student.parentName || '',
      'parent_email': student.parentEmail || '',
      'goal_number': i + 1,
      'area': goal.domain,
      'goal': goal.goalStatement,
      'benchmark_1': goal.benchmarks[0] || '',
      'benchmark_2': goal.benchmarks[1] || '',
      'benchmark_3': goal.benchmarks[2] || '',
      'criteria': goal.successCriteria,
      'timeframe': goal.timeframe,
      'progress': latestNote?.status || '',
      'performance_data': latestNote?.currentPerformance || '',
      'progress_date': latestNote ? formatDate(latestNote.date) : '',
      'accommodations': iep.accommodations.join('; '),
    });
  });

  return toCSV(rows);
}

function buildEdioCSV(student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated.';
  const rows: Record<string, unknown>[] = [];

  iep.goals.forEach((goal, i) => {
    const latestNote = notes
      .filter(n => n.goalDomain === goal.domain)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    rows.push({
      'ExternalStudentID': '',
      'StudentFirstName': student.name.split(' ')[0],
      'StudentLastName': student.name.split(' ').slice(-1)[0],
      'StudentDOB': formatDate(student.dateOfBirth),
      'StudentGrade': student.grade,
      'DisabilityCategory': student.disabilityCategory,
      'IEPStartDate': formatDate(student.meetingDate),
      'IEPEndDate': formatDate(student.reviewDate),
      'GuardianName': student.parentName || '',
      'GuardianEmail': student.parentEmail || '',
      'GoalID': i + 1,
      'GoalCategory': goal.domain,
      'GoalText': goal.goalStatement,
      'ShortTermGoal1': goal.benchmarks[0] || '',
      'ShortTermGoal2': goal.benchmarks[1] || '',
      'ShortTermGoal3': goal.benchmarks[2] || '',
      'SuccessCriteria': goal.successCriteria,
      'ProgressStatus': latestNote?.status || '',
      'ProgressData': latestNote?.currentPerformance || '',
      'ProgressDate': latestNote ? formatDate(latestNote.date) : '',
      'ServiceType': iep.services.map(s => s.serviceType).join('; '),
      'ServiceFrequency': iep.services.map(s => s.frequency).join('; '),
      'LRE': iep.lreStatement || '',
    });
  });

  return toCSV(rows);
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

    const { student, notes, system }: { student: Student; notes: ProgressNote[]; system: string } = await request.json();

    let csv = '';
    switch (system) {
      case 'frontline': csv = buildFrontlineCSV(student, notes); break;
      case 'iep_direct': csv = buildIEPDirectCSV(student, notes); break;
      case 'skyward': csv = buildSkywardCSV(student, notes); break;
      case 'powerschool': csv = buildPowerSchoolCSV(student, notes); break;
      case 'spedi': csv = buildSpediCSV(student, notes); break;
      case 'edio': csv = buildEdioCSV(student, notes); break;
      default: csv = buildUniversalCSV(student, notes);
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${student.name.replace(/\s+/g, '_')}_IEP_${system}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: 500 });
  }
}
