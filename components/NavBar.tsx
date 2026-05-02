'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Logo from '@/components/Logo';
import Link from 'next/link';

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
    router.push('/landing');
    router.refresh();
  };

  return (
    <nav style={{ background: '#1a1a2e', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} className="no-print">
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" dark href={user ? '/dashboard' : '/landing'} showTld />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <>
              <Link href="/students/new" style={{ fontSize: '14px', background: 'white', color: '#1a1a2e', fontWeight: 600, padding: '8px 16px', borderRadius: '100px', textDecoration: 'none' }}>
                + Add Student
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Signed in as</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: 500 }}>{user.user_metadata?.full_name || user.email}</p>
                </div>
                <button onClick={handleSignOut} style={{ fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}>
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
