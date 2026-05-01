'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Student, GeneratedIEP } from '@/lib/types';
import { getStudent, saveStudent, calculateAge } from '@/lib/storage';
import IEPViewer from '@/components/IEPViewer';

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState('');
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getStudent(id).then(s => {
      if (!s) router.push('/');
      else { setStudent(s); setLoaded(true); }
    });
  }, [id, router]);

  if (!loaded) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <div className="text-center"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm">Loading...</p></div>
    </div>
  );
  if (!student) return null;

  const age = calculateAge(student.dateOfBirth);
  const allVersions = [...(student.iepHistory || []), ...(student.generatedIEP ? [student.generatedIEP] : [])];
  const displayedIEP = allVersions.length > 0 ? allVersions[allVersions.length - 1 - activeHistoryIndex] : null;

  const handleExport = async () => {
    if (!displayedIEP) return;
    setIsExporting(true);
    try {
      const res = await fetch('/api/export-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student, iep: displayedIEP }) });
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IEP_${student.name.replace(/\s+/g, '_')}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Export failed. Please try again.'); }
    finally { setIsExporting(false); }
  };

  const generateIEP = async (replace: boolean) => {
    if (replace && student.generatedIEP) {
      if (!confirm('Regenerate IEP? The current plan will be saved to history.')) return;
    }
    setIsRegenerating(true); setRegenError('');
    try {
      const res = await fetch('/api/generate-iep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Generation failed'); }
      const iep = await res.json();
      const history = [...(student.iepHistory || [])];
      if (student.generatedIEP) history.push(student.generatedIEP);
      const updated = { ...student, generatedIEP: iep, iepHistory: history, updatedAt: new Date().toISOString() };
      await saveStudent(updated);
      setStudent(updated); setActiveHistoryIndex(0);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Failed to generate. Please try again.');
    } finally { setIsRegenerating(false); }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
              {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{student.grade}</span>
                <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">Age {age}</span>
                <span className="text-sm bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{student.disabilityCategory}</span>
              </div>
              {student.meetingDate && <p className="text-xs text-gray-400 mt-1.5">Meeting: {new Date(student.meetingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}{student.reviewDate && ` · Review: ${new Date(student.reviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</p>}
              {student.parentName && <p className="text-xs text-gray-400 mt-0.5">Parent/Guardian: {student.parentName}{student.parentPhone ? ` · ${student.parentPhone}` : ''}</p>}
            </div>
          </div>
          <div className="flex gap-2 no-print flex-wrap justify-end">
            <button onClick={() => window.print()} className="text-sm text-gray-600 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg transition-colors">🖨️ Print</button>
            {displayedIEP && (<><button onClick={handleExport} disabled={isExporting} className="text-sm text-green-700 hover:bg-green-50 border border-green-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">{isExporting ? '⏳...' : '⬇️ Export'}</button><a href={`/students/${id}/pdf`} target="_blank" className="text-sm text-purple-700 hover:bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg transition-colors">📄 PDF</a></>)}
            <Link href={`/students/${id}/edit`} className="text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg transition-colors">✏️ Edit Info</Link>
            {student.generatedIEP && <button onClick={() => generateIEP(true)} disabled={isRegenerating} className="text-sm text-orange-600 hover:bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">{isRegenerating ? '⏳...' : '🔄 Regenerate'}</button>}
            <Link href="/dashboard" className="text-sm text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">← Students</Link>
          </div>
        </div>
      </div>

      {regenError && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700"><strong>Error:</strong> {regenError}</div>}

      {allVersions.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 no-print">
          <p className="text-sm font-semibold text-gray-700 mb-2">📚 IEP Version History ({allVersions.length} versions)</p>
          <div className="flex gap-2 flex-wrap">
            {allVersions.map((v: GeneratedIEP, i: number) => {
              const isActive = activeHistoryIndex === (allVersions.length - 1 - i);
              return <button key={i} onClick={() => setActiveHistoryIndex(allVersions.length - 1 - i)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{i === 0 ? '⭐ Current' : `v${allVersions.length - i}`} · {new Date(v.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</button>;
            })}
          </div>
          {activeHistoryIndex > 0 && <p className="text-xs text-amber-600 mt-2">⚠️ Viewing an older version. Read-only.</p>}
        </div>
      )}

      {!student.generatedIEP && !isRegenerating && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-800">Ready to generate an IEP</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Claude will create a comprehensive, IDEA-compliant IEP plan for {student.name}.</p>
          <button onClick={() => generateIEP(false)} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg">✨ Generate IEP Plan</button>
        </div>
      )}

      {isRegenerating && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <h3 className="text-lg font-semibold text-gray-800">Generating IEP plan...</h3>
          <p className="text-gray-500 mt-2 text-sm">This typically takes 30–90 seconds.</p>
        </div>
      )}

      {displayedIEP && !isRegenerating && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs text-amber-800 no-print flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span><strong>Professional Review Required:</strong> This AI-generated IEP draft must be reviewed and approved by qualified special education staff before implementation.</span>
          </div>
          <IEPViewer iep={displayedIEP} studentName={student.name} />
          <div className="mt-6 bg-gray-50 border rounded-lg p-4 text-xs text-gray-500 no-print">
            Generated {new Date(displayedIEP.generatedAt).toLocaleString()} · {displayedIEP.goals.length} goals · {displayedIEP.services.length} services
          </div>
        </>
      )}
    </div>
  );
}
