'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const TIMEOUT_MS = 2 * 60 * 60 * 1000;      // 2 hours
const WARNING_MS = 5 * 60 * 1000;            // warn 5 min before
const WARN_AT_MS = TIMEOUT_MS - WARNING_MS;  // 1h 55min

// Pages that don't need the guard (not logged in)
const PUBLIC_PATHS = ['/landing', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];

export default function InactivityGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_MS / 1000); // seconds
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPublicPage = PUBLIC_PATHS.some(p => pathname?.startsWith(p));

  const clearAllTimers = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const signOut = useCallback(async () => {
    clearAllTimers();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login?reason=timeout');
    router.refresh();
  }, [clearAllTimers, router]);

  const resetTimers = useCallback(() => {
    if (isPublicPage) return;
    clearAllTimers();
    setShowWarning(false);
    setCountdown(WARNING_MS / 1000);

    warnTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(WARNING_MS / 1000);
      // Tick countdown every second
      countdownInterval.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARN_AT_MS);

    logoutTimer.current = setTimeout(() => {
      signOut();
    }, TIMEOUT_MS);
  }, [isPublicPage, clearAllTimers, signOut]);

  useEffect(() => {
    if (isPublicPage) return;

    // Check if user is actually logged in before activating
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return; // not logged in, don't activate
      resetTimers();
    });

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleActivity = () => {
      if (!showWarning) resetTimers();
    };

    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      clearAllTimers();
    };
  }, [isPublicPage, pathname, resetTimers, clearAllTimers, showWarning]);

  // Format countdown as m:ss
  const mins = Math.floor(countdown / 60);
  const secs = String(countdown % 60).padStart(2, '0');

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '40px 36px', maxWidth: '420px', width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏱️</div>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700,
          color: '#1a1a2e', marginBottom: '12px',
        }}>
          Still there?
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '8px' }}>
          For your students' privacy, you'll be signed out due to inactivity in:
        </p>
        <div style={{
          fontSize: '48px', fontWeight: 700, fontFamily: 'Georgia, serif',
          color: countdown <= 60 ? '#c0392b' : '#185fa5',
          margin: '16px 0',
          transition: 'color 0.3s',
        }}>
          {mins}:{secs}
        </div>
        <button
          onClick={resetTimers}
          style={{
            width: '100%', padding: '14px',
            background: '#1a1a2e', color: 'white',
            border: 'none', borderRadius: '100px',
            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            marginBottom: '12px', transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#2d2d4e')}
          onMouseOut={e => (e.currentTarget.style.background = '#1a1a2e')}
        >
          I'm still here — keep me signed in
        </button>
        <button
          onClick={signOut}
          style={{
            width: '100%', padding: '12px',
            background: 'transparent', color: '#999',
            border: '1px solid #eee', borderRadius: '100px',
            fontSize: '14px', cursor: 'pointer',
          }}
        >
          Sign out now
        </button>
      </div>
    </div>
  );
}
