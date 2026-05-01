import Link from 'next/link';

export default function CookiePolicy() {
  const updated = 'May 1, 2025';
  return (
    <div className="legal-page">
      <style>{`
        .legal-page { max-width: 760px; margin: 0 auto; padding: 60px 24px; font-family: 'Georgia', serif; color: #1a1a2e; }
        .legal-back { display: inline-flex; align-items: center; gap: 6px; color: #4a90d9; text-decoration: none; font-family: sans-serif; font-size: 14px; margin-bottom: 40px; }
        .legal-back:hover { text-decoration: underline; }
        .legal-badge { display: inline-block; background: #e8f0fb; color: #2a6fad; font-family: sans-serif; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-bottom: 16px; }
        .legal-h1 { font-size: 36px; font-weight: 700; line-height: 1.2; margin-bottom: 8px; }
        .legal-updated { font-family: sans-serif; font-size: 13px; color: #888; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
        .legal-section { margin-bottom: 40px; }
        .legal-h2 { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #1a1a2e; }
        .legal-p { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 16px; }
        .legal-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: sans-serif; font-size: 14px; }
        .legal-table th { text-align: left; padding: 10px 14px; background: #f8f7f4; font-weight: 600; color: #1a1a2e; border-bottom: 2px solid #eee; }
        .legal-table td { padding: 10px 14px; color: #444; border-bottom: 1px solid #f0eeeb; vertical-align: top; line-height: 1.6; }
        .legal-nav { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-family: sans-serif; }
        .legal-nav a { font-size: 13px; color: #4a90d9; text-decoration: none; }
        .legal-nav a:hover { text-decoration: underline; }
      `}</style>

      <Link href="/landing" className="legal-back">← Back to SmartIEP</Link>

      <div className="legal-badge">Cookie Policy</div>
      <h1 className="legal-h1">Cookie Policy</h1>
      <p className="legal-updated">Last updated: {updated}</p>

      <div className="legal-section">
        <h2 className="legal-h2">What are cookies?</h2>
        <p className="legal-p">Cookies are small text files stored on your device by your browser. They help websites remember your session and preferences. SmartIEP uses only essential cookies — we do not use advertising, tracking, or analytics cookies.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">Cookies we use</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>sb-access-token</td>
              <td>Keeps you signed in to your SmartIEP account</td>
              <td>1 hour</td>
              <td>Essential</td>
            </tr>
            <tr>
              <td>sb-refresh-token</td>
              <td>Refreshes your session automatically so you stay logged in</td>
              <td>60 days</td>
              <td>Essential</td>
            </tr>
            <tr>
              <td>sb-auth-token</td>
              <td>Secures your authentication session</td>
              <td>Session</td>
              <td>Essential</td>
            </tr>
          </tbody>
        </table>
        <p className="legal-p">These cookies are set by Supabase, our authentication provider. They are strictly necessary for the Service to function — without them, you would be unable to log in or maintain a session.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">What we don't use</h2>
        <p className="legal-p">SmartIEP does not use:</p>
        <p className="legal-p" style={{paddingLeft: '20px'}}>
          — Advertising or targeting cookies<br/>
          — Analytics or tracking cookies (no Google Analytics, Hotjar, etc.)<br/>
          — Social media cookies<br/>
          — Third-party tracking pixels
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">Managing cookies</h2>
        <p className="legal-p">You can control cookies through your browser settings. Note that blocking essential cookies will prevent you from signing in to SmartIEP. Most browsers allow you to view, delete, or block cookies through their settings or preferences menu.</p>
      </div>

      <div className="legal-nav">
        <Link href="/legal/privacy">Privacy Policy</Link>
        <Link href="/legal/terms">Terms of Service</Link>
        <Link href="/legal/ferpa">FERPA Notice</Link>
      </div>
    </div>
  );
}
