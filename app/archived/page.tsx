'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Student } from '@/lib/types';
import { getArchivedStudents, unarchiveStudent, deleteStudent, calculateAge } from '@/lib/storage';

export default function ArchivedPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getArchivedStudents().then(s => { setStudents(s); setLoaded(true); });
  }, []);

  const handleUnarchive = async (id: string, name: string) => {
    if (!confirm(`Restore ${name} to your active roster?`)) return;
    await unarchiveStudent(id);
    setStudents(await getArchivedStudents());
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}'s record? This cannot be undone.`)) return;
    await deleteStudent(id);
    setStudents(await getArchivedStudents());
  };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (!loaded) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading archived students...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Archived Students</h2>
          <p className="text-gray-500 mt-1">
            {students.length} archived student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-colors">
          ← Active Roster
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
        📦 Archived students are hidden from your main roster but their IEP records are preserved. You can restore them at any time.
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700">No archived students</h3>
          <p className="text-gray-500 mt-2 text-sm">Students you archive will appear here.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            Back to roster
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {students.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
                  {initials(s.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">{s.grade}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-500">Age {calculateAge(s.dateOfBirth)}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.disabilityCategory}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Archived {s.archivedAt ? new Date(s.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    {s.generatedIEP ? ' · IEP on record' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/students/${s.id}`} className="text-sm text-gray-500 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg transition-colors">
                  View IEP
                </Link>
                <button onClick={() => handleUnarchive(s.id, s.name)}
                  className="text-sm text-green-700 hover:bg-green-50 border border-green-200 px-3 py-2 rounded-lg transition-colors">
                  ↩ Restore
                </button>
                <button onClick={() => handleDelete(s.id, s.name)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete permanently">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
