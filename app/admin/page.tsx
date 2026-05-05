'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

const ADMIN_EMAIL = 'moloney.conor@gmail.com';

interface Stats {
  total_users: number;
  total_students: number;
  total_ieps: number;
  total_progress_notes: number;
  new_users_this_week: number;
  new_ieps_this_week: number;
}

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed: boolean;
  student_count: number;
  iep_count: number;
  total_ieps_generated: number;
}

interface DailyCount {
  date: string;
  count: number;
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function MiniChart({ data }: { data: DailyCount[] }) {
  if (!data.length) return <div className="text-center text-gray-400 py-8 text-sm">No data yet</div>;

  const max = Math.max(...data.map(d => d.count), 1);
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const found = data.find(item => item.date === dateStr);
    return { date: dateStr, count: found?.count || 0 };
  });

  return (
    <div className="flex items-end gap-1 h-24">
      {last30.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.count} IEPs`}>
          <div
            className="w-full rounded-sm transition-all"
            style={{
              height: `${Math.max((d.count / max) * 80, d.count > 0 ? 4 : 0)}px`,
              background: d.count > 0 ? '#185fa5' : '#f0f0f0',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [daily, setDaily] = useState<DailyCount[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'iep_count' | 'last_sign_in_at'>('created_at');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email !== ADMIN_EMAIL) {
        router.push('/dashboard');
        return;
      }
      setAuthorized(true);
      loadData();
    });
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, dailyRes] = await Promise.all([
        fetch('/api/admin?type=stats'),
        fetch('/api/admin?type=users'),
        fetch('/api/admin?type=daily'),
      ]);
      const [statsData, usersData, dailyData] = await Promise.all([
        statsRes.json(), usersRes.json(), dailyRes.json()
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setDaily(dailyData || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!authorized) return null;

  const filtered = users
    .filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'iep_count') return (b.iep_count || 0) - (a.iep_count || 0);
      if (sortBy === 'last_sign_in_at') return new Date(b.last_sign_in_at || 0).getTime() - new Date(a.last_sign_in_at || 0).getTime();
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const formatRelative = (d: string) => {
    if (!d) return '—';
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">SmartIEP usage overview — visible only to you</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg transition-colors">
            ↻ Refresh
          </button>
          <Link href="/dashboard" className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg transition-colors">
            ← Dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Users" value={stats?.total_users || 0} color="text-blue-600" />
            <StatCard label="Total Students" value={stats?.total_students || 0} color="text-gray-900" />
            <StatCard label="IEPs Generated" value={stats?.total_ieps || 0} color="text-purple-600" />
            <StatCard label="Progress Notes" value={stats?.total_progress_notes || 0} color="text-green-600" />
            <StatCard label="New Users" value={stats?.new_users_this_week || 0} sub="last 7 days" color="text-blue-500" />
            <StatCard label="New IEPs" value={stats?.new_ieps_this_week || 0} sub="last 7 days" color="text-purple-500" />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">IEPs Generated — Last 30 Days</h2>
              <span className="text-xs text-gray-400">Each bar = 1 day</span>
            </div>
            <MiniChart data={daily} />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Users table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-semibold text-gray-900">All Users ({users.length})</h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                />
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="created_at">Sort: Newest</option>
                  <option value="iep_count">Sort: Most IEPs</option>
                  <option value="last_sign_in_at">Sort: Last Active</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Teacher', 'Signed Up', 'Last Active', 'Students', 'IEPs', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                            {(u.full_name || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{u.full_name || '—'}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(u.created_at)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatRelative(u.last_sign_in_at)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{u.student_count || 0}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{u.iep_count || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.email_confirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {u.email_confirmed ? 'Active' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
