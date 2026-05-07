'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          background: #f8f7f4;
          overflow-x: hidden;
        }

        /* ─── NAV ─────────────────────────────────────────── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 60px;
          background: rgba(248, 247, 244, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(26,26,46,0.08);
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-logo-text { font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1a1a2e; }
        .nav-logo-tld { color: #f5c842; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { text-decoration: none; color: #555; font-size: 15px; font-weight: 400; transition: color 0.2s; }
        .nav-link:hover { color: #1a1a2e; }
        .nav-cta {
          background: #1a1a2e; color: #f8f7f4; padding: 10px 24px;
          border-radius: 100px; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .nav-cta:hover { background: #2d2d4e; transform: translateY(-1px); }
        .nav-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          padding: 4px; flex-direction: column; gap: 5px;
        }
        .nav-hamburger span {
          display: block; width: 22px; height: 2px; background: #1a1a2e;
          border-radius: 2px; transition: all 0.3s;
        }

        /* Mobile menu */
        .mobile-menu {
          display: none; position: fixed; top: 61px; left: 0; right: 0; z-index: 99;
          background: rgba(248,247,244,0.98); backdrop-filter: blur(12px);
          padding: 20px 24px 28px;
          border-bottom: 1px solid rgba(26,26,46,0.1);
          flex-direction: column; gap: 0;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu-link {
          text-decoration: none; color: #333; font-size: 16px; font-weight: 500;
          padding: 14px 0; border-bottom: 1px solid rgba(26,26,46,0.06);
        }
        .mobile-menu-link:last-of-type { border-bottom: none; }
        .mobile-menu-cta {
          margin-top: 16px; background: #1a1a2e; color: #f8f7f4;
          padding: 14px 24px; border-radius: 100px; text-decoration: none;
          font-size: 15px; font-weight: 600; text-align: center;
        }

        /* ─── HERO ───────────────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: space-between;
          gap: 48px;
          padding: 120px 60px 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(74,144,217,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(93,202,165,0.07) 0%, transparent 60%);
        }
        .hero-grid {
          position: absolute; inset: 0; z-index: 0; opacity: 0.03;
          background-image: linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* LEFT COLUMN */
        .hero-content {
          position: relative; z-index: 1;
          flex: 1; min-width: 0; max-width: 580px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(74,144,217,0.1); border: 1px solid rgba(74,144,217,0.2);
          color: #2a6fad; padding: 6px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 500; margin-bottom: 28px;
        }
        .hero-badge-dot { width: 6px; height: 6px; background: #4a90d9; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hero-h1 {
          font-family: Georgia, serif;
          font-size: clamp(40px, 4.5vw, 64px);
          font-weight: 700; line-height: 1.1;
          color: #1a1a2e; margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero-h1 em { font-style: italic; color: #185fa5; }
        .hero-sub {
          font-size: 17px; line-height: 1.7; color: #555;
          margin-bottom: 40px; font-weight: 300; max-width: 500px;
        }
        .hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-primary {
          background: #1a1a2e; color: #f8f7f4;
          padding: 15px 32px; border-radius: 100px;
          font-size: 15px; font-weight: 600; text-decoration: none;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(26,26,46,0.2);
        }
        .btn-primary:hover { background: #2d2d4e; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(26,26,46,0.25); }
        .btn-secondary {
          color: #1a1a2e; font-size: 15px; font-weight: 500; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          border-bottom: 1px solid transparent; transition: border-color 0.2s;
        }
        .btn-secondary:hover { border-color: #1a1a2e; }
        .hero-trust { margin-top: 48px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .hero-trust-text { font-size: 13px; color: #888; }
        .hero-avatars { display: flex; }
        .hero-avatar {
          width: 32px; height: 32px; border-radius: 50%; border: 2px solid #f8f7f4;
          background: #1a1a2e; margin-left: -8px; display: flex; align-items: center;
          justify-content: center; font-size: 11px; font-weight: 600; color: #f8f7f4;
        }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-avatar.a2 { background: #4a90d9; }
        .hero-avatar.a3 { background: #5dcaa5; }
        .hero-avatar.a4 { background: #d85a30; }

        /* RIGHT COLUMN – IEP card */
        .hero-visual {
          position: relative; z-index: 1;
          width: 400px; flex-shrink: 0;
        }
        .iep-card {
          background: white; border-radius: 16px; padding: 24px;
          box-shadow: 0 20px 60px rgba(26,26,46,0.12), 0 2px 8px rgba(26,26,46,0.06);
          border: 1px solid rgba(26,26,46,0.06);
        }
        .iep-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .iep-card-avatar {
          width: 44px; height: 44px; border-radius: 50%; background: #e8f0fb;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #185fa5; flex-shrink: 0;
        }
        .iep-card-name { font-weight: 700; font-size: 15px; color: #1a1a2e; }
        .iep-card-sub { font-size: 12px; color: #888; margin-top: 2px; }
        .iep-card-badge {
          margin-left: auto; background: #eaf6f1; color: #0f6e56;
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;
          white-space: nowrap;
        }
        .iep-section-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .iep-goal {
          background: #f8f7f4; border-radius: 10px; padding: 11px 13px; margin-bottom: 7px;
          display: flex; align-items: flex-start; gap: 9px;
        }
        .iep-goal-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
        .iep-goal-text { font-size: 12.5px; line-height: 1.5; color: #333; }
        .iep-progress { margin-top: 16px; }
        .iep-progress-bar-bg { height: 6px; background: #f0eeeb; border-radius: 100px; margin-top: 6px; }
        .iep-progress-bar { height: 6px; background: #185fa5; border-radius: 100px; width: 72%; }
        .iep-progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-top: 5px; }
        .floating-chip {
          position: absolute; background: white; border-radius: 100px; padding: 8px 16px;
          box-shadow: 0 4px 20px rgba(26,26,46,0.1); display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; white-space: nowrap; z-index: 2;
        }
        .chip-dot { width: 8px; height: 8px; border-radius: 50%; }
        .chip-1 { top: -16px; right: -16px; color: #0f6e56; }
        .chip-2 { bottom: -16px; left: -16px; color: #185fa5; }

        /* ─── PROOF BAR ───────────────────────────────────── */
        .proof-bar {
          background: white; border-top: 1px solid rgba(26,26,46,0.06);
          border-bottom: 1px solid rgba(26,26,46,0.06);
          padding: 20px 60px;
          display: flex; align-items: center; justify-content: center;
          gap: 48px; flex-wrap: wrap;
        }
        .proof-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #666; font-weight: 500; }
        .proof-icon { font-size: 18px; }

        /* ─── SECTIONS (shared) ───────────────────────────── */
        .section { padding: 100px 60px; }
        .section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #185fa5; margin-bottom: 16px; }
        .section-h2 { font-family: Georgia, serif; font-size: clamp(28px, 3vw, 42px); font-weight: 700; color: #1a1a2e; line-height: 1.2; margin-bottom: 16px; }
        .section-sub { font-size: 17px; color: #666; line-height: 1.6; max-width: 560px; }

        /* ─── FEATURES ────────────────────────────────────── */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .feature-card {
          background: white; border-radius: 16px; padding: 28px;
          border: 1px solid rgba(26,26,46,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(26,26,46,0.09); }
        .feature-icon { font-size: 28px; margin-bottom: 16px; }
        .feature-title { font-weight: 700; font-size: 16px; color: #1a1a2e; margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: #666; line-height: 1.6; }
        .feature-tag {
          display: inline-block; margin-top: 14px;
          font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          padding: 3px 9px; border-radius: 100px;
        }
        .tag-core { background: #eaf6f1; color: #0f6e56; }
        .tag-pro { background: #e8f0fb; color: #185fa5; }
        .tag-idea { background: #fef9e7; color: #9a6e00; }

        /* ─── HOW IT WORKS ────────────────────────────────── */
        .how-section { background: white; padding: 100px 60px; }
        .steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 28px; margin-top: 56px; }
        .step { position: relative; }
        .step-connector {
          position: absolute; top: 26px; right: -14px; width: 28px; height: 1px;
          background: rgba(245,200,66,0.25);
        }
        .step-num {
          font-family: Georgia, serif; font-size: 44px; font-weight: 700;
          color: rgba(245,200,66,0.25); line-height: 1; margin-bottom: 12px;
        }
        .step-title { font-weight: 700; font-size: 15px; color: #1a1a2e; margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: #666; line-height: 1.6; }

        /* ─── BUILT BY SPED ───────────────────────────────── */
        .sped-section {
          background: #1a1a2e; padding: 100px 60px;
          display: flex; align-items: center; gap: 80px; flex-wrap: wrap;
        }
        .sped-content { flex: 1; min-width: 280px; }
        .sped-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #f5c842; margin-bottom: 16px; }
        .sped-h2 { font-family: Georgia, serif; font-size: clamp(26px, 2.8vw, 38px); font-weight: 700; color: #f8f7f4; line-height: 1.25; margin-bottom: 20px; }
        .sped-sub { font-size: 16px; color: rgba(248,247,244,0.65); line-height: 1.7; }
        .sped-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; }
        .sped-pill {
          background: rgba(248,247,244,0.08); border: 1px solid rgba(248,247,244,0.15);
          color: rgba(248,247,244,0.8); padding: 7px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 500;
        }
        .sped-quote { flex: 1; min-width: 280px; max-width: 420px; }
        .sped-quote-text {
          font-family: Georgia, serif; font-size: 19px; font-style: italic;
          color: rgba(248,247,244,0.9); line-height: 1.7; margin-bottom: 24px;
        }
        .sped-quote-author { display: flex; align-items: center; gap: 14px; }
        .sped-quote-avatar {
          width: 48px; height: 48px; border-radius: 50%; background: #f5c842;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #1a1a2e; flex-shrink: 0;
        }
        .sped-quote-name { font-weight: 700; color: #f8f7f4; font-size: 14px; }
        .sped-quote-role { font-size: 12px; color: rgba(248,247,244,0.5); margin-top: 3px; }

        /* ─── TESTIMONIALS ────────────────────────────────── */
        .testimonials-section { padding: 100px 60px; background: #f8f7f4; }
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .testimonial-card {
          background: white; border-radius: 16px; padding: 28px;
          border: 1px solid rgba(26,26,46,0.07);
          display: flex; flex-direction: column; gap: 18px;
        }
        .testimonial-stars { color: #f0a500; font-size: 15px; letter-spacing: 2px; }
        .testimonial-quote {
          font-family: Georgia, serif; font-size: 15px; line-height: 1.8;
          color: #333; font-style: italic; flex: 1;
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: var(--av-bg, #e8f0fb);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: var(--av-color, #185fa5);
        }
        .testimonial-name { font-weight: 700; font-size: 14px; color: #1a1a2e; }
        .testimonial-role { font-size: 12px; color: #888; margin-top: 2px; }
        .testimonial-badge {
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px;
          background: #e8f0fb; color: #185fa5; margin-left: auto; white-space: nowrap;
        }

        /* ─── STATS ───────────────────────────────────────── */
        .stats-section { background: #185fa5; padding: 80px 60px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 40px; text-align: center; }
        .stat-num { font-family: Georgia, serif; font-size: 52px; font-weight: 700; color: white; line-height: 1; }
        .stat-label { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 10px; line-height: 1.5; }

        /* ─── PRICING ─────────────────────────────────────── */
        .pricing-section { padding: 100px 60px; background: #f8f7f4; text-align: center; }
        .pricing-cards { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-top: 56px; }
        .pricing-card {
          background: white; border-radius: 20px; padding: 40px 36px;
          border: 1px solid rgba(26,26,46,0.08); width: 300px;
          text-align: left; position: relative;
        }
        .pricing-card.featured {
          background: #1a1a2e; border-color: #1a1a2e;
          box-shadow: 0 20px 60px rgba(26,26,46,0.2);
        }
        .pricing-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #f5c842; color: #1a1a2e; font-size: 11px; font-weight: 700;
          padding: 4px 14px; border-radius: 100px; white-space: nowrap;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .pricing-tier { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 12px; }
        .pricing-tier.light { color: rgba(248,247,244,0.5); }
        .pricing-price { font-family: Georgia, serif; font-size: 48px; font-weight: 700; color: #1a1a2e; line-height: 1; }
        .pricing-price.light { color: #f8f7f4; }
        .pricing-period { font-size: 14px; color: #888; margin-top: 4px; }
        .pricing-period.light { color: rgba(248,247,244,0.5); }
        .pricing-divider { height: 1px; background: rgba(26,26,46,0.08); margin: 24px 0; }
        .pricing-divider.light { background: rgba(248,247,244,0.1); }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .pricing-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #444; line-height: 1.4; }
        .pricing-features li.light { color: rgba(248,247,244,0.8); }
        .pricing-features li.locked { color: #bbb; }
        .pricing-check { color: #0f6e56; font-weight: 700; flex-shrink: 0; }
        .pricing-check.light { color: #5dcaa5; }
        .pricing-lock { color: #ccc; flex-shrink: 0; }
        .pricing-btn {
          display: block; text-align: center; padding: 14px;
          border-radius: 100px; font-size: 15px; font-weight: 700;
          text-decoration: none; transition: all 0.2s;
        }
        .pricing-btn-free { background: #f8f7f4; color: #1a1a2e; border: 1.5px solid rgba(26,26,46,0.15); }
        .pricing-btn-free:hover { background: #eee; }
        .pricing-btn-pro { background: #f5c842; color: #1a1a2e; }
        .pricing-btn-pro:hover { background: #e8b800; transform: translateY(-1px); }

        /* ─── CTA ─────────────────────────────────────────── */
        .cta-section {
          background: #1a1a2e; padding: 100px 60px; text-align: center;
        }
        .cta-h2 { font-family: Georgia, serif; font-size: clamp(28px, 3vw, 44px); font-weight: 700; color: #f8f7f4; margin-bottom: 16px; }
        .cta-sub { font-size: 17px; color: rgba(248,247,244,0.6); margin-bottom: 40px; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #f5c842; color: #1a1a2e; padding: 16px 40px;
          border-radius: 100px; font-size: 16px; font-weight: 700;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(245,200,66,0.3);
        }
        .cta-btn:hover { background: #e8b800; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,200,66,0.4); }
        .cta-fine { margin-top: 20px; font-size: 13px; color: rgba(248,247,244,0.35); }

        /* ─── FOOTER ──────────────────────────────────────── */
        .footer {
          background: #111827; padding: 48px 60px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 24px;
        }
        .footer-logo { font-family: Georgia, serif; font-size: 19px; font-weight: 700; color: #f8f7f4; }
        .footer-logo span { color: #f5c842; }
        .footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
        .footer-link { text-decoration: none; color: rgba(248,247,244,0.45); font-size: 14px; transition: color 0.2s; }
        .footer-link:hover { color: #f8f7f4; }
        .footer-copy { font-size: 13px; color: rgba(248,247,244,0.3); }
        .disclaimer {
          background: #0d131e; padding: 16px 60px; text-align: center;
          font-size: 12px; color: rgba(248,247,244,0.25); line-height: 1.6;
        }

        /* ─── RESPONSIVE: 1200px ─────────────────────────── */
        @media (max-width: 1200px) {
          .hero-visual { width: 360px; }
        }

        /* ─── RESPONSIVE: 1024px ─────────────────────────── */
        @media (max-width: 1024px) {
  .hero {
    gap: 32px;
    padding: 90px 32px 60px;
    min-height: auto;
  }
  .hero-visual { width: 300px; }
  .steps { grid-template-columns: repeat(3, 1fr); }
  .steps .step:nth-child(3) .step-connector { display: none; }
}

@media (max-width: 1024px) and (orientation: landscape) {
  .hero {
    padding-top: 80px;
    min-height: auto;
    align-items: flex-start;
  }
}
        /* ─── RESPONSIVE: 900px ──────────────────────────── */
        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }

          /* Hero goes single column */
          .hero {
            flex-direction: column; align-items: flex-start;
            padding: 100px 24px 60px; min-height: auto; gap: 48px;
          }
          .hero-content { max-width: 100%; }
          .hero-visual { width: 100%; max-width: 440px; align-self: center; }
          .chip-1 { top: -12px; right: -8px; font-size: 12px; padding: 6px 12px; }
          .chip-2 { bottom: -12px; left: -8px; font-size: 12px; padding: 6px 12px; }

          .proof-bar { padding: 20px 24px; gap: 20px; }
          .proof-item { font-size: 12px; }

          .section { padding: 72px 24px; }
          .how-section { padding: 72px 24px; }
          .testimonials-section { padding: 72px 24px; }
          .stats-section { padding: 60px 24px; }
          .sped-section { padding: 72px 24px; gap: 48px; }
          .pricing-section { padding: 72px 24px; }
          .cta-section { padding: 72px 24px; }

          .steps { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .steps .step:nth-child(2) .step-connector,
          .steps .step:nth-child(4) .step-connector { display: none; }
          .steps .step:nth-child(3) .step-connector { display: block; }

          .sped-section { flex-direction: column; }
          .sped-quote { max-width: 100%; }

          .footer { padding: 40px 24px; flex-direction: column; align-items: flex-start; gap: 20px; }
          .footer-links { gap: 20px; }
          .disclaimer { padding: 16px 24px; }
          .pricing-cards { flex-direction: column; align-items: center; }
          .pricing-card { width: 100%; max-width: 360px; }
        }

        /* ─── RESPONSIVE: 480px ──────────────────────────── */
        @media (max-width: 480px) {
          .hero-h1 { font-size: 36px; }
          .hero-badge { font-size: 11px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
          .stat-num { font-size: 40px; }
          .features-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr 1fr; }
          .proof-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .hero-actions { flex-direction: column; align-items: flex-start; }
          .btn-primary { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <span style={{fontSize:'22px',lineHeight:'1'}}>💡</span>
          <span className="nav-logo-text">SmartIEP<span className="nav-logo-tld">.co</span></span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#testimonials" className="nav-link">Reviews</a>
        </div>
        <Link href="/auth/login" className="nav-cta">Sign In →</Link>
        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span style={mobileMenuOpen ? {transform:'rotate(45deg) translate(5px,5px)'} : {}} />
          <span style={mobileMenuOpen ? {opacity:0} : {}} />
          <span style={mobileMenuOpen ? {transform:'rotate(-45deg) translate(5px,-5px)'} : {}} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
        <a href="#features" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#how-it-works" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        <a href="#pricing" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#testimonials" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
        <Link href="/auth/login" className="mobile-menu-cta" onClick={() => setMobileMenuOpen(false)}>Sign In →</Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        {/* LEFT: copy */}
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            IDEA 2004 Compliant · Built by SPED Educators
          </div>
          <h1 className="hero-h1">
            IEP planning that<br />takes <em>minutes,</em><br />not hours.
          </h1>
          <p className="hero-sub">
            SmartIEP helps special education teachers generate comprehensive, legally compliant IEP drafts — complete with goals, services, accommodations, and progress monitoring — in under 5 minutes.
          </p>
          <div className="hero-actions">
            <Link href="/auth/signup" className="btn-primary">Start free →</Link>
            <a href="#how-it-works" className="btn-secondary">See how it works ↓</a>
          </div>
          <div className="hero-trust">
            <div className="hero-avatars">
              <div className="hero-avatar">SL</div>
              <div className="hero-avatar a2">MR</div>
              <div className="hero-avatar a3">JP</div>
              <div className="hero-avatar a4">KT</div>
            </div>
            <span className="hero-trust-text">Built by and for special education teachers</span>
          </div>
        </div>

        {/* RIGHT: IEP card */}
        <div className="hero-visual">
          <div style={{position: 'relative'}}>
            <div className="floating-chip chip-1">
              <div className="chip-dot" style={{background: '#5dcaa5'}} />
              IEP Generated in 52 seconds
            </div>
            <div className="iep-card">
              <div className="iep-card-header">
                <div className="iep-card-avatar">JM</div>
                <div>
                  <div className="iep-card-name">Jamie Mitchell</div>
                  <div className="iep-card-sub">Grade 2 · Autism Spectrum Disorder</div>
                </div>
                <div className="iep-card-badge">✓ Generated</div>
              </div>
              <div className="iep-section-label">Annual Goals</div>
              <div className="iep-goal">
                <div className="iep-goal-dot" style={{background: '#4a90d9'}} />
                <div className="iep-goal-text">Jamie will use 3-word phrases to request preferred items with 80% accuracy across 3 sessions.</div>
              </div>
              <div className="iep-goal">
                <div className="iep-goal-dot" style={{background: '#5dcaa5'}} />
                <div className="iep-goal-text">Jamie will initiate peer interactions during structured play 3x per 30-min session.</div>
              </div>
              <div className="iep-goal">
                <div className="iep-goal-dot" style={{background: '#f5c842'}} />
                <div className="iep-goal-text">Jamie will independently complete 4-step self-care routines with visual supports.</div>
              </div>
              <div className="iep-progress">
                <div className="iep-section-label" style={{marginTop:'16px'}}>Progress — Q2 Report</div>
                <div className="iep-progress-bar-bg"><div className="iep-progress-bar" /></div>
                <div className="iep-progress-label"><span>3 domains · 6 goals</span><span>On Track ✓</span></div>
              </div>
            </div>
            <div className="floating-chip chip-2">
              <div className="chip-dot" style={{background: '#4a90d9'}} />
              IDEA 2004 compliant draft
            </div>
          </div>
        </div>
      </section>

      {/* PROOF BAR */}
      <div className="proof-bar">
        {[
          { icon: '🏫', text: 'Built by SPED Educators' },
          { icon: '⚡', text: 'IEP draft in under 5 minutes' },
          { icon: '📋', text: 'IDEA 2004 aligned' },
          { icon: '🔒', text: 'FERPA-aware design' },
          { icon: '📊', text: 'Progress monitoring built-in' },
        ].map((p, i) => (
          <div key={i} className="proof-item">
            <span className="proof-icon">{p.icon}</span>
            {p.text}
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="section" id="features" style={{background:'white'}}>
        <div className="section-label">Everything You Need</div>
        <h2 className="section-h2">Built for the realities of SPED teaching</h2>
        <p className="section-sub">Every feature was designed by and for special educators — not generic AI tools retrofitted for education.</p>
        <div className="features-grid">
          {[
            { icon: '🧠', title: 'AI Goal Generation', desc: 'SMART goals auto-generated from present level data across all 5 developmental domains.', tag: 'Core Feature', tagClass: 'tag-core' },
            { icon: '📋', title: 'IDEA 2004 Alignment', desc: 'Every output maps to federal compliance requirements — goals, services, and accommodations.', tag: 'IDEA Compliant', tagClass: 'tag-idea' },
            { icon: '📈', title: 'Progress Monitoring', desc: 'Track goal progress quarterly. Generate AI progress reports from your data.', tag: 'Core Feature', tagClass: 'tag-core' },
            { icon: '📤', title: 'PDF & Data Export', desc: 'Export to print-ready PDF or structured data for your district system.', tag: 'Core Feature', tagClass: 'tag-core' },
            { icon: '👨‍👩‍👧', title: 'Multi-Student Roster', desc: 'Manage all your students in one place with full IEP history and version tracking.', tag: 'Core Feature', tagClass: 'tag-core' },
            { icon: '♿', title: 'Accommodations Library', desc: 'Pre-built, categorized accommodations — with AI suggestions based on disability profile.', tag: 'Core Feature', tagClass: 'tag-core' },
            { icon: '🔁', title: 'Iterative Editing', desc: 'Regenerate individual sections without losing the rest. Refine until it\'s exactly right.', tag: 'Pro Feature', tagClass: 'tag-pro' },
            { icon: '🗃️', title: 'Student Archiving', desc: 'Archive students at year-end to preserve records without cluttering your active roster.', tag: 'Pro Feature', tagClass: 'tag-pro' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <span className={`feature-tag ${f.tagClass}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-label">How It Works</div>
        <h2 className="section-h2">From student data to complete IEP draft in 5 steps</h2>
        <div className="steps">
          {[
            { n: '01', title: 'Add Your Student', desc: 'Enter basic info, disability category, and grade level.' },
            { n: '02', title: 'Enter Present Levels', desc: 'Describe performance in cognitive, communication, social, adaptive, and motor domains.' },
            { n: '03', title: 'Review Context', desc: 'Add strengths, concerns, family priorities, and current services.' },
            { n: '04', title: 'Generate IEP', desc: 'AI produces goals, services, accommodations, and progress plans in under a minute.' },
            { n: '05', title: 'Track Progress', desc: 'Log quarterly data and generate progress reports for parent conferences.' },
          ].map((s, i, arr) => (
            <div key={i} className="step">
              {i < arr.length - 1 && <div className="step-connector" />}
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BUILT BY SPED */}
      <section className="sped-section">
        <div className="sped-content">
          <div className="sped-label">Our Story</div>
          <h2 className="sped-h2">Made by teachers who lived the paperwork burden.</h2>
          <p className="sped-sub">SmartIEP was built by special educators who spent nights and weekends writing IEPs instead of planning instruction. We know what teachers actually need — and what generic AI tools get wrong.</p>
          <div className="sped-pills">
            {['Special Education Teachers', 'School Psychologists', 'Speech-Language Pathologists', 'Occupational Therapists', 'IDEA 2004 Experts'].map((pill, i) => (
              <span key={i} className="sped-pill">{pill}</span>
            ))}
          </div>
        </div>
        <div className="sped-quote">
          <p className="sped-quote-text">"I used to spend my entire Sunday writing IEPs. Now I spend 20 minutes reviewing them. SmartIEP gave me my weekends back."</p>
          <div className="sped-quote-author">
            <div className="sped-quote-avatar">KL</div>
            <div>
              <div className="sped-quote-name">Kara L.</div>
              <div className="sped-quote-role">Resource Room Teacher · 9 years experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <div style={{textAlign:'center'}}>
          <div className="section-label">From Teachers</div>
          <h2 className="section-h2">What educators are saying</h2>
        </div>
        <div className="testimonials-grid">
          {[
            { quote: "I have 22 students on my caseload. Before SmartIEP, IEP season felt impossible. Now I actually have time to individualize each one properly.", name: 'Sarah T.', role: 'Special Education Resource Teacher', initials: 'ST', bg: '#e8f0fb', color: '#185fa5', badge: 'Verified Teacher' },
            { quote: "The goals it generates are genuinely good — specific, measurable, and actually appropriate for my students' profiles. I'm not starting from scratch anymore.", name: 'Marcus J.', role: 'Autism Support Specialist', initials: 'MJ', bg: '#e1f5ee', color: '#085041', badge: 'Verified Teacher' },
            { quote: "My IEPs now pass compliance review consistently. SmartIEP generates the kind of specific, data-driven language our director wants to see.", name: 'Diana M.', role: 'Special Education Director', initials: 'DM', bg: '#fef9e7', color: '#9a6e00', badge: 'District Leader' },
            { quote: "I work with students who have complex profiles across multiple domains. SmartIEP captures the nuance when you give it detailed present level data.", name: 'Rosa C.', role: 'Multiple Disabilities Specialist', initials: 'RC', bg: '#e8f0fb', color: '#185fa5', badge: 'Verified Teacher' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{'--av-bg': t.bg, '--av-color': t.color} as React.CSSProperties}>{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
                <div className="testimonial-badge">{t.badge}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { num: '< 5', label: 'Minutes to a complete IEP draft' },
            { num: '5', label: 'Developmental domains per student' },
            { num: '7', label: 'District SPED systems supported for export' },
            { num: '∞', label: 'Version history — never lose a draft' },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-label">Simple Pricing</div>
        <h2 className="section-h2">Start free. Upgrade when you're ready.</h2>
        <p className="section-sub" style={{margin:'0 auto',textAlign:'center'}}>No credit card required to get started.</p>
        <div className="pricing-cards">
          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-tier">Free</div>
            <div className="pricing-price">$0</div>
            <div className="pricing-period">forever free</div>
            <div className="pricing-divider" />
            <ul className="pricing-features">
              {['Up to 3 students','IEP generation','PDF export','Basic accommodations library','Email support'].map((f, i) => (
                <li key={i}><span className="pricing-check">✓</span>{f}</li>
              ))}
              {['Unlimited students','Progress monitoring','AI progress reports','Priority support'].map((f, i) => (
                <li key={i} className="locked"><span className="pricing-lock">🔒</span>{f}</li>
              ))}
            </ul>
            <Link href="/auth/signup" className="pricing-btn pricing-btn-free">Get started free</Link>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-tier light">Pro</div>
            <div className="pricing-price light">$12</div>
            <div className="pricing-period light">per month</div>
            <div className="pricing-divider light" />
            <ul className="pricing-features">
              {['Unlimited students','IEP generation','PDF + data export','Full accommodations library','Progress monitoring & reports','AI progress report generation','Student archiving','Priority support'].map((f, i) => (
                <li key={i} className="light"><span className="pricing-check light">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/auth/signup" className="pricing-btn pricing-btn-pro">Start free trial</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-h2">Stop spending evenings writing IEPs.</h2>
        <p className="cta-sub">Join hundreds of special education teachers who reclaimed their time with SmartIEP.</p>
        <Link href="/auth/signup" className="cta-btn">Get started free →</Link>
        <p className="cta-fine">No credit card required · Free plan available · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">SmartIEP<span>.co</span></div>
        <div className="footer-links">
          <a href="#features" className="footer-link">Features</a>
          <a href="#pricing" className="footer-link">Pricing</a>
          <Link href="/auth/login" className="footer-link">Sign In</Link>
          <Link href="/auth/signup" className="footer-link">Sign Up</Link>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} SmartIEP</span>
      </footer>
      <div className="disclaimer">
        SmartIEP generates AI-assisted draft content only. All IEPs must be reviewed, edited, and approved by qualified special education professionals before implementation. SmartIEP is not a substitute for professional judgment. This tool is designed to assist, not replace, the IEP team process required under IDEA 2004.
      </div>
    </div>
  );
}
