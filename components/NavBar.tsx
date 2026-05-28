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
    <>
      <style>{`
        .nb-inner {
          max-width: 1152px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .nb-right { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .nb-add {
          font-size: 14px; font-weight: 600; background: white; color: #1a1a2e;
          padding: 8px 16px; border-radius: 100px; text-decoration: none;
          white-space: nowrap; flex-shrink: 0;
        }
        .nb-divider {
          display: flex; align-items: center; gap: 10px;
          border-left: 1px solid rgba(255,255,255,0.15); padding-left: 10px; min-width: 0;
        }
        .nb-userinfo { text-align: right; min-width: 0; }
        .nb-userinfo p { margin: 0; }
        .nb-label { font-size: 11px; color: rgba(255,255,255,0.4); white-space: nowrap; }
        .nb-name {
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8);
          max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .nb-signout {
          font-size: 13px; background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15);
          padding: 7px 14px; border-radius: 6px; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .nb-inner { padding: 10px 16px; }
          .nb-add { padding: 7px 12px; font-size: 13px; }
          .nb-userinfo { display: none; }
          .nb-divider { border-left: none; padding-left: 0; }
          .nb-signout { padding: 7px 12px; font-size: 12px; }
        }
      `}</style>

      <nav style={{ background: '#1a1a2e', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} className="no-print">
        <div className="nb-inner">
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
            <div className="nb-right">
              <Link href="/students/new" className="nb-add">
                + Add Student
              </Link>
              <div className="nb-divider">
                <div className="nb-userinfo">
                  <p className="nb-label">Signed in as</p>
                  <p className="nb-name" title={displayName}>{shortName}</p>
                </div>
                <button className="nb-signout" onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
