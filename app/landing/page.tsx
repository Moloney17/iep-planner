'use client';

import Link from 'next/link';

export default function LandingPage() {
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

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 60px;
          background: rgba(248, 247, 244, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(26,26,46,0.08);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
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

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
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
        .hero-content { position: relative; z-index: 1; max-width: 620px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(74,144,217,0.1); border: 1px solid rgba(74,144,217,0.2);
          color: #2a6fad; padding: 6px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 600; margin-bottom: 28px;
        }
        .hero-badge-dot { width: 6px; height: 6px; background: #4a90d9; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hero-h1 {
          font-family: Georgia, serif;
          font-size: clamp(40px, 5.5vw, 68px);
          font-weight: 700; line-height: 1.1;
          color: #1a1a2e; margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero-h1 em { font-style: italic; color: #185fa5; }
        .hero-sub {
          font-size: 18px; line-height: 1.75; color: #444;
          margin-bottom: 40px; max-width: 520px;
        }
        .hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-primary {
          background: #1a1a2e; color: #f8f7f4;
          padding: 16px 36px; border-radius: 100px;
          font-size: 16px; font-weight: 600; text-decoration: none;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 24px rgba(26,26,46,0.2);
        }
        .btn-primary:hover { background: #2d2d4e; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(26,26,46,0.25); }
        .btn-secondary {
          color: #1a1a2e; font-size: 15px; font-weight: 500; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          border-bottom: 1px solid transparent; transition: border-color 0.2s;
        }
        .btn-secondary:hover { border-color: #1a1a2e; }
        .hero-trust { margin-top: 48px; display: flex; align-items: center; gap: 14px; }
        .hero-trust-text { font-size: 13px; color: #888; }
        .hero-avatars { display: flex; }
        .hero-avatar {
          width: 32px; height: 32px; border-radius: 50%; border: 2px solid #f8f7f4;
          background: #1a1a2e; margin-left: -8px; display: flex; align-items: center;
          justify-content: center; font-size: 11px; font-weight: 700; color: #f8f7f4;
        }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-avatar.a2 { background: #185fa5; }
        .hero-avatar.a3 { background: #5dcaa5; }
        .hero-avatar.a4 { background: #d85a30; }

        /* HERO VISUAL */
        .hero-visual {
          position: absolute; right: 60px; top: 50%; transform: translateY(-50%);
          width: 420px; z-index: 1;
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
          font-size: 13px; font-weight: 600; white-space: nowrap;
        }
        .chip-1 { top: -16px; right: -16px; color: #0f6e56; }
        .chip-2 { bottom: -16px; left: -16px; color: #185fa5; }
        .chip-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* PROOF BAR */
        .proof-bar {
          background: #1a1a2e; padding: 22px 60px;
          display: flex; align-items: center; justify-content: center; gap: 48px;
          flex-wrap: wrap;
        }
        .proof-item { display: flex; align-items: center; gap: 10px; color: rgba(248,247,244,0.85); font-size: 14px; font-weight: 500; }
        .proof-icon { font-size: 18px; }

        /* SECTIONS */
        .section { padding: 100px 60px; }
        .section-label {
          font-size: 12px; font-weight: 700; color: #185fa5;
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .section-h2 {
          font-family: Georgia, serif; font-size: clamp(30px, 4vw, 46px);
          font-weight: 700; color: #1a1a2e; line-height: 1.2; margin-bottom: 16px;
        }
        .section-sub { font-size: 17px; color: #555; line-height: 1.75; max-width: 560px; }

        /* FEATURES GRID */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px; margin-top: 60px;
        }
        .feature-card {
          background: white; border-radius: 16px; padding: 32px;
          border: 1px solid rgba(26,26,46,0.07);
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,26,46,0.1); }
        .feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent, #185fa5);
        }
        .feature-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--accent-light, #e8f0fb);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 20px;
        }
        .feature-h3 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
        .feature-p { font-size: 14px; line-height: 1.75; color: #555; }
        .feature-tag {
          display: inline-block; margin-top: 14px;
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px;
          background: var(--accent-light, #e8f0fb); color: var(--accent, #185fa5);
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        /* HOW IT WORKS */
        .how-section { background: #1a1a2e; padding: 100px 60px; }
        .how-section .section-label { color: #f5c842; }
        .how-section .section-h2 { color: #f8f7f4; }
        .how-section .section-sub { color: rgba(248,247,244,0.7); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-top: 60px; }
        .step { position: relative; }
        .step-num {
          font-family: Georgia, serif; font-size: 56px; font-weight: 700;
          color: rgba(245,200,66,0.2); line-height: 1; margin-bottom: 14px;
        }
        .step-h3 { font-size: 17px; font-weight: 700; color: #f8f7f4; margin-bottom: 10px; }
        .step-p { font-size: 14px; line-height: 1.75; color: rgba(248,247,244,0.65); }
        .step-connector {
          position: absolute; top: 28px; right: -20px; width: 40px; height: 1px;
          background: rgba(245,200,66,0.25);
        }

        /* BUILT BY SPED */
        .sped-section {
          background: white; padding: 100px 60px;
          border-top: 1px solid rgba(26,26,46,0.06);
        }
        .sped-inner {
          max-width: 800px; margin: 0 auto; text-align: center;
        }
        .sped-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff8d6; border: 1px solid rgba(245,200,66,0.4);
          color: #c08000; padding: 6px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 700; margin-bottom: 28px;
          letter-spacing: 0.04em;
        }
        .sped-h2 {
          font-family: Georgia, serif; font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 700; color: #1a1a2e; line-height: 1.2; margin-bottom: 20px;
        }
        .sped-p { font-size: 17px; line-height: 1.85; color: #555; margin-bottom: 16px; }
        .sped-pills { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 36px; }
        .sped-pill {
          background: #f8f7f4; border: 1px solid rgba(26,26,46,0.1);
          color: #333; font-size: 14px; font-weight: 500;
          padding: 8px 18px; border-radius: 100px;
        }

        /* TESTIMONIALS */
        .testimonials-section { padding: 100px 60px; background: #f8f7f4; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 60px; }
        .testimonial-card {
          background: white; border-radius: 16px; padding: 32px;
          border: 1px solid rgba(26,26,46,0.07);
          display: flex; flex-direction: column; gap: 20px;
        }
        .testimonial-stars { color: #f0a500; font-size: 16px; letter-spacing: 2px; }
        .testimonial-quote {
          font-family: Georgia, serif; font-size: 15px; line-height: 1.8;
          color: #333; font-style: italic; flex: 1;
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: var(--av-bg, #e8f0fb);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: var(--av-color, #185fa5);
        }
        .testimonial-name { font-weight: 700; font-size: 14px; color: #1a1a2e; }
        .testimonial-role { font-size: 12px; color: #888; margin-top: 2px; }
        .testimonial-badge {
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px;
          background: #e8f0fb; color: #185fa5; margin-left: auto; white-space: nowrap;
        }

        /* STATS */
        .stats-section { background: #185fa5; padding: 80px 60px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; }
        .stat-num { font-family: Georgia, serif; font-size: 56px; font-weight: 700; color: white; line-height: 1; }
        .stat-label { font-size: 15px; color: rgba(255,255,255,0.85); margin-top: 10px; line-height: 1.5; }

        /* PRICING TEASER */
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
        .pricing-tier { font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .pricing-card.featured .pricing-tier { color: rgba(255,255,255,0.5); }
        .pricing-price { font-family: Georgia, serif; font-size: 48px; font-weight: 700; color: #1a1a2e; line-height: 1; }
        .pricing-card.featured .pricing-price { color: white; }
        .pricing-period { font-size: 15px; color: #888; margin-bottom: 24px; }
        .pricing-card.featured .pricing-period { color: rgba(255,255,255,0.5); }
        .pricing-features { list-style: none; margin-bottom: 32px; }
        .pricing-features li { font-size: 14px; color: #444; padding: 7px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 10px; }
        .pricing-card.featured .pricing-features li { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.1); }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-check { color: #185fa5; font-weight: 700; }
        .pricing-card.featured .pricing-check { color: #f5c842; }
        .pricing-lock { color: #ccc; }
        .pricing-btn {
          display: block; text-align: center; padding: 14px; border-radius: 100px;
          font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s;
          border: 2px solid #1a1a2e; color: #1a1a2e;
        }
        .pricing-btn:hover { background: #1a1a2e; color: white; }
        .pricing-btn.featured { background: #f5c842; border-color: #f5c842; color: #1a1a2e; }
        .pricing-btn.featured:hover { background: #e5b832; border-color: #e5b832; }

        /* CTA */
        .cta-section {
          padding: 120px 60px; text-align: center;
          background: white;
        }
        .cta-section .section-h2 { margin: 0 auto 16px; max-width: 600px; }
        .cta-section .section-sub { margin: 0 auto 40px; text-align: center; }
        .cta-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .btn-outline {
          border: 2px solid #1a1a2e; color: #1a1a2e;
          padding: 14px 32px; border-radius: 100px;
          font-size: 15px; font-weight: 600; text-decoration: none;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: #1a1a2e; color: #f8f7f4; }
        .cta-note { margin-top: 20px; font-size: 13px; color: #aaa; }

        /* FOOTER */
        .footer {
          background: #1a1a2e; padding: 60px;
          color: rgba(248,247,244,0.5);
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;
        }
        .footer-logo { font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #f8f7f4; }
        .footer-logo span { color: #f5c842; }
        .footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
        .footer-link { text-decoration: none; color: rgba(248,247,244,0.5); font-size: 14px; transition: color 0.2s; }
        .footer-link:hover { color: #f8f7f4; }
        .footer-copy { font-size: 13px; }
        .disclaimer {
          background: #111; padding: 16px 60px; text-align: center;
          font-size: 12px; color: rgba(248,247,244,0.35); line-height: 1.6;
        }

        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { padding: 100px 24px 60px; min-height: auto; }
          .hero-visual { display: none; }
          .section, .how-section, .testimonials-section, .stats-section, .cta-section, .sped-section, .pricing-section { padding: 60px 24px; }
          .proof-bar { padding: 20px 24px; gap: 24px; }
          .footer { padding: 40px 24px; flex-direction: column; align-items: flex-start; }
          .disclaimer { padding: 16px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'8px'}}>
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
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
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
            <Link href="/auth/signup" className="btn-primary">
              Start free →
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See how it works ↓
            </a>
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

        {/* FLOATING IEP CARD */}
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
                <div className="iep-goal-dot" style={{background: '#185fa5'}} />
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
                <div className="iep-section-label" style={{marginTop: '16px'}}>Progress — Q2 Report</div>
                <div className="iep-progress-bar-bg"><div className="iep-progress-bar" /></div>
                <div className="iep-progress-label"><span>3 domains · 6 goals</span><span>On Track ✓</span></div>
              </div>
            </div>
            <div className="floating-chip chip-2">
              <div className="chip-dot" style={{background: '#185fa5'}} />
              IDEA 2004 compliant draft
            </div>
          </div>
        </div>
      </section>

      {/* PROOF BAR */}
      <div className="proof-bar">
        <div className="proof-item"><span className="proof-icon">⚖️</span>IDEA 2004 Aligned</div>
        <div className="proof-item"><span className="proof-icon">🔒</span>Secure & FERPA-Aware</div>
        <div className="proof-item"><span className="proof-icon">🧠</span>Powered by Claude AI</div>
        <div className="proof-item"><span className="proof-icon">⚡</span>Draft in Under 5 Minutes</div>
        <div className="proof-item"><span className="proof-icon">💡</span>Built by SPED Educators</div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-label">What You Get</div>
        <h2 className="section-h2">Everything a special ed teacher needs in one place.</h2>
        <p className="section-sub">From IEP generation to year-round progress monitoring — SmartIEP supports the full IEP lifecycle, not just the first draft.</p>

        <div className="features-grid">
          {[
            {
              icon: '✨', title: 'AI-Generated IEP Drafts',
              desc: 'Enter your assessment data and receive a complete IEP in minutes — PLAAFP narrative, measurable annual goals, services, accommodations, LRE statement, and progress monitoring plan.',
              tag: 'Core Feature',
              accent: '#185fa5', accentLight: '#e8f0fb'
            },
            {
              icon: '🎯', title: 'SMART Goals for Every Domain',
              desc: 'Goals are generated with observable behaviors, measurable criteria, conditions, and timeframes. Short-term benchmarks and success criteria included for each goal.',
              tag: 'IDEA Compliant',
              accent: '#5dcaa5', accentLight: '#e1f5ee'
            },
            {
              icon: '📈', title: 'Progress Monitoring',
              desc: 'Log structured progress notes per goal throughout the year. Track On Track / Emerging / Not Yet / Mastered status with a full data timeline per domain.',
              tag: 'Pro Feature',
              accent: '#7f77dd', accentLight: '#eeedfe'
            },
            {
              icon: '📊', title: 'AI Progress Reports',
              desc: 'Generate formal quarterly progress reports with one click. Claude synthesizes your progress notes into a parent-ready narrative with data references and goal recommendations.',
              tag: 'Pro Feature',
              accent: '#d85a30', accentLight: '#faeee8'
            },
            {
              icon: '⬇️', title: 'Data Export for Any System',
              desc: 'Export IEP and progress data in formats compatible with Frontline, IEP Direct, Skyward, PowerSchool, SPED-i, Edio, or as a universal CSV.',
              tag: 'Pro Feature',
              accent: '#0f6e56', accentLight: '#e1f5ee'
            },
            {
              icon: '✏️', title: 'Inline Editing & Version History',
              desc: 'Click any section to edit it directly. Every regeneration auto-saves the previous version — so you never lose a draft and can compare across the school year.',
              tag: 'Core Feature',
              accent: '#993c1d', accentLight: '#faece7'
            },
            {
              icon: '📦', title: 'Student Roster Management',
              desc: 'Manage your full caseload in one place. Archive students at year end instead of deleting — their IEP records and progress history are always preserved.',
              tag: 'Core Feature',
              accent: '#185fa5', accentLight: '#e8f0fb'
            },
            {
              icon: '🔒', title: 'Secure & Private by Design',
              desc: 'Your students are completely private. Row-level database security, HTTPS encryption, no data sharing, and no use of your data to train AI models.',
              tag: 'FERPA-Aware',
              accent: '#374151', accentLight: '#f3f4f6'
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{'--accent': f.accent, '--accent-light': f.accentLight} as React.CSSProperties}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-h3">{f.title}</h3>
              <p className="feature-p">{f.desc}</p>
              <span className="feature-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-label">How It Works</div>
        <h2 className="section-h2">From assessment notes to complete IEP — in 5 steps.</h2>
        <p className="section-sub">Designed around how special education teachers actually work, not how software engineers think they work.</p>
        <div className="steps">
          {[
            { num: '01', title: 'Add your student', desc: 'Enter name, grade, disability category, parent contacts, and meeting dates. Takes about 2 minutes.' },
            { num: '02', title: 'Describe present levels', desc: 'Paste your assessment notes across up to 5 domains. The more specific your data, the stronger the goals Claude generates.' },
            { num: '03', title: 'Add context & priorities', desc: 'Share student strengths, areas of concern, family priorities, and current services. This is what makes the IEP feel truly individualized.' },
            { num: '04', title: 'Generate & refine', desc: 'Claude drafts a complete IDEA-compliant IEP in under 90 seconds. Click to edit any section, then export or print for your team review.' },
            { num: '05', title: 'Monitor & report progress', desc: 'Log progress notes throughout the year. Generate AI-powered quarterly reports. Export data to your district\'s system when required.' },
          ].map((s, i) => (
            <div key={i} className="step">
              <div className="step-num">{s.num}</div>
              <h3 className="step-h3">{s.title}</h3>
              <p className="step-p">{s.desc}</p>
              {i < 4 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* BUILT BY SPED */}
      <section className="sped-section">
        <div className="sped-inner">
          <div className="sped-badge">💡 Built by the SPED Community</div>
          <h2 className="sped-h2">We know what it feels like to miss a weekend because of IEPs.</h2>
          <p className="sped-p">
            SmartIEP wasn't built by a Silicon Valley startup that stumbled onto education. It was built by someone who has sat where you sit — writing IEPs at 10pm on a Sunday, managing a caseload of 15 students, and wondering why the tools available to teachers are so far behind.
          </p>
          <p className="sped-p">
            Every feature in SmartIEP exists because a real special education teacher needed it. The 5-domain present levels structure, the SMART goal format, the quarterly progress report, the export formats for Frontline and Skyward — none of that came from a product manager's roadmap. It came from experience in the field.
          </p>
          <div className="sped-pills">
            {['Built by a SPED educator', 'IDEA 2004 compliant', 'Designed for real caseloads', 'Respects your professional judgment', 'Supports all disability categories', 'Early Intervention through Transition'].map((p, i) => (
              <span key={i} className="sped-pill">✓ {p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-label">Teacher Reviews</div>
        <h2 className="section-h2">What educators are saying.</h2>
        <div className="testimonials-grid">
          {[
            { quote: "I used to spend my entire Sunday writing IEPs. With SmartIEP, I have a solid draft done before lunch on Friday. The goals it generates are specific, measurable, and actually match what I wrote in the present levels.", name: 'Sarah L.', role: 'Special Education Teacher · K-2', initials: 'SL', bg: '#e8f0fb', color: '#185fa5', badge: 'Verified Teacher' },
            { quote: "The progress monitoring tab changed how I track data. I used to keep everything in separate spreadsheets. Now I log notes directly against each goal and generate a quarterly report with one click.", name: 'Marcus R.', role: 'Autism Support Teacher · Grades 3-5', initials: 'MR', bg: '#e1f5ee', color: '#0f6e56', badge: 'Verified Teacher' },
            { quote: "I was skeptical about AI-generated IEPs, but the quality genuinely surprised me. It understood the nuance between the domains and didn't just repeat the same goal five times. I still review everything, but it cuts my time in half.", name: 'Jennifer P.', role: 'Resource Room Teacher · Middle School', initials: 'JP', bg: '#faeee8', color: '#993c1d', badge: 'Verified Teacher' },
            { quote: "The data export feature is what sold me. Our district uses Frontline and having a properly formatted CSV instead of manual re-entry saves me an hour per student at reporting time.", name: 'Kevin T.', role: 'Special Ed Coordinator · Elementary', initials: 'KT', bg: '#eeedfe', color: '#534ab7', badge: 'Administrator' },
            { quote: "Our district has been pushing for better PLAAFP narratives. SmartIEP generates them with the kind of specific, data-driven language our director wants to see. It's made a huge difference in our compliance reviews.", name: 'Diana M.', role: 'Special Education Director', initials: 'DM', bg: '#e8f0fb', color: '#185fa5', badge: 'District Leader' },
            { quote: "I work with students who have multiple disabilities and complex profiles. When you give it detailed present level data, it does a remarkable job capturing the nuance across all five domains.", name: 'Rosa C.', role: 'Multiple Disabilities Specialist', initials: 'RC', bg: '#e1f5ee', color: '#085041', badge: 'Verified Teacher' },
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
        <p className="section-sub" style={{margin: '0 auto', textAlign: 'center'}}>No credit card required to get started. Free tier includes everything you need to try SmartIEP with your first students.</p>

        <div className="pricing-cards">
          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-tier">Free</div>
            <div className="pricing-price">$0</div>
            <div className="pricing-period">forever</div>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> 3 IEP generations</li>
              <li><span className="pricing-check">✓</span> Up to 3 students</li>
              <li><span className="pricing-check">✓</span> Inline editing</li>
              <li><span className="pricing-check">✓</span> Print & HTML export</li>
              <li><span className="pricing-check">✓</span> Version history</li>
              <li><span className="pricing-lock">🔒</span> Progress monitoring</li>
              <li><span className="pricing-lock">🔒</span> AI progress reports</li>
              <li><span className="pricing-lock">🔒</span> Data export (CSV)</li>
            </ul>
            <Link href="/auth/signup" className="pricing-btn">Get started free</Link>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-tier">Pro</div>
            <div className="pricing-price" style={{color: 'white'}}>$12</div>
            <div className="pricing-period">per month · or $99/year</div>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> Unlimited IEP generations</li>
              <li><span className="pricing-check">✓</span> Unlimited students</li>
              <li><span className="pricing-check">✓</span> Inline editing</li>
              <li><span className="pricing-check">✓</span> Print & HTML export</li>
              <li><span className="pricing-check">✓</span> Version history</li>
              <li><span className="pricing-check">✓</span> Progress monitoring</li>
              <li><span className="pricing-check">✓</span> AI progress reports</li>
              <li><span className="pricing-check">✓</span> Data export (7 systems)</li>
            </ul>
            <Link href="/auth/signup" className="pricing-btn featured">Start with Pro</Link>
          </div>
        </div>

        <p style={{textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#888'}}>
          Questions about school or district pricing? <a href="mailto:hello@smartiep.co" style={{color: '#185fa5'}}>Contact us →</a>
        </p>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-label">Get Started Today</div>
        <h2 className="section-h2">Your students deserve a teacher who isn't buried in paperwork.</h2>
        <p className="section-sub">Create your free account and generate your first IEP draft in under 5 minutes. No credit card required.</p>
        <div className="cta-actions">
          <Link href="/auth/signup" className="btn-primary">Create free account →</Link>
          <Link href="/auth/login" className="btn-outline">Sign in</Link>
        </div>
        <p className="cta-note">⚠️ All AI-generated IEP content must be reviewed by qualified special education professionals before use.</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <span style={{fontSize:'20px'}}>💡</span>
            <span className="footer-logo">SmartIEP<span>.co</span></span>
          </div>
          <div style={{marginTop: '4px', fontSize: '13px'}}>AI-assisted IEP planning for special educators.</div>
        </div>
        <div className="footer-links">
          <Link href="/auth/login" className="footer-link">Sign In</Link>
          <Link href="/auth/signup" className="footer-link">Create Account</Link>
          <a href="mailto:hello@smartiep.co" className="footer-link">Contact</a>
          <Link href="/legal/privacy" className="footer-link">Privacy</Link>
          <Link href="/legal/terms" className="footer-link">Terms</Link>
          <Link href="/legal/ferpa" className="footer-link">FERPA</Link>
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} SmartIEP. All rights reserved.</div>
      </footer>
      <div className="disclaimer">
        SmartIEP is an AI-assisted drafting tool. All generated content must be reviewed and approved by qualified special education professionals before implementation. SmartIEP does not provide legal, clinical, or educational advice.
      </div>
    </div>
  );
}
