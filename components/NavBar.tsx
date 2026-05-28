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
    <nav style={{ background: '#1a1a2e', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} className="no-print">
      <div style={{
        maxWidth: '1152px', margin: '0 auto',
        padding: '0 16px',
        height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link
          href={user ? '/dashboard' : '/landing'}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <span style={{ fontSize: '22px', lineHeight: 1 }}>💡</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#f8f7f4' }}>
            SmartIEP<span style={{ color: '#f5c842' }}>.co</span>
          </span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Add Student — desktop only */}
            <Link
              href="/students/new"
              style={{
                fontSize: '14px', fontWeight: 600, background: 'white', color: '#1a1a2e',
                padding: '7px 16px', borderRadius: '100px', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
              className="nav-add-desktop"
            >
              + Add Student
            </Link>

            {/* User info — desktop only */}
            <div
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.15)',
                paddingLeft: '10px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
              className="nav-userinfo-desktop"
            >
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Signed in as</p>
                <p style={{
                  fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.8)',
                  margin: 0, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {shortName}
                </p>
              </div>
            </div>

            {/* Sign Out — always visible */}
            <button
              onClick={handleSignOut}
              style={{
                fontSize: '13px', background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Responsive overrides */}
      <style>{`
        .nav-add-desktop { display: inline-flex !important; }
        .nav-userinfo-desktop { display: flex !important; }
        @media (max-width: 600px) {
          .nav-add-desktop { display: none !important; }
          .nav-userinfo-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
