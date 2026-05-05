'use client';

import { useState, useEffect } from 'react';
import { Student, ProgressNote, ProgressStatus, ProgressReport, PROGRESS_STATUS_LABELS, PROGRESS_STATUS_COLORS, SPED_SYSTEMS, IEPGoal } from '@/lib/types';
import { getProgressNotes, saveProgressNote, deleteProgressNote } from '@/lib/storage';

const QUARTERS = ['Q1 (Sep–Nov)', 'Q2 (Dec–Feb)', 'Q3 (Mar–May)', 'Q4 (Jun–Aug)', 'Semester 1', 'Semester 2', 'Annual'];

export default function ProgressTab({ student }: { student: Student }) {
  const [notes, setNotes] = useState<ProgressNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<IEPGoal | null>(null);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], currentPerformance: '', status: 'on_track' as ProgressStatus, notes: '' });
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportPeriod, setReportPeriod] = useState('Q1 (Sep–Nov)');
  const [showExport, setShowExport] = useState(false);
  const [exportSystem, setExportSystem] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [filterDomain, setFilterDomain] = useState('');

  const iep = student.generatedIEP;

  useEffect(() => {
    getProgressNotes(student.id).then(n => { setNotes(n); setLoaded(true); });
  }, [student.id]);

  const handleSaveNote = async () => {
    if (!selectedGoal || !formData.currentPerformance.trim()) return;
    setSaving(true);
    try {
      await saveProgressNote({
        studentId: student.id,
        goalDomain: selectedGoal.domain,
        goalStatement: selectedGoal.goalStatement,
        date: formData.date,
        currentPerformance: formData.currentPerformance,
        status: formData.status,
        notes: formData.notes || undefined,
      });
      const updated = await getProgressNotes(student.id);
      setNotes(updated);
      setShowForm(false);
      setSelectedGoal(null);
      setFormData({ date: new Date().toISOString().split('T')[0], currentPerformance: '', status: 'on_track', notes: '' });
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this progress note?')) return;
    await deleteProgressNote(id);
    setNotes(await getProgressNotes(student.id));
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true); setReportError(''); setReport(null);
    try {
      const res = await fetch('/api/generate-progress-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, notes, reportingPeriod: reportPeriod }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setReport(await res.json());
    } catch (e) { setReportError(e instanceof Error ? e.message : 'Failed to generate report'); }
    finally { setGeneratingReport(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, notes, system: exportSystem }),
      });
      const csv = await res.text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${student.name.replace(/\s+/g, '_')}_IEP_${exportSystem}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed. Please try again.'); console.error(e); }
    finally { setExporting(false); }
  };

  const domains = iep?.goals.map(g => g.domain) || [];
  const filteredNotes = filterDomain ? notes.filter(n => n.goalDomain === filterDomain) : notes;
  const notesByDomain: Record<string, ProgressNote[]> = {};
  filteredNotes.forEach(n => { if (!notesByDomain[n.goalDomain]) notesByDomain[n.goalDomain] = []; notesByDomain[n.goalDomain].push(n); });

  if (!iep) return (
    <div className="text-center py-12 text-gray-400">
      <p>Generate an IEP first to start tracking progress.</p>
    </div>
  );

  return (
    <div>
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            + Log Progress Note
          </button>
          <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowExport(!showExport)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors">
            ⬇️ Export Data
          </button>
          <div className="flex items-center gap-2">
            <select value={reportPeriod} onChange={e => setReportPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <button onClick={handleGenerateReport} disabled={generatingReport || notes.length === 0}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
              {generatingReport ? '⏳ Generating...' : '📊 Generate Progress Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Export panel */}
      {showExport && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Export IEP Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export your student's IEP and progress data in a format compatible with your district's system.</p>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={exportSystem} onChange={e => setExportSystem(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]">
              {SPED_SYSTEMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <button onClick={handleExport} disabled={exporting}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
              {exporting ? '⏳ Exporting...' : '⬇️ Download CSV'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            💡 Field names are mapped to match each system's import format. If your system isn't listed, use Universal CSV and map fields manually.
          </p>
        </div>
      )}

      {reportError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">{reportError}</div>
      )}

      {/* Log note form */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Log Progress Note</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal <span className="text-red-500">*</span></label>
              <select value={selectedGoal?.domain || ''} onChange={e => setSelectedGoal(iep.goals.find(g => g.domain === e.target.value) || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select goal domain...</option>
                {iep.goals.map(g => <option key={g.domain} value={g.domain}>{g.domain}</option>)}
              </select>
              {selectedGoal && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{selectedGoal.goalStatement.slice(0, 120)}...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Performance Data <span className="text-red-500">*</span></label>
            <input type="text" value={formData.currentPerformance} onChange={e => setFormData(p => ({ ...p, currentPerformance: e.target.value }))}
              placeholder="e.g., Identified 7/10 uppercase letters with 70% accuracy across 3 trials"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress Status <span className="text-red-500">*</span></label>
              <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as ProgressStatus }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {(Object.entries(PROGRESS_STATUS_LABELS) as [ProgressStatus, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
              <input type="text" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                placeholder="e.g., Needed verbal prompting"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveNote} disabled={saving || !selectedGoal || !formData.currentPerformance.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            <button onClick={() => { setShowForm(false); setSelectedGoal(null); }}
              className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-5 py-2 rounded-lg text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Progress report */}
      {generatingReport && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center mb-6">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Generating progress report...</p>
          <p className="text-gray-400 text-sm mt-1">Claude is analyzing progress notes and writing the report.</p>
        </div>
      )}

      {report && !generatingReport && (
        <div className="bg-white border border-purple-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Progress Report — {report.reportingPeriod}</h3>
              <p className="text-xs text-gray-400 mt-1">Generated {new Date(report.generatedAt).toLocaleString()}</p>
            </div>
            <button onClick={() => window.print()} className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
              🖨️ Print
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800">
            ⚠️ AI-generated progress report. Review all content before sharing with families or using in official records.
          </div>

          {report.narratives.map((n, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{n.goalDomain}</span>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{n.goalStatement.slice(0, 100)}...</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${PROGRESS_STATUS_COLORS[n.currentStatus]}`}>
                  {PROGRESS_STATUS_LABELS[n.currentStatus]}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{n.summary}</p>
              {n.dataPoints.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Data Points</p>
                  {n.dataPoints.map((dp, j) => <p key={j} className="text-xs text-gray-600">• {dp}</p>)}
                </div>
              )}
              <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                <span className="text-blue-500 text-xs font-bold shrink-0">→</span>
                <p className="text-xs text-blue-800 font-medium">{n.recommendation}</p>
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Overall Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{report.overallSummary}</p>
          </div>
        </div>
      )}

      {/* Progress notes timeline */}
      {!loaded ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading progress notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-700">No progress notes yet</h3>
          <p className="text-gray-400 text-sm mt-1">Log your first progress note to start tracking student growth.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:underline text-sm">
            Log first note →
          </button>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Progress Timeline</h3>
          {Object.entries(notesByDomain).map(([domain, domainNotes]) => {
            const sorted = [...domainNotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const latest = sorted[0];
            return (
              <div key={domain} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{domain}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{sorted[0].goalStatement.slice(0, 100)}...</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${PROGRESS_STATUS_COLORS[latest.status]}`}>
                    {PROGRESS_STATUS_LABELS[latest.status]}
                  </span>
                </div>
                <div className="space-y-2">
                  {sorted.map(note => (
                    <div key={note.id} className="flex items-start gap-3 text-sm py-2 border-t border-gray-50 first:border-0">
                      <span className="text-gray-400 text-xs shrink-0 w-20">{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mr-2 ${PROGRESS_STATUS_COLORS[note.status]}`}>
                          {PROGRESS_STATUS_LABELS[note.status]}
                        </span>
                        <span className="text-gray-700">{note.currentPerformance}</span>
                        {note.notes && <span className="text-gray-400 text-xs ml-2">— {note.notes}</span>}
                      </div>
                      <button onClick={() => handleDelete(note.id)} className="text-gray-300 hover:text-red-400 text-xs shrink-0">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
