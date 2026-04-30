'use client';

import { useState } from 'react';
import { GeneratedIEP, IEPGoal, IEPService, ProgressPlan, DOMAIN_COLORS, DOMAIN_ICONS } from '@/lib/types';

const TABS = [
  { id: 'plaafp', label: 'Present Levels', icon: '📊' },
  { id: 'goals', label: 'Annual Goals', icon: '🎯' },
  { id: 'services', label: 'Services & Accommodations', icon: '🛠️' },
  { id: 'progress', label: 'Progress Monitoring', icon: '📈' },
];

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{badge}</span>}
    </div>
  );
}

function EditableText({ value, onChange, multiline = false }: { value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (!editing) {
    return <span className="cursor-pointer hover:bg-yellow-50 hover:outline hover:outline-1 hover:outline-yellow-300 rounded px-0.5 transition-all" title="Click to edit" onClick={() => { setDraft(value); setEditing(true); }}>{value}</span>;
  }
  return (
    <span className="block">
      {multiline
        ? <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={5} className="w-full border border-blue-400 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        : <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} className="w-full border border-blue-400 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      }
      <span className="flex gap-2 mt-1.5">
        <button onClick={() => { onChange(draft); setEditing(false); }} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Save</button>
        <button onClick={() => setEditing(false)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200">Cancel</button>
      </span>
    </span>
  );
}

function GoalCard({ goal, onUpdate, editMode }: { goal: IEPGoal; onUpdate: (g: IEPGoal) => void; editMode: boolean }) {
  const colorClass = DOMAIN_COLORS[goal.domain] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  const icon = DOMAIN_ICONS[goal.domain] ?? '📌';
  return (
    <div className="border rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${colorClass}`}><span>{icon}</span> {goal.domain}</div>
      <p className="text-gray-800 text-sm font-medium mb-3 leading-relaxed">
        {editMode ? <EditableText value={goal.goalStatement} onChange={v => onUpdate({ ...goal, goalStatement: v })} multiline /> : goal.goalStatement}
      </p>
      {goal.benchmarks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Short-Term Objectives</p>
          <ol className="space-y-1.5">
            {goal.benchmarks.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                {editMode ? <EditableText value={b} onChange={v => { const bs = [...goal.benchmarks]; bs[i] = v; onUpdate({ ...goal, benchmarks: bs }); }} /> : b}
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
        <div><p className="text-xs font-semibold text-gray-400 uppercase">Success Criteria</p><p className="text-xs text-gray-600 mt-0.5">{editMode ? <EditableText value={goal.successCriteria} onChange={v => onUpdate({ ...goal, successCriteria: v })} /> : goal.successCriteria}</p></div>
        <div><p className="text-xs font-semibold text-gray-400 uppercase">Timeframe</p><p className="text-xs text-gray-600 mt-0.5">{editMode ? <EditableText value={goal.timeframe} onChange={v => onUpdate({ ...goal, timeframe: v })} /> : goal.timeframe}</p></div>
      </div>
    </div>
  );
}

function ServiceRow({ service }: { service: IEPService }) {
  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-800">{service.serviceType}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{service.frequency}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{service.duration}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{service.setting}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{service.provider}</td>
    </tr>
  );
}

function ProgressCard({ plan }: { plan: ProgressPlan }) {
  const colorClass = DOMAIN_COLORS[plan.goalDomain] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  const icon = DOMAIN_ICONS[plan.goalDomain] ?? '📌';
  return (
    <div className="border rounded-xl p-4">
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${colorClass}`}><span>{icon}</span> {plan.goalDomain}</div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Data Collection</p><p className="text-gray-700">{plan.dataCollectionMethod}</p></div>
        <div><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Frequency</p><p className="text-gray-700">{plan.frequency}</p></div>
        <div><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Responsible Party</p><p className="text-gray-700">{plan.responsibleParty}</p></div>
        <div><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Reporting Schedule</p><p className="text-gray-700">{plan.reportingSchedule}</p></div>
      </div>
    </div>
  );
}

export default function IEPViewer({ iep: initialIep, studentName: _studentName }: { iep: GeneratedIEP; studentName?: string }) {
  const [activeTab, setActiveTab] = useState('plaafp');
  const [editMode, setEditMode] = useState(false);
  const [iep, setIep] = useState<GeneratedIEP>(initialIep);
  const [editSaved, setEditSaved] = useState(false);

  const updateGoal = (index: number, updated: IEPGoal) => setIep(prev => ({ ...prev, goals: prev.goals.map((g, i) => i === index ? updated : g) }));

  const handleSaveEdits = () => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem('iep_planner_students');
        if (data) {
          const students = JSON.parse(data);
          const updated = students.map((s: { generatedIEP?: GeneratedIEP }) => s.generatedIEP?.generatedAt === iep.generatedAt ? { ...s, generatedIEP: iep } : s);
          localStorage.setItem('iep_planner_students', JSON.stringify(updated));
          setEditSaved(true); setTimeout(() => setEditSaved(false), 3000);
        }
      } catch {}
    }
    setEditMode(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex gap-1 overflow-x-auto no-print">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4 no-print shrink-0">
          {editSaved && <span className="text-xs text-green-600 font-medium">✅ Saved</span>}
          {editMode ? (
            <>
              <button onClick={handleSaveEdits} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">Save Edits</button>
              <button onClick={() => { setIep(initialIep); setEditMode(false); }} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200">Discard</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors">✏️ Edit Content</button>
          )}
        </div>
      </div>

      {editMode && <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-blue-700 no-print">✏️ <strong>Edit mode</strong> — click any text to edit it.</div>}

      {activeTab === 'plaafp' && (
        <div>
          <SectionHeader title="Present Levels of Academic Achievement & Functional Performance" badge="IDEA Required" />
          <div className="bg-white border rounded-xl p-6">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {editMode
                ? <EditableText value={iep.plaafp} onChange={v => setIep(prev => ({ ...prev, plaafp: v }))} multiline />
                : iep.plaafp.split('\n\n').map((para, i) => <p key={i} className="mb-4 last:mb-0">{para}</p>)
              }
            </div>
          </div>
          {iep.lreStatement && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Least Restrictive Environment (LRE)</p>
              <p className="text-sm text-amber-900">{editMode ? <EditableText value={iep.lreStatement} onChange={v => setIep(prev => ({ ...prev, lreStatement: v }))} multiline /> : iep.lreStatement}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          <SectionHeader title="Measurable Annual Goals" badge={`${iep.goals.length} goal${iep.goals.length !== 1 ? 's' : ''}`} />
          <div className="grid gap-4">{iep.goals.map((goal, i) => <GoalCard key={i} goal={goal} onUpdate={updated => updateGoal(i, updated)} editMode={editMode} />)}</div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div>
            <SectionHeader title="Special Education & Related Services" badge="IDEA Required" />
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr>{['Service Type','Frequency','Duration','Setting','Provider'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                <tbody>{iep.services.map((s, i) => <ServiceRow key={i} service={s} />)}</tbody>
              </table>
            </div>
          </div>
          <div>
            <SectionHeader title="Classroom Accommodations & Supports" />
            <ul className="bg-white border rounded-xl divide-y">
              {iep.accommodations.map((acc, i) => (
                <li key={i} className="px-5 py-3 text-sm text-gray-700 flex gap-3">
                  <span className="text-blue-500 shrink-0">✓</span>
                  {editMode ? <EditableText value={acc} onChange={v => { const a = [...iep.accommodations]; a[i] = v; setIep(prev => ({ ...prev, accommodations: a })); }} /> : acc}
                </li>
              ))}
            </ul>
          </div>
          {iep.assessmentAccommodations.length > 0 && (
            <div>
              <SectionHeader title="Assessment Accommodations" />
              <ul className="bg-white border rounded-xl divide-y">
                {iep.assessmentAccommodations.map((acc, i) => (
                  <li key={i} className="px-5 py-3 text-sm text-gray-700 flex gap-3">
                    <span className="text-purple-500 shrink-0">✓</span>
                    {editMode ? <EditableText value={acc} onChange={v => { const a = [...iep.assessmentAccommodations]; a[i] = v; setIep(prev => ({ ...prev, assessmentAccommodations: a })); }} /> : acc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div>
          <SectionHeader title="Progress Monitoring Plan" badge="IDEA Required" />
          <div className="grid gap-4">{iep.progressMonitoring.map((plan, i) => <ProgressCard key={i} plan={plan} />)}</div>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700">
            <strong>IDEA Requirement:</strong> Progress must be reported to parents as frequently as non-disabled students receive progress reports (typically quarterly).
          </div>
        </div>
      )}
    </div>
  );
}
