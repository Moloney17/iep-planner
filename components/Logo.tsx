'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  href?: string;
  tagline?: boolean;
  showTld?: boolean;
};

const sizes = {
  sm: { emoji: '20px', fontSize: '20px', gap: '8px', underlineH: '2px', underlineMt: '2px' },
  md: { emoji: '28px', fontSize: '26px', gap: '10px', underlineH: '2.5px', underlineMt: '3px' },
  lg: { emoji: '56px', fontSize: '46px', gap: '16px', underlineH: '3px', underlineMt: '5px' },
};

export default function Logo({ size = 'md', dark = false, href = '/', tagline = false, showTld = false }: LogoProps) {
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
      <span style={{ fontSize: s.emoji, lineHeight: 1, flexShrink: 0 }}>💡</span>
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
            {showTld && <span style={{ color: '#f5c842', fontSize: `calc(${s.fontSize} * 0.55)`, fontFamily: 'sans-serif', fontWeight: 400 }}>.co</span>}
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
            transition: 'width 0.2s ease',
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

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return <div>{content}</div>;
}
