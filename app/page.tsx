'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Student } from '@/lib/types';
import { getStudents, deleteStudent, calculateAge } from '@/lib/storage';

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    getStudents().then(s => { setStudents(s); setLoaded(true); });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s IEP record? This cannot be undone.`)) return;
    await deleteStudent(id);
    setStudents(await getStudents());
  };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const grades = Array.from(new Set(students.map(s => s.grade))).sort();
const categories = Array.from(new Set(students.map(s => s.disabilityCategory))).sort();

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.disabilityCategory.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q);
    const matchGrade = !filterGrade || s.grade === filterGrade;
    const matchCat = !filterCategory || s.disabilityCategory === filterCategory;
    return matchSearch && matchGrade && matchCat;
  });

  const hasFilters = search || filterGrade || filterCategory;

  if (!loaded) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading students...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Students</h2>
          <p className="text-gray-500 mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} in your roster
            {hasFilters && filtered.length !== students.length && ` · ${filtered.length} shown`}
          </p>
        </div>
        <Link href="/students/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <span className="text-lg">+</span> Add Student
        </Link>
      </div>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" placeholder="🔍 Search by name, grade, or disability..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Grades</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {hasFilters && <button onClick={() => { setSearch(''); setFilterGrade(''); setFilterCategory(''); }} className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">✕ Clear</button>}
        </div>
      )}

      {students.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700">No students yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Add a student to start generating customized, IDEA-compliant IEP plans.</p>
          <Link href="/students/new" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">Add First Student</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700">No students match your filters</h3>
          <button onClick={() => { setSearch(''); setFilterGrade(''); setFilterCategory(''); }} className="mt-3 text-blue-600 hover:underline text-sm">Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">{initials(s.name)}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">{s.grade}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-500">Age {calculateAge(s.dateOfBirth)}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{s.disabilityCategory}</span>
                    {(s.iepHistory?.length ?? 0) > 0 && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">{(s.iepHistory?.length ?? 0) + (s.generatedIEP ? 1 : 0)} versions</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{s.generatedIEP ? `✅ IEP generated ${new Date(s.generatedIEP.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : '⏳ No IEP generated yet'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/students/${s.id}/edit`} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm" title="Edit student">✏️</Link>
                <Link href={`/students/${s.id}`} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">{s.generatedIEP ? 'View IEP' : 'Generate IEP'}</Link>
                <button onClick={() => handleDelete(s.id, s.name)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete student">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
