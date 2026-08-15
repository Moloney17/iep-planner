import { NextRequest, NextResponse } from 'next/server';
import { Student, ProgressNote, GeneratedIEP, IEPGoal, IEPService } from '@/lib/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function formatDate(d: string) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US'); } catch { return d; }
}

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // Neutralize CSV/formula injection: if a value starts with a character a
  // spreadsheet app would interpret as a formula trigger, prefix it with a
  // single quote so it's read back as plain text instead of executed.
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
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

function lastName(name: string) { return name.split(' ').slice(-1)[0]; }
function firstName(name: string) { return name.split(' ')[0]; }

function latestNoteFor(notes: ProgressNote[], domain: string): ProgressNote | undefined {
  return notes.filter(n => n.goalDomain === domain)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

// Each SIS export used to be its own ~50-line function that repeated the
// same "loop goals, look up latest note, loop services" structure with a
// different field map bolted on. That structure is now shared below; each
// system just supplies its own field-mapping functions.
type Row = Record<string, unknown>;
type GoalRowBuilder = (student: Student, iep: GeneratedIEP, goal: IEPGoal, index: number, latestNote: ProgressNote | undefined) => Row;
type ServiceRowBuilder = (student: Student, iep: GeneratedIEP, service: IEPService) => Row;

interface CsvSystem {
  buildGoalRow: GoalRowBuilder;
  buildServiceRow?: ServiceRowBuilder;
}

const CSV_SYSTEMS: Record<string, CsvSystem> = {
  universal: {
    buildGoalRow: (student, iep, goal, i, latestNote) => ({
      'Student Name': student.name, 'Date of Birth': formatDate(student.dateOfBirth), 'Grade': student.grade,
      'Disability Category': student.disabilityCategory, 'IEP Meeting Date': formatDate(student.meetingDate),
      'Annual Review Date': formatDate(student.reviewDate), 'Parent/Guardian': student.parentName || '',
      'Parent Email': student.parentEmail || '', 'Parent Phone': student.parentPhone || '', 'Goal #': i + 1,
      'Goal Domain': goal.domain, 'Annual Goal': goal.goalStatement, 'Success Criteria': goal.successCriteria,
      'Timeframe': goal.timeframe, 'Benchmark 1': goal.benchmarks[0] || '', 'Benchmark 2': goal.benchmarks[1] || '',
      'Benchmark 3': goal.benchmarks[2] || '', 'Current Progress': latestNote?.currentPerformance || '',
      'Progress Status': latestNote ? latestNote.status.replace('_', ' ') : '',
      'Last Progress Date': latestNote ? formatDate(latestNote.date) : '', 'IEP Generated Date': formatDate(iep.generatedAt),
    }),
  },

  // Frontline Special Ed (Exceed) commonly used field format
  frontline: {
    buildGoalRow: (student, _iep, goal, i, latestNote) => ({
      'LASID': '', 'SASID': '', 'LastName': lastName(student.name), 'FirstName': firstName(student.name),
      'DOB': formatDate(student.dateOfBirth), 'Grade': student.grade, 'DisabilityCode': student.disabilityCategory,
      'MeetingDate': formatDate(student.meetingDate), 'AnnualReviewDate': formatDate(student.reviewDate),
      'ParentName': student.parentName || '', 'ParentEmail': student.parentEmail || '', 'GoalNumber': i + 1,
      'GoalArea': goal.domain, 'GoalDescription': goal.goalStatement, 'Benchmark1': goal.benchmarks[0] || '',
      'Benchmark2': goal.benchmarks[1] || '', 'Benchmark3': goal.benchmarks[2] || '', 'MeasurementMethod': goal.successCriteria,
      'ProgressCode': latestNote ? latestNote.status : '', 'ProgressNarrative': latestNote?.currentPerformance || '',
      'ProgressDate': latestNote ? formatDate(latestNote.date) : '',
    }),
    buildServiceRow: (student, _iep, s) => ({
      'LASID': '', 'SASID': '', 'LastName': lastName(student.name), 'FirstName': firstName(student.name),
      'DOB': formatDate(student.dateOfBirth), 'Grade': student.grade, 'DisabilityCode': student.disabilityCategory,
      'MeetingDate': formatDate(student.meetingDate), 'AnnualReviewDate': formatDate(student.reviewDate),
      'ParentName': student.parentName || '', 'ParentEmail': student.parentEmail || '', 'GoalNumber': 'SERVICE',
      'GoalArea': s.serviceType, 'GoalDescription': `${s.frequency} | ${s.duration} | ${s.setting} | ${s.provider}`,
      'Benchmark1': '', 'Benchmark2': '', 'Benchmark3': '',
      'MeasurementMethod': '', 'ProgressCode': '', 'ProgressNarrative': '', 'ProgressDate': '',
    }),
  },

  iep_direct: {
    buildGoalRow: (student, _iep, goal, i, latestNote) => ({
      'student_last_name': lastName(student.name), 'student_first_name': firstName(student.name),
      'student_dob': formatDate(student.dateOfBirth), 'student_grade': student.grade,
      'disability_category': student.disabilityCategory, 'iep_start_date': formatDate(student.meetingDate),
      'iep_end_date': formatDate(student.reviewDate), 'guardian_name': student.parentName || '',
      'guardian_email': student.parentEmail || '', 'goal_seq': i + 1, 'goal_domain': goal.domain,
      'annual_goal': goal.goalStatement, 'short_term_obj_1': goal.benchmarks[0] || '',
      'short_term_obj_2': goal.benchmarks[1] || '', 'short_term_obj_3': goal.benchmarks[2] || '',
      'evaluation_criteria': goal.successCriteria, 'progress_level': latestNote?.status || '',
      'progress_description': latestNote?.currentPerformance || '', 'progress_date': latestNote ? formatDate(latestNote.date) : '',
    }),
  },

  skyward: {
    buildGoalRow: (student, iep, goal, i, latestNote) => ({
      'StudentID': '', 'StudentLastName': lastName(student.name), 'StudentFirstName': firstName(student.name),
      'BirthDate': formatDate(student.dateOfBirth), 'GradeLevel': student.grade, 'PrimaryDisability': student.disabilityCategory,
      'IEPBeginDate': formatDate(student.meetingDate), 'IEPEndDate': formatDate(student.reviewDate),
      'ParentGuardianName': student.parentName || '', 'ContactEmail': student.parentEmail || '', 'GoalSequence': i + 1,
      'GoalArea': goal.domain, 'GoalText': goal.goalStatement, 'Objective1': goal.benchmarks[0] || '',
      'Objective2': goal.benchmarks[1] || '', 'Objective3': goal.benchmarks[2] || '', 'MasteryLevel': goal.successCriteria,
      'ProgressIndicator': latestNote?.status || '', 'ProgressComment': latestNote?.currentPerformance || '',
      'ProgressReportDate': latestNote ? formatDate(latestNote.date) : '', 'LREStatement': iep.lreStatement || '',
    }),
    buildServiceRow: (student, _iep, s) => ({
      'StudentID': '', 'StudentLastName': lastName(student.name), 'StudentFirstName': firstName(student.name),
      'BirthDate': formatDate(student.dateOfBirth), 'GradeLevel': student.grade, 'PrimaryDisability': student.disabilityCategory,
      'IEPBeginDate': formatDate(student.meetingDate), 'IEPEndDate': formatDate(student.reviewDate),
      'ParentGuardianName': student.parentName || '', 'ContactEmail': student.parentEmail || '',
      'GoalSequence': 'SVC', 'GoalArea': s.serviceType,
      'GoalText': `${s.frequency} for ${s.duration} in ${s.setting} with ${s.provider}`,
      'Objective1': '', 'Objective2': '', 'Objective3': '', 'MasteryLevel': '',
      'ProgressIndicator': '', 'ProgressComment': '', 'ProgressReportDate': '', 'LREStatement': '',
    }),
  },

  powerschool: {
    buildGoalRow: (student, _iep, goal, i, latestNote) => ({
      'Local_ID': '', 'State_ID': '', 'Last_Name': lastName(student.name), 'First_Name': firstName(student.name),
      'Date_of_Birth': formatDate(student.dateOfBirth), 'Grade': student.grade, 'Primary_Exceptionality': student.disabilityCategory,
      'Plan_Start_Date': formatDate(student.meetingDate), 'Plan_End_Date': formatDate(student.reviewDate),
      'Parent_Name': student.parentName || '', 'Parent_Email': student.parentEmail || '', 'Goal_Number': i + 1,
      'Goal_Subject_Area': goal.domain, 'Goal_Description': goal.goalStatement, 'Benchmark_1': goal.benchmarks[0] || '',
      'Benchmark_2': goal.benchmarks[1] || '', 'Benchmark_3': goal.benchmarks[2] || '', 'Evaluation_Procedure': goal.successCriteria,
      'Progress_Code': latestNote?.status || '', 'Progress_Notes': latestNote?.currentPerformance || '',
      'Progress_Date': latestNote ? formatDate(latestNote.date) : '',
    }),
  },

  spedi: {
    buildGoalRow: (student, iep, goal, i, latestNote) => ({
      'student_name': student.name, 'dob': formatDate(student.dateOfBirth), 'grade': student.grade,
      'disability': student.disabilityCategory, 'iep_date': formatDate(student.meetingDate),
      'review_date': formatDate(student.reviewDate), 'parent': student.parentName || '', 'parent_email': student.parentEmail || '',
      'goal_number': i + 1, 'area': goal.domain, 'goal': goal.goalStatement, 'benchmark_1': goal.benchmarks[0] || '',
      'benchmark_2': goal.benchmarks[1] || '', 'benchmark_3': goal.benchmarks[2] || '', 'criteria': goal.successCriteria,
      'timeframe': goal.timeframe, 'progress': latestNote?.status || '', 'performance_data': latestNote?.currentPerformance || '',
      'progress_date': latestNote ? formatDate(latestNote.date) : '', 'accommodations': iep.accommodations.join('; '),
    }),
  },

  edio: {
    buildGoalRow: (student, iep, goal, i, latestNote) => ({
      'ExternalStudentID': '', 'StudentFirstName': firstName(student.name), 'StudentLastName': lastName(student.name),
      'StudentDOB': formatDate(student.dateOfBirth), 'StudentGrade': student.grade, 'DisabilityCategory': student.disabilityCategory,
      'IEPStartDate': formatDate(student.meetingDate), 'IEPEndDate': formatDate(student.reviewDate),
      'GuardianName': student.parentName || '', 'GuardianEmail': student.parentEmail || '', 'GoalID': i + 1,
      'GoalCategory': goal.domain, 'GoalText': goal.goalStatement, 'ShortTermGoal1': goal.benchmarks[0] || '',
      'ShortTermGoal2': goal.benchmarks[1] || '', 'ShortTermGoal3': goal.benchmarks[2] || '', 'SuccessCriteria': goal.successCriteria,
      'ProgressStatus': latestNote?.status || '', 'ProgressData': latestNote?.currentPerformance || '',
      'ProgressDate': latestNote ? formatDate(latestNote.date) : '',
      'ServiceType': iep.services.map(s => s.serviceType).join('; '), 'ServiceFrequency': iep.services.map(s => s.frequency).join('; '),
      'LRE': iep.lreStatement || '',
    }),
  },
};

function buildCSV(system: string, student: Student, notes: ProgressNote[]): string {
  const iep = student.generatedIEP;
  if (!iep) return 'No IEP generated for this student.';
  const config = CSV_SYSTEMS[system] ?? CSV_SYSTEMS.universal;
  const rows: Row[] = [];
  iep.goals.forEach((goal, i) => {
    rows.push(config.buildGoalRow(student, iep, goal, i, latestNoteFor(notes, goal.domain)));
  });
  if (config.buildServiceRow) {
    iep.services.forEach(s => rows.push(config.buildServiceRow!(student, iep, s)));
  }
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

    // Verify student belongs to requesting user
    const { data: studentRecord, error: studentError } = await supabase
      .from('students')
      .select('id, user_id')
      .eq('id', student.id)
      .single();
    if (studentError || !studentRecord || studentRecord.user_id !== user.id) {
      return NextResponse.json({ error: 'Student not found or access denied.' }, { status: 403 });
    }

    // Audit log the export
    try { await supabase.from('usage_events').insert({ user_id: user.id, event_type: 'data_exported', metadata: { student_id: student.id, student_name: student.name, system } }); } catch {}

    const csv = buildCSV(system, student, notes);

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
