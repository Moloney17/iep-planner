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
          background: rgba(248, 247, 244, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(26,26,46,0.08);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon {
          width: 36px; height: 36px; background: #1a1a2e; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .nav-logo-text { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #1a1a2e; }
        .nav-logo-tld { color: #4a90d9; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { text-decoration: none; color: #555; font-size: 15px; font-weight: 400; transition: color 0.2s; }
        .nav-link:hover { color: #1a1a2e; }
        .nav-cta {
          background: #1a1a2e; color: #f8f7f4; padding: 10px 24px;
          border-radius: 100px; font-size: 14px; font-weight: 500;
          text-decoration: none; transition: all 0.2s;
        }
        .nav-cta:hover { background: #2d2d4e; transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 60px 80px;
          position: relative;
          overflow: hidden;
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
        .hero-content { position: relative; z-index: 1; max-width: 680px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(74,144,217,0.1); border: 1px solid rgba(74,144,217,0.2);
          color: #2a6fad; padding: 6px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 500; margin-bottom: 28px;
        }
        .hero-badge-dot { width: 6px; height: 6px; background: #4a90d9; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hero-h1 {
          font-family: 'Lora', serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 700; line-height: 1.1;
          color: #1a1a2e; margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero-h1 em { font-style: italic; color: #4a90d9; }
        .hero-sub {
          font-size: 18px; line-height: 1.7; color: #555;
          margin-bottom: 40px; font-weight: 300; max-width: 520px;
        }
        .hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-primary {
          background: #1a1a2e; color: #f8f7f4;
          padding: 16px 36px; border-radius: 100px;
          font-size: 16px; font-weight: 500; text-decoration: none;
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
        .hero-trust { margin-top: 56px; display: flex; align-items: center; gap: 16px; }
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
          font-size: 15px; font-weight: 700; color: #2a6fad;
        }
        .iep-card-name { font-weight: 600; font-size: 15px; color: #1a1a2e; }
        .iep-card-sub { font-size: 12px; color: #888; margin-top: 2px; }
        .iep-card-badge {
          margin-left: auto; background: #eaf6f1; color: #0f6e56;
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
        }
        .iep-section-label { font-size: 11px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .iep-goal {
          background: #f8f7f4; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .iep-goal-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
        .iep-goal-text { font-size: 13px; line-height: 1.5; color: #333; }
        .iep-progress { margin-top: 16px; }
        .iep-progress-bar-bg { height: 6px; background: #f0eeeb; border-radius: 100px; margin-top: 6px; }
        .iep-progress-bar { height: 6px; background: #4a90d9; border-radius: 100px; width: 72%; }
        .iep-progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-top: 4px; }
        .floating-chip {
          position: absolute; background: white; border-radius: 100px; padding: 8px 16px;
          box-shadow: 0 4px 20px rgba(26,26,46,0.1); display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 500; white-space: nowrap;
        }
        .chip-1 { top: -16px; right: -16px; color: #0f6e56; }
        .chip-2 { bottom: -16px; left: -16px; color: #185fa5; }
        .chip-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* SOCIAL PROOF BAR */
        .proof-bar {
          background: #1a1a2e; padding: 20px 60px;
          display: flex; align-items: center; justify-content: center; gap: 60px;
          flex-wrap: wrap;
        }
        .proof-item { display: flex; align-items: center; gap: 10px; color: rgba(248,247,244,0.7); font-size: 14px; }
        .proof-icon { font-size: 18px; }

        /* FEATURES */
        .section { padding: 100px 60px; }
        .section-label {
          font-size: 12px; font-weight: 600; color: #4a90d9;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .section-h2 {
          font-family: 'Lora', serif; font-size: clamp(32px, 4vw, 48px);
          font-weight: 700; color: #1a1a2e; line-height: 1.2; margin-bottom: 16px;
        }
        .section-sub { font-size: 17px; color: #666; line-height: 1.7; max-width: 560px; font-weight: 300; }

        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px; margin-top: 60px;
        }
        .feature-card {
          background: white; border-radius: 16px; padding: 32px;
          border: 1px solid rgba(26,26,46,0.06);
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,26,46,0.1); }
        .feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent, #4a90d9);
        }
        .feature-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--accent-light, #e8f0fb);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 20px;
        }
        .feature-h3 { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 10px; }
        .feature-p { font-size: 14px; line-height: 1.7; color: #666; }

        /* HOW IT WORKS */
        .how-section { background: #1a1a2e; padding: 100px 60px; }
        .how-section .section-label { color: #5dcaa5; }
        .how-section .section-h2 { color: #f8f7f4; }
        .how-section .section-sub { color: rgba(248,247,244,0.6); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-top: 60px; }
        .step { position: relative; }
        .step-num {
          font-family: 'Lora', serif; font-size: 64px; font-weight: 700;
          color: rgba(74,144,217,0.15); line-height: 1; margin-bottom: 16px;
        }
        .step-h3 { font-size: 17px; font-weight: 600; color: #f8f7f4; margin-bottom: 10px; }
        .step-p { font-size: 14px; line-height: 1.7; color: rgba(248,247,244,0.55); }
        .step-connector {
          position: absolute; top: 32px; right: -20px; width: 40px; height: 1px;
          background: rgba(74,144,217,0.3);
        }

        /* TESTIMONIALS */
        .testimonials-section { padding: 100px 60px; background: #f8f7f4; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 60px; }
        .testimonial-card {
          background: white; border-radius: 16px; padding: 32px;
          border: 1px solid rgba(26,26,46,0.06);
          display: flex; flex-direction: column; gap: 20px;
        }
        .testimonial-stars { color: #f0a500; font-size: 16px; letter-spacing: 2px; }
        .testimonial-quote {
          font-family: 'Lora', serif; font-size: 16px; line-height: 1.7;
          color: #333; font-style: italic; flex: 1;
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--av-bg, #e8f0fb);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: var(--av-color, #2a6fad);
        }
        .testimonial-name { font-weight: 600; font-size: 14px; color: #1a1a2e; }
        .testimonial-role { font-size: 12px; color: #888; margin-top: 2px; }
        .testimonial-badge {
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px;
          background: #e8f0fb; color: #2a6fad; margin-left: auto;
        }

        /* STATS */
        .stats-section { background: #4a90d9; padding: 80px 60px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; }
        .stat-num { font-family: 'Lora', serif; font-size: 56px; font-weight: 700; color: white; line-height: 1; }
        .stat-label { font-size: 15px; color: rgba(255,255,255,0.75); margin-top: 8px; }

        /* CTA */
        .cta-section {
          padding: 120px 60px; text-align: center;
          background: white;
        }
        .cta-section .section-h2 { margin: 0 auto 16px; max-width: 600px; }
        .cta-section .section-sub { margin: 0 auto 40px; }
        .cta-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .btn-outline {
          border: 2px solid #1a1a2e; color: #1a1a2e;
          padding: 14px 32px; border-radius: 100px;
          font-size: 15px; font-weight: 500; text-decoration: none;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: #1a1a2e; color: #f8f7f4; }
        .cta-note { margin-top: 20px; font-size: 13px; color: #aaa; }

        /* FOOTER */
        .footer {
          background: #1a1a2e; padding: 60px; color: rgba(248,247,244,0.5);
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;
        }
        .footer-logo { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #f8f7f4; }
        .footer-logo span { color: #4a90d9; }
        .footer-links { display: flex; gap: 32px; }
        .footer-link { text-decoration: none; color: rgba(248,247,244,0.5); font-size: 14px; transition: color 0.2s; }
        .footer-link:hover { color: #f8f7f4; }
        .footer-copy { font-size: 13px; }
        .disclaimer {
          background: #111; padding: 16px 60px; text-align: center;
          font-size: 12px; color: rgba(248,247,244,0.3); line-height: 1.6;
        }

        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { padding: 100px 24px 60px; min-height: auto; }
          .hero-visual { display: none; }
          .section, .how-section, .testimonials-section, .stats-section, .cta-section { padding: 60px 24px; }
          .proof-bar { padding: 20px 24px; gap: 24px; }
          .footer { padding: 40px 24px; flex-direction: column; align-items: flex-start; }
          .disclaimer { padding: 16px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">📋</div>
          <span className="nav-logo-text">SmartIEP<span className="nav-logo-tld">.co</span></span>
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
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
            IDEA 2004 Compliant · AI-Assisted Planning
          </div>
          <h1 className="hero-h1">
            IEP planning that<br />takes <em>minutes,</em><br />not hours.
          </h1>
          <p className="hero-sub">
            SmartIEP helps special education teachers generate comprehensive, legally compliant IEP drafts in under 5 minutes — so you can spend more time with your students.
          </p>
          <div className="hero-actions">
            <Link href="/auth/signup" className="btn-primary">
              Get started free →
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
            <span className="hero-trust-text">Trusted by special education teachers</span>
          </div>
        </div>

        {/* FLOATING IEP CARD */}
        <div className="hero-visual">
          <div style={{position: 'relative'}}>
            <div className="floating-chip chip-1">
              <div className="chip-dot" style={{background: '#5dcaa5'}} />
              IEP Generated in 47 seconds
            </div>
            <div className="iep-card">
              <div className="iep-card-header">
                <div className="iep-card-avatar">JM</div>
                <div>
                  <div className="iep-card-name">Jamie Mitchell</div>
                  <div className="iep-card-sub">Pre-K · Autism Spectrum Disorder</div>
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
                <div className="iep-goal-dot" style={{background: '#d85a30'}} />
                <div className="iep-goal-text">Jamie will independently complete 4-step self-care routines with visual supports.</div>
              </div>
              <div className="iep-progress">
                <div className="iep-section-label" style={{marginTop: '16px'}}>Progress Monitoring</div>
                <div className="iep-progress-bar-bg"><div className="iep-progress-bar" /></div>
                <div className="iep-progress-label"><span>3 domains · 6 goals</span><span>72% complete</span></div>
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
        <div className="proof-item"><span className="proof-icon">⚖️</span>IDEA 2004 Aligned</div>
        <div className="proof-item"><span className="proof-icon">🔒</span>Secure & Private</div>
        <div className="proof-item"><span className="proof-icon">🧠</span>Powered by Claude AI</div>
        <div className="proof-item"><span className="proof-icon">⚡</span>Draft in Under 5 Minutes</div>
        <div className="proof-item"><span className="proof-icon">✏️</span>Fully Editable Output</div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-label">Why SmartIEP</div>
        <h2 className="section-h2">Everything you need to write better IEPs, faster.</h2>
        <p className="section-sub">Built specifically for special education teachers, by people who understand the weight of the paperwork.</p>

        <div className="features-grid">
          {[
            { icon: '✨', title: 'AI-Generated Drafts', desc: 'Enter your student\'s assessment data and get a complete IEP draft — PLAAFP, annual goals, services, accommodations, and progress monitoring — in under 5 minutes.', accent: '#4a90d9', accentLight: '#e8f0fb' },
            { icon: '🎯', title: 'Measurable Goals', desc: 'Every goal follows SMART criteria with short-term benchmarks, success criteria, and timeframes built in. No more staring at a blank page wondering how to phrase it.', accent: '#5dcaa5', accentLight: '#e1f5ee' },
            { icon: '✏️', title: 'Fully Editable', desc: 'Click any section of the generated IEP to edit it directly. The AI gives you a strong starting point — you bring the professional expertise to finalize it.', accent: '#d85a30', accentLight: '#faeee8' },
            { icon: '📚', title: 'Version History', desc: 'Every time you regenerate an IEP, the previous version is saved automatically. Easily compare drafts and track how goals evolve across the school year.', accent: '#7f77dd', accentLight: '#eeedfe' },
            { icon: '⬇️', title: 'Export & Print', desc: 'Download a formatted IEP document ready for team review, or print directly from the browser. Includes signature lines for all required IEP team members.', accent: '#0f6e56', accentLight: '#e1f5ee' },
            { icon: '🔒', title: 'Secure by Design', desc: 'Each teacher\'s students are completely private. Your data is never shared, never used to train AI models, and protected by Supabase\'s enterprise-grade security.', accent: '#993c1d', accentLight: '#faece7' },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{'--accent': f.accent, '--accent-light': f.accentLight} as React.CSSProperties}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-h3">{f.title}</h3>
              <p className="feature-p">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-label">How It Works</div>
        <h2 className="section-h2">From assessment notes to complete IEP draft.</h2>
        <p className="section-sub">A simple four-step process designed around how teachers actually work.</p>
        <div className="steps">
          {[
            { num: '01', title: 'Enter student info', desc: 'Add basic details — name, grade, disability category, parent contacts, and meeting dates.' },
            { num: '02', title: 'Describe present levels', desc: 'Paste in your assessment notes across cognitive, communication, social-emotional, adaptive, and motor domains.' },
            { num: '03', title: 'Add context', desc: 'Share student strengths, areas of concern, and family priorities. The more detail, the more personalized the output.' },
            { num: '04', title: 'Generate & refine', desc: 'Claude drafts a complete IEP in seconds. Click to edit any section, then export or print when ready for your team.' },
          ].map((s, i) => (
            <div key={i} className="step">
              <div className="step-num">{s.num}</div>
              <h3 className="step-h3">{s.title}</h3>
              <p className="step-p">{s.desc}</p>
              {i < 3 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-label">Teacher Reviews</div>
        <h2 className="section-h2">What educators are saying.</h2>
        <p className="section-sub">Placeholder testimonials — real reviews from your early users will go here.</p>
        <div className="testimonials-grid">
          {[
            { quote: "I used to spend my entire Sunday writing IEPs. With SmartIEP, I have a solid draft done before lunch on Friday. The goals it generates are specific, measurable, and actually match what I wrote in the present levels.", name: 'Sarah L.', role: 'Special Education Teacher · K-2', initials: 'SL', bg: '#e8f0fb', color: '#2a6fad', badge: 'Verified Teacher' },
            { quote: "As a special ed coordinator managing a team of 12 teachers, this tool has been transformational. New teachers especially — they no longer feel paralyzed by the blank IEP form. The AI gives them a framework they can build on.", name: 'Marcus R.', role: 'Special Ed Coordinator · Elementary', initials: 'MR', bg: '#e1f5ee', color: '#0f6e56', badge: 'Administrator' },
            { quote: "I was skeptical about AI-generated IEPs, but the quality genuinely surprised me. It understood the nuance between the domains and didn't just repeat the same goal five times. I still review everything, but it cuts my time in half.", name: 'Jennifer P.', role: 'Autism Support Teacher · Grades 3-5', initials: 'JP', bg: '#faeee8', color: '#993c1d', badge: 'Verified Teacher' },
            { quote: "The version history feature alone is worth it. I can show parents how their child's goals have evolved across the year. It makes those annual review meetings so much more meaningful.", name: 'Kevin T.', role: 'Resource Room Teacher · Middle School', initials: 'KT', bg: '#eeedfe', color: '#534ab7', badge: 'Verified Teacher' },
            { quote: "Our district has been pushing for better PLAAFP narratives. SmartIEP generates them with the kind of specific, data-driven language that our director wants to see. It's made a huge difference in our compliance reviews.", name: 'Diana M.', role: 'Special Education Director', initials: 'DM', bg: '#e8f0fb', color: '#185fa5', badge: 'District Leader' },
            { quote: "I work with students who have multiple disabilities and complex profiles. I was worried the AI wouldn't handle that nuance well — but it actually does a remarkable job when you give it detailed present level data.", name: 'Rosa C.', role: 'Multiple Disabilities Specialist', initials: 'RC', bg: '#e1f5ee', color: '#085041', badge: 'Verified Teacher' },
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
            { num: '< 5', label: 'Minutes to generate a complete IEP draft' },
            { num: '5+', label: 'Developmental domains covered per student' },
            { num: '100%', label: 'IDEA 2004 aligned goal structure' },
            { num: '∞', label: 'Version history — never lose a draft' },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
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
          <div className="footer-logo">SmartIEP<span>.co</span></div>
          <div style={{marginTop: '8px', fontSize: '13px'}}>AI-assisted IEP planning for special educators.</div>
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
        SmartIEP is an AI-assisted drafting tool. All generated content must be reviewed and approved by qualified special education professionals. SmartIEP does not provide legal, clinical, or educational advice.
      </div>
    </div>
  );
}
