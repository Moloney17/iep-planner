'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/landing');
    router.refresh();
  };

  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const shortName = displayName.includes(' ')
    ? displayName.split(' ')[0]
    : displayName.split('@')[0];

  return (
    <nav className="no-print bg-[#1a1a2e] shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link
          href={user ? '/dashboard' : '/landing'}
          className="flex items-center gap-2 shrink-0 no-underline"
          style={{ textDecoration: 'none' }}
        >
          <span className="text-xl leading-none">💡</span>
          <span
            className="text-lg font-bold text-[#f8f7f4]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            SmartIEP<span className="text-[#f5c842]">.co</span>
          </span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Add Student — hidden on mobile */}
            <Link
              href="/students/new"
              className="hidden sm:inline-flex items-center text-sm font-semibold bg-white text-[#1a1a2e] px-4 py-2 rounded-full no-underline whitespace-nowrap"
              style={{ textDecoration: 'none' }}
            >
              + Add Student
            </Link>

            {/* User info — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-3">
              <div className="text-right">
                <p className="text-[11px] text-white/40 m-0 leading-none">Signed in as</p>
                <p className="text-xs font-medium text-white/80 m-0 max-w-[120px] truncate">{shortName}</p>
              </div>
            </div>

            {/* Sign Out — always visible */}
            <button
              onClick={handleSignOut}
              className="text-xs sm:text-sm text-white/70 border border-white/20 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap"
            >
              Sign Out
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}
