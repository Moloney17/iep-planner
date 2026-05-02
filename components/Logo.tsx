'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  href?: string;
  tagline?: boolean;
};

const BULB_SM = (
  <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
    <ellipse cx="14" cy="14" rx="12" ry="12" fill="#fff8d6" opacity="0.8"/>
    <path d="M4 16 C4 6 24 6 24 16 C24 22 20 26 18 30 L10 30 C8 26 4 22 4 16Z" fill="#f5c842"/>
    <ellipse cx="14" cy="20" rx="5" ry="4" fill="#fff0a0" opacity="0.6"/>
    <path d="M11 24 L11 16 C11 14 14 13 14 13 C14 13 17 14 17 16 L17 24" fill="none" stroke="#c08000" strokeWidth="1" strokeLinecap="round"/>
    <path d="M11 16 C11 14 14 12 14 12 C14 12 17 14 17 16" fill="none" stroke="#c08000" strokeWidth="1" strokeLinecap="round"/>
    <ellipse cx="10" cy="11" rx="2" ry="4" fill="white" opacity="0.25" transform="rotate(-20 10 11)"/>
    <rect x="9" y="31" width="10" height="2.5" rx="1" fill="#c08000"/>
    <rect x="9" y="34" width="10" height="2" rx="1" fill="#b07000"/>
    <rect x="10" y="37" width="8" height="3" rx="1.5" fill="#888"/>
  </svg>
);

const BULB_MD = (
  <svg width="52" height="78" viewBox="0 0 52 78" fill="none">
    <ellipse cx="26" cy="26" rx="22" ry="22" fill="#fff8d6" opacity="0.7"/>
    <ellipse cx="26" cy="26" rx="16" ry="16" fill="#ffeea0" opacity="0.5"/>
    <path d="M6 30 C6 10 46 10 46 30 C46 42 38 50 34 58 L18 58 C14 50 6 42 6 30Z" fill="#f5c842"/>
    <ellipse cx="26" cy="38" rx="9" ry="7" fill="#fff0a0" opacity="0.6"/>
    <path d="M20 48 L20 32 C20 28 26 26 26 26 C26 26 32 28 32 32 L32 48" fill="none" stroke="#c08000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 32 C20 28 26 24 26 24 C26 24 32 28 32 32" fill="none" stroke="#c08000" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="18" cy="20" rx="3" ry="7" fill="white" opacity="0.28" transform="rotate(-20 18 20)"/>
    <rect x="16" y="59" width="20" height="5" rx="2" fill="#d49200"/>
    <rect x="16" y="65" width="20" height="3" rx="1" fill="#c08000"/>
    <rect x="18" y="69" width="16" height="3" rx="1" fill="#b07000"/>
    <rect x="20" y="73" width="12" height="4" rx="2" fill="#888"/>
  </svg>
);

const BULB_LG = (
  <svg width="72" height="108" viewBox="0 0 72 108" fill="none">
    <ellipse cx="36" cy="38" rx="32" ry="32" fill="#fff8d6" opacity="0.7"/>
    <ellipse cx="36" cy="38" rx="22" ry="22" fill="#ffeea0" opacity="0.5"/>
    <path d="M12 42 C12 18 60 18 60 42 C60 56 52 64 48 72 L24 72 C20 64 12 56 12 42Z" fill="#f5c842"/>
    <ellipse cx="36" cy="50" rx="12" ry="10" fill="#fff0a0" opacity="0.6"/>
    <path d="M30 60 L30 42 C30 38 36 36 36 36 C36 36 42 38 42 42 L42 60" fill="none" stroke="#c08000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M30 42 C30 38 36 34 36 34 C36 34 42 38 42 42" fill="none" stroke="#c08000" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="26" cy="28" rx="5" ry="9" fill="white" opacity="0.3" transform="rotate(-20 26 28)"/>
    <rect x="22" y="73" width="28" height="6" rx="2" fill="#d49200"/>
    <rect x="22" y="80" width="28" height="3" rx="1" fill="#c08000"/>
    <rect x="24" y="84" width="24" height="3" rx="1" fill="#b07000"/>
    <rect x="26" y="88" width="20" height="3" rx="1.5" fill="#a06000"/>
    <rect x="28" y="92" width="16" height="5" rx="2.5" fill="#888"/>
  </svg>
);

const sizes = {
  sm: { bulb: BULB_SM, fontSize: '20px', gap: '10px', underlineH: '2px', underlineMt: '2px' },
  md: { bulb: BULB_MD, fontSize: '28px', gap: '14px', underlineH: '2.5px', underlineMt: '3px' },
  lg: { bulb: BULB_LG, fontSize: '46px', gap: '20px', underlineH: '3px', underlineMt: '4px' },
};

export default function Logo({ size = 'md', dark = false, href = '/', tagline = false }: LogoProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const s = sizes[size];

  useEffect(() => {
    const fit = () => {
      if (!textRef.current || !underlineRef.current) return;
      const textRect = textRef.current.getBoundingClientRect();
      const parentRect = textRef.current.parentElement!.getBoundingClientRect();
      underlineRef.current.style.width = Math.round(textRect.right - parentRect.left) + 'px';
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [size]);

  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {s.bulb}
      <div>
        <div style={{ position: 'relative' }}>
          <span
            ref={textRef}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: s.fontSize,
              fontWeight: 700,
              color: dark ? 'white' : '#1a1a2e',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            Smart<span style={{ color: dark ? '#f5c842' : '#185fa5' }}>IEP</span>
          </span>
        </div>
        <div
          ref={underlineRef}
          style={{
            height: s.underlineH,
            background: '#f5c842',
            borderRadius: '2px',
            marginTop: s.underlineMt,
            width: 0,
          }}
        />
        {tagline && (
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: '10px',
            color: dark ? 'rgba(255,255,255,0.4)' : '#aaa',
            letterSpacing: '0.08em',
            marginTop: '6px',
          }}>
            AI-ASSISTED IEP PLANNING
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>
  ) : (
    <div>{content}</div>
  );
}
