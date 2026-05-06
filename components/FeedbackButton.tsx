'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type FeedbackType = 'bug' | 'feature' | 'general';

const TYPE_OPTIONS: { value: FeedbackType; label: string; icon: string; desc: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: '🐛', desc: 'Something is broken or not working' },
  { value: 'feature', label: 'Feature Request', icon: '💡', desc: 'An idea for something new' },
  { value: 'general', label: 'General Feedback', icon: '💬', desc: 'Anything else on your mind' },
];

export default function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Only show on app pages, not landing/auth/legal
  const isAppPage = !pathname.startsWith('/landing') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/legal') &&
    pathname !== '/';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  if (!isAppPage || !isLoggedIn) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true); setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, page: pathname }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSent(true);
      setTimeout(() => {
        setSent(false); setOpen(false);
        setMessage(''); setType('general');
      }, 2500);
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(''); setType('general');
    setError(''); setSent(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="no-print"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#1a1a2e',
          color: 'white',
          border: 'none',
          borderRadius: '100px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 20px rgba(26,26,46,0.25)',
          zIndex: 50,
          fontFamily: 'sans-serif',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <span>💬</span> Feedback
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            padding: '24px',
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              fontFamily: 'sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#1a1a2e' }}>Send Feedback</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>Help us improve SmartIEP</p>
              </div>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af', padding: '4px' }}>✕</button>
            </div>

            {sent ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <p style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e', margin: '0 0 6px' }}>Thank you!</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Your feedback has been sent.</p>
              </div>
            ) : (
              <div style={{ padding: '20px 24px' }}>
                {/* Type selector */}
                <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Type of feedback</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${type === opt.value ? '#1a1a2e' : '#e5e7eb'}`,
                        background: type === opt.value ? '#1a1a2e' : 'white',
                        color: type === opt.value ? 'white' : '#374151',
                        fontSize: '11px', fontWeight: 600, textAlign: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{opt.icon}</div>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  {TYPE_OPTIONS.find(t => t.value === type)?.desc}
                </p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    type === 'bug' ? "Describe what happened and what you expected instead..." :
                    type === 'feature' ? "Describe the feature and how it would help you..." :
                    "Share your thoughts..."
                  }
                  rows={5}
                  style={{
                    width: '100%', border: '1px solid #e5e7eb', borderRadius: '10px',
                    padding: '12px', fontSize: '14px', resize: 'vertical',
                    outline: 'none', fontFamily: 'sans-serif', lineHeight: 1.6,
                    boxSizing: 'border-box', color: '#1a1a2e',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a1a2e'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />

                {error && <p style={{ color: '#dc2626', fontSize: '13px', margin: '8px 0 0' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
                      background: 'white', color: '#374151', fontSize: '14px', fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={sending || !message.trim()}
                    style={{
                      flex: 2, padding: '10px', borderRadius: '8px', border: 'none',
                      background: message.trim() ? '#1a1a2e' : '#e5e7eb',
                      color: message.trim() ? 'white' : '#9ca3af',
                      fontSize: '14px', fontWeight: 600, cursor: message.trim() ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}
                  >
                    {sending ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>

                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '12px 0 0', textAlign: 'center' }}>
                  Your feedback goes directly to the SmartIEP team.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
