// Storage layer — now backed by Supabase
// Client-side functions use the browser Supabase client
import { Student } from './types';
import { createClient } from './supabase';

// Helper: convert Supabase row to Student
function rowToStudent(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    name: row.name as string,
    dateOfBirth: row.date_of_birth as string,
    grade: row.grade as string,
    disabilityCategory: row.disability_category as string,
    meetingDate: (row.meeting_date as string) || '',
    reviewDate: (row.review_date as string) || '',
    parentName: (row.parent_name as string) || '',
    parentEmail: (row.parent_email as string) || '',
    parentPhone: (row.parent_phone as string) || '',
    presentLevels: (row.present_levels as Student['presentLevels']) || { cognitive: '', communication: '', socialEmotional: '', adaptive: '', physical: '' },
    strengths: (row.strengths as string) || '',
    concerns: (row.concerns as string) || '',
    familyPriorities: (row.family_priorities as string) || '',
    currentServices: (row.current_services as string) || '',
    environmentalFactors: (row.environmental_factors as string) || '',
    generatedIEP: row.generated_iep as Student['generatedIEP'] || undefined,
    iepHistory: (row.iep_history as Student['iepHistory']) || [],
    archived: (row.archived as boolean) || false,
    archivedAt: (row.archived_at as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Helper: convert Student to Supabase row
function studentToRow(student: Student, userId: string) {
  return {
    id: student.id,
    user_id: userId,
    name: student.name,
    date_of_birth: student.dateOfBirth,
    grade: student.grade,
    disability_category: student.disabilityCategory,
    meeting_date: student.meetingDate || null,
    review_date: student.reviewDate || null,
    parent_name: student.parentName || null,
    parent_email: student.parentEmail || null,
    parent_phone: student.parentPhone || null,
    present_levels: student.presentLevels,
    strengths: student.strengths || null,
    concerns: student.concerns || null,
    family_priorities: student.familyPriorities || null,
    current_services: student.currentServices || null,
    environmental_factors: student.environmentalFactors || null,
    generated_iep: student.generatedIEP || null,
    iep_history: student.iepHistory || [],
    archived: student.archived || false,
    archived_at: student.archivedAt || null,
    updated_at: new Date().toISOString(),
  };
}

export async function getStudents(): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or('archived.is.null,archived.eq.false')
    .order('created_at', { ascending: false });
  if (error) { console.error('getStudents error:', error); return []; }
  return (data || []).map(rowToStudent);
}

export async function getStudent(id: string): Promise<Student | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('getStudent error:', error); return null; }
  return data ? rowToStudent(data) : null;
}

export async function saveStudent(student: Student): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = studentToRow(student, user.id);
  const { error } = await supabase
    .from('students')
    .upsert(row, { onConflict: 'id' });
  if (error) { console.error('saveStudent error:', error); throw error; }
}

export async function deleteStudent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  if (error) { console.error('deleteStudent error:', error); throw error; }
}


export async function archiveStudent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('students')
    .update({ archived: true, archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('archiveStudent error:', error); throw error; }
}

export async function unarchiveStudent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('students')
    .update({ archived: false, archived_at: null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('unarchiveStudent error:', error); throw error; }
}

export async function getArchivedStudents(): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('archived', true)
    .order('archived_at', { ascending: false });
  if (error) { console.error('getArchivedStudents error:', error); return []; }
  return (data || []).map(rowToStudent);
}

export function generateId(): string {
  // Use UUID format for Supabase compatibility
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}
