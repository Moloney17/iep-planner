'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Student, DISABILITY_CATEGORIES, GRADE_LEVELS } from '@/lib/types';
import { getStudent, saveStudent } from '@/lib/storage';

type FormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'generatedIEP' | 'iepHistory'>;

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}{required && <span className="text-red-500 ml-1">*</span>}</label>;
}
function Input({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return <div><Label required={required}>{label}</Label><input {...props} required={required} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>;
}
function Textarea({ label, required, hint, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean; hint?: string }) {
  return <div><Label required={required}>{label}</Label>{hint && <p className="text-xs text-gray-500 mb-1.5">{hint}</p>}<textarea {...props} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" /></div>;
}
function Select({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; required?: boolean }) {
  return <div><Label required={required}>{label}</Label><select {...props} required={required} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">{children}</select></div>;
}

const SECTIONS = [
  { id: 'info', label: 'Student Info', icon: '👤' },
  { id: 'levels', label: 'Present Levels', icon: '📊' },
  { id: 'context', label: 'Context', icon: '🌍' },
];

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [activeSection, setActiveSection] = useState('info');
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudent(id).then(s => {
      if (!s) { router.push('/'); return; }
      setStudent(s);
      setForm({
        name: s.name, dateOfBirth: s.dateOfBirth, grade: s.grade,
        disabilityCategory: s.disabilityCategory, meetingDate: s.meetingDate, reviewDate: s.reviewDate,
        parentName: s.parentName || '', parentEmail: s.parentEmail || '', parentPhone: s.parentPhone || '',
        presentLevels: { ...s.presentLevels },
        strengths: s.strengths, concerns: s.concerns, familyPriorities: s.familyPriorities,
        currentServices: s.currentServices, environmentalFactors: s.environmentalFactors,
      });
      setLoading(false);
    });
  }, [id, router]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  if (loading || !form || !student) return <div className="flex items-center justify-center py-20 text-gray-400"><div className="text-center"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm">Loading...</p></div></div>;

  const set = (field: keyof FormData, value: string) => { setForm(prev => prev ? { ...prev, [field]: value } : prev); setIsDirty(true); setSaved(false); };
  const setLevel = (field: keyof FormData['presentLevels'], value: string) => { setForm(prev => prev ? { ...prev, presentLevels: { ...prev.presentLevels, [field]: value } } : prev); setIsDirty(true); setSaved(false); };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Student name is required.');
    if (!form.dateOfBirth) errs.push('Date of birth is required.');
    if (!form.grade) errs.push('Grade level is required.');
    if (!form.disabilityCategory) errs.push('Disability category is required.');
    if (!Object.values(form.presentLevels).some(v => v.trim())) errs.push('Please describe present levels in at least one domain.');
    if (!form.strengths.trim()) errs.push('Student strengths are required.');
    if (!form.concerns.trim()) errs.push('Areas of concern are required.');
    setErrors(errs); return errs.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await saveStudent({ ...student, ...form, updatedAt: new Date().toISOString() });
    setIsDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveAndReturn = async () => {
    if (!validate()) return;
    await saveStudent({ ...student, ...form, updatedAt: new Date().toISOString() });
    router.push(`/students/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-900">Edit Student</h2><p className="text-gray-500 mt-1">Editing: <strong>{student.name}</strong></p></div>
        <button onClick={() => { if (isDirty && !confirm('You have unsaved changes. Leave anyway?')) return; router.push(`/students/${id}`); }} className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors">← Back</button>
      </div>

      {isDirty && <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-amber-700 flex items-center justify-between"><span>⚠️ You have unsaved changes</span><button onClick={handleSave} className="font-semibold underline hover:no-underline">Save now</button></div>}
      {saved && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-green-700">✅ Changes saved successfully</div>}
      {errors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">{errors.map((e, i) => <p key={i} className="text-sm text-red-700">• {e}</p>)}</div>}

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {SECTIONS.map(s => <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeSection === s.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{s.icon} {s.label}</button>)}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeSection === 'info' && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Student Information</h3>
            <Input label="Student's Full Name" required placeholder="First Last" value={form.name} onChange={e => set('name', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date of Birth" type="date" required value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              <Select label="Grade / Education Level" required value={form.grade} onChange={e => set('grade', e.target.value)}><option value="">Select grade...</option>{GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}</Select>
            </div>
            <Select label="IDEA Disability Category" required value={form.disabilityCategory} onChange={e => set('disabilityCategory', e.target.value)}><option value="">Select...</option>{DISABILITY_CATEGORIES.map(d => <option key={d} value={d}>{d}</option>)}</Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="IEP Meeting Date" type="date" value={form.meetingDate} onChange={e => set('meetingDate', e.target.value)} />
              <Input label="Annual Review Date" type="date" value={form.reviewDate} onChange={e => set('reviewDate', e.target.value)} />
            </div>
            <div className="border-t pt-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Parent / Guardian <span className="text-gray-400 font-normal">(optional)</span></h4>
              <div className="space-y-4">
                <Input label="Parent / Guardian Name" placeholder="Full name" value={form.parentName} onChange={e => set('parentName', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" type="email" placeholder="email@example.com" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} />
                  <Input label="Phone" type="tel" placeholder="(555) 000-0000" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'levels' && (
          <div className="space-y-5">
            <div className="border-b pb-3"><h3 className="text-lg font-semibold text-gray-800">Present Levels of Performance</h3></div>
            <Textarea label="🧠 Cognitive / Academic Skills" hint="e.g., identifies 8/10 uppercase letters; counts to 10 with 90% accuracy" placeholder="Describe current performance..." value={form.presentLevels.cognitive} onChange={e => setLevel('cognitive', e.target.value)} />
            <Textarea label="💬 Communication / Language" hint="e.g., uses 2–3 word phrases" placeholder="Describe language skills..." value={form.presentLevels.communication} onChange={e => setLevel('communication', e.target.value)} />
            <Textarea label="❤️ Social-Emotional Development" hint="e.g., initiates peer play 2–3 times/30 min" placeholder="Describe social skills..." value={form.presentLevels.socialEmotional} onChange={e => setLevel('socialEmotional', e.target.value)} />
            <Textarea label="⭐ Adaptive / Self-Help Skills" hint="e.g., independent in toileting" placeholder="Describe self-care skills..." value={form.presentLevels.adaptive} onChange={e => setLevel('adaptive', e.target.value)} />
            <Textarea label="🏃 Physical / Motor Development" hint="e.g., age-appropriate gross motor" placeholder="Describe motor skills..." value={form.presentLevels.physical} onChange={e => setLevel('physical', e.target.value)} />
          </div>
        )}
        {activeSection === 'context' && (
          <div className="space-y-5">
            <div className="border-b pb-3"><h3 className="text-lg font-semibold text-gray-800">Context & Priorities</h3></div>
            <Textarea label="Student's Key Strengths" required placeholder="e.g., enthusiastic about learning..." value={form.strengths} onChange={e => set('strengths', e.target.value)} />
            <Textarea label="Primary Areas of Concern" required placeholder="e.g., expressive language delays..." value={form.concerns} onChange={e => set('concerns', e.target.value)} />
            <Textarea label="Family Priorities & Goals" placeholder="e.g., family wants child to communicate basic needs..." value={form.familyPriorities} onChange={e => set('familyPriorities', e.target.value)} />
            <Textarea label="Current Services & Interventions" placeholder="e.g., private speech therapy 1x/week..." value={form.currentServices} onChange={e => set('currentServices', e.target.value)} />
            <Textarea label="Environmental & Contextual Factors" placeholder="e.g., bilingual home..." value={form.environmentalFactors} onChange={e => set('environmentalFactors', e.target.value)} />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => { if (isDirty && !confirm('Discard unsaved changes?')) return; router.push(`/students/${id}`); }} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
        <div className="flex gap-3">
          <button onClick={handleSave} className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-lg transition-colors">Save Changes</button>
          <button onClick={handleSaveAndReturn} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Save & Return →</button>
        </div>
      </div>
    </div>
  );
}
