'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md no-print">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-lg font-bold leading-tight">IEP Planner</p>
            <p className="text-xs text-blue-200">Early Education Support Tool</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link href="/students/new" className="text-sm bg-white text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                + Add Student
              </Link>
              <div className="flex items-center gap-2 border-l border-blue-500 pl-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-blue-200">Signed in as</p>
                  <p className="text-xs font-medium truncate max-w-[150px]">{user.user_metadata?.full_name || user.email}</p>
                </div>
                <button onClick={handleSignOut} className="text-xs bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
