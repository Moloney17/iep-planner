'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Student, DISABILITY_CATEGORIES, GRADE_LEVELS } from '@/lib/types';
import { saveStudent, generateId } from '@/lib/storage';

const STEPS = [
  { num: 1, label: 'Student Info' },
  { num: 2, label: 'Present Levels' },
  { num: 3, label: 'Context' },
  { num: 4, label: 'Review' },
];

type FormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'generatedIEP' | 'iepHistory'>;

const empty: FormData = {
  name: '', dateOfBirth: '', grade: '', disabilityCategory: '',
  meetingDate: '', reviewDate: '',
  parentName: '', parentEmail: '', parentPhone: '',
  presentLevels: { cognitive: '', communication: '', socialEmotional: '', adaptive: '', physical: '' },
  strengths: '', concerns: '', familyPriorities: '', currentServices: '', environmentalFactors: '',
};

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

export default function NewStudentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty && !isGenerating) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, isGenerating]);

  const set = (field: keyof FormData, value: string) => { setForm(prev => ({ ...prev, [field]: value })); setIsDirty(true); };
  const setLevel = (field: keyof FormData['presentLevels'], value: string) => { setForm(prev => ({ ...prev, presentLevels: { ...prev.presentLevels, [field]: value } })); setIsDirty(true); };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (step === 1) {
      if (!form.name.trim()) errs.push('Student name is required.');
      if (!form.dateOfBirth) errs.push('Date of birth is required.');
      if (!form.grade) errs.push('Grade level is required.');
      if (!form.disabilityCategory) errs.push('Disability category is required.');
    }
    if (step === 2) { if (!Object.values(form.presentLevels).some(v => v.trim())) errs.push('Please describe present levels in at least one domain.'); }
    if (step === 3) {
      if (!form.strengths.trim()) errs.push("Please describe the student's strengths.");
      if (!form.concerns.trim()) errs.push('Please describe the primary areas of concern.');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const next = () => { if (validate()) { setStep(s => s + 1); setErrors([]); } };
  const back = () => { setStep(s => s - 1); setErrors([]); };
  const handleCancel = () => { if (isDirty && !confirm('You have unsaved data. Leave without saving?')) return; router.push('/'); };

  const handleGenerate = async () => {
    setIsGenerating(true); setGenerationError(''); setIsDirty(false);
    const student: Student = { ...form, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await saveStudent(student);
    try {
      const res = await fetch('/api/generate-iep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Generation failed'); }
      const iep = await res.json();
      await saveStudent({ ...student, generatedIEP: iep, updatedAt: new Date().toISOString() });
      router.push(`/students/${student.id}`);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate IEP. Please try again.');
      setIsGenerating(false); setIsDirty(true);
    }
  };

  const presentLevelCount = Object.values(form.presentLevels).filter(v => v.trim()).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
        <p className="text-gray-500 mt-1">Enter student information to generate a customized IEP</p>
      </div>

      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs mt-1 font-medium ${step === s.num ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          {errors.map((e, i) => <p key={i} className="text-sm text-red-700">• {e}</p>)}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Student Information</h3>
            <Input label="Student's Full Name" required placeholder="First Last" value={form.name} onChange={e => set('name', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date of Birth" type="date" required value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              <Select label="Grade / Education Level" required value={form.grade} onChange={e => set('grade', e.target.value)}>
                <option value="">Select grade...</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <Select label="IDEA Disability Category" required value={form.disabilityCategory} onChange={e => set('disabilityCategory', e.target.value)}>
              <option value="">Select disability category...</option>
              {DISABILITY_CATEGORIES.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="IEP Meeting Date" type="date" value={form.meetingDate} onChange={e => set('meetingDate', e.target.value)} />
              <Input label="Annual Review Date" type="date" value={form.reviewDate} onChange={e => set('reviewDate', e.target.value)} />
            </div>
            <div className="border-t pt-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Parent / Guardian Information <span className="text-gray-400 font-normal">(optional)</span></h4>
              <div className="space-y-4">
                <Input label="Parent / Guardian Name" placeholder="Full name" value={form.parentName} onChange={e => set('parentName', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email Address" type="email" placeholder="email@example.com" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} />
                  <Input label="Phone Number" type="tel" placeholder="(555) 000-0000" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-800">Present Levels of Performance</h3>
              <p className="text-sm text-gray-500 mt-1">Describe current abilities using specific data. Complete at least one domain.</p>
            </div>
            <Textarea label="🧠 Cognitive / Academic Skills" hint="e.g., identifies 8/10 uppercase letters; counts to 10 with 90% accuracy" placeholder="Describe current cognitive and pre-academic/academic performance..." value={form.presentLevels.cognitive} onChange={e => setLevel('cognitive', e.target.value)} />
            <Textarea label="💬 Communication / Language" hint="e.g., uses 2–3 word phrases; intelligible to familiar adults 70% of the time" placeholder="Describe receptive and expressive language skills..." value={form.presentLevels.communication} onChange={e => setLevel('communication', e.target.value)} />
            <Textarea label="❤️ Social-Emotional Development" hint="e.g., initiates peer play 2–3 times/30 min; difficulty during transitions" placeholder="Describe social skills, peer interactions, emotional regulation..." value={form.presentLevels.socialEmotional} onChange={e => setLevel('socialEmotional', e.target.value)} />
            <Textarea label="⭐ Adaptive / Self-Help Skills" hint="e.g., independent in toileting; requires assistance to zip jacket" placeholder="Describe self-care, daily living, independence skills..." value={form.presentLevels.adaptive} onChange={e => setLevel('adaptive', e.target.value)} />
            <Textarea label="🏃 Physical / Motor Development" hint="e.g., age-appropriate gross motor; fine motor 4 months below age level" placeholder="Describe fine motor and gross motor skills..." value={form.presentLevels.physical} onChange={e => setLevel('physical', e.target.value)} />
            {presentLevelCount > 0 && <p className="text-xs text-green-600 font-medium">✅ {presentLevelCount} domain{presentLevelCount !== 1 ? 's' : ''} described.</p>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-800">Context & Priorities</h3>
              <p className="text-sm text-gray-500 mt-1">This information helps personalize the IEP.</p>
            </div>
            <Textarea label="Student's Key Strengths" required hint="What does this student do well?" placeholder="e.g., enthusiastic about learning, strong visual memory..." value={form.strengths} onChange={e => set('strengths', e.target.value)} />
            <Textarea label="Primary Areas of Concern" required hint="What challenges brought this student to IEP services?" placeholder="e.g., expressive language delays impacting social interactions..." value={form.concerns} onChange={e => set('concerns', e.target.value)} />
            <Textarea label="Family Priorities & Goals" hint="What do parents/guardians most want for their child this year?" placeholder="e.g., family wants child to communicate basic needs independently..." value={form.familyPriorities} onChange={e => set('familyPriorities', e.target.value)} />
            <Textarea label="Current Services & Interventions" hint="What support is already in place?" placeholder="e.g., private speech therapy 1x/week..." value={form.currentServices} onChange={e => set('currentServices', e.target.value)} />
            <Textarea label="Environmental & Contextual Factors" hint="Any relevant home, school, or community factors?" placeholder="e.g., bilingual home, recently moved..." value={form.environmentalFactors} onChange={e => set('environmentalFactors', e.target.value)} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Review & Generate IEP</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Student</p>
                <p className="text-gray-900 font-medium">{form.name}</p>
                <p className="text-gray-500">{form.grade}</p>
                <p className="text-gray-500">{form.disabilityCategory}</p>
                {form.parentName && <p className="text-gray-500 mt-1">Parent: {form.parentName}</p>}
                {form.meetingDate && <p className="text-gray-500 mt-1">Meeting: {new Date(form.meetingDate).toLocaleDateString()}</p>}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Domains Assessed</p>
                {[['🧠','Cognitive/Academic',form.presentLevels.cognitive],['💬','Communication',form.presentLevels.communication],['❤️','Social-Emotional',form.presentLevels.socialEmotional],['⭐','Adaptive',form.presentLevels.adaptive],['🏃','Physical/Motor',form.presentLevels.physical]].map(([icon,label,val]) => (
                  <p key={String(label)} className={val ? 'text-green-700' : 'text-gray-400'}>{icon} {label} {val ? '✓' : '—'}</p>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">What Claude will generate:</p>
              <ul className="space-y-0.5">
                <li>✅ PLAAFP narrative</li><li>✅ Measurable annual goals with benchmarks</li>
                <li>✅ Special education & related services</li><li>✅ Classroom & assessment accommodations</li>
                <li>✅ Progress monitoring plan</li><li>✅ LRE justification</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              <strong>⚠️ Important:</strong> Review all generated content with your special education team before use.
            </div>
            {generationError && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700"><strong>Generation failed:</strong> {generationError}</div>}
            {isGenerating && (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-700 font-medium">Generating IEP plan...</p>
                <p className="text-gray-400 text-sm mt-1">This may take 30–90 seconds.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={step === 1 ? handleCancel : back} disabled={isGenerating} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          ← {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 4
          ? <button onClick={next} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">Continue →</button>
          : <button onClick={handleGenerate} disabled={isGenerating} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">{isGenerating ? 'Generating...' : '✨ Generate IEP'}</button>
        }
      </div>
    </div>
  );
}
