import Link from 'next/link';

export default function FerpaNotice() {
  const updated = 'May 1, 2025';
  return (
    <div className="legal-page">
      <style>{`
        .legal-page { max-width: 760px; margin: 0 auto; padding: 60px 24px; font-family: 'Georgia', serif; color: #1a1a2e; }
        .legal-back { display: inline-flex; align-items: center; gap: 6px; color: #4a90d9; text-decoration: none; font-family: sans-serif; font-size: 14px; margin-bottom: 40px; }
        .legal-back:hover { text-decoration: underline; }
        .legal-badge { display: inline-block; background: #faeee8; color: #993c1d; font-family: sans-serif; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-bottom: 16px; }
        .legal-h1 { font-size: 36px; font-weight: 700; line-height: 1.2; margin-bottom: 8px; }
        .legal-updated { font-family: sans-serif; font-size: 13px; color: #888; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
        .legal-section { margin-bottom: 40px; }
        .legal-h2 { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #1a1a2e; }
        .legal-p { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 16px; }
        .legal-ul { padding-left: 24px; margin-bottom: 16px; }
        .legal-ul li { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 8px; }
        .legal-highlight { background: #fff8e8; border-left: 3px solid #f0a500; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
        .legal-highlight p { margin: 0; font-size: 15px; color: #7a5200; }
        .legal-tip { background: #f0f7ff; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; font-family: sans-serif; }
        .legal-tip h3 { font-size: 15px; font-weight: 600; color: #185fa5; margin-bottom: 8px; }
        .legal-tip p { font-size: 14px; color: #2a6fad; margin: 0; line-height: 1.6; }
        .legal-nav { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-family: sans-serif; }
        .legal-nav a { font-size: 13px; color: #4a90d9; text-decoration: none; }
        .legal-nav a:hover { text-decoration: underline; }
      `}</style>

      <Link href="/landing" className="legal-back">← Back to SmartIEP</Link>

      <div className="legal-badge">FERPA Notice</div>
      <h1 className="legal-h1">FERPA & Student Data Notice</h1>
      <p className="legal-updated">Last updated: {updated}</p>

      <div className="legal-highlight">
        <p><strong>Important:</strong> SmartIEP is a tool used by educators, not an educational institution. You — as the educator — are responsible for ensuring your use of this tool complies with FERPA and your school or district's data privacy policies.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">What is FERPA?</h2>
        <p className="legal-p">The Family Educational Rights and Privacy Act (FERPA) is a federal law that protects the privacy of student education records. It applies to educational agencies and institutions that receive federal funding. FERPA gives parents (and eligible students) the right to access, review, and request corrections to education records.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">SmartIEP's role</h2>
        <p className="legal-p">SmartIEP is a software tool — not an educational agency or institution. We do not maintain education records on behalf of schools or districts. We store the student information you enter for the purpose of generating and saving IEP drafts for your use.</p>
        <p className="legal-p">Under FERPA, when a school or district uses a third-party service provider to perform functions that would otherwise be performed by school officials, that provider may have access to education records without prior consent under the "school official" exception (34 CFR § 99.31(a)(1)(i)(B)). This typically requires a formal agreement.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">Your responsibilities as an educator</h2>
        <ul className="legal-ul">
          <li>Check whether your school or district has a policy on using third-party tools with student data</li>
          <li>Obtain any necessary approvals before entering identifiable student information into SmartIEP</li>
          <li>Consider whether a Data Processing Agreement (DPA) between your district and SmartIEP is required</li>
          <li>Ensure parents have been appropriately notified of your school's use of technology tools</li>
        </ul>
      </div>

      <div className="legal-tip">
        <h3>💡 Best practice recommendation</h3>
        <p>To minimize privacy risk, consider using student initials rather than full names, and avoid entering more personal information than necessary to generate a useful IEP draft. The AI generates equally useful output with partial information.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">How we protect student data</h2>
        <ul className="legal-ul">
          <li>Student data is never shared with third parties for marketing purposes</li>
          <li>Student data is never used to train AI models</li>
          <li>Each teacher's student records are isolated and inaccessible to other users</li>
          <li>Data is encrypted in transit and at rest</li>
          <li>You can delete any student record at any time from within the app</li>
          <li>You can request deletion of all your data by emailing <a href="mailto:privacy@smartiep.co" style={{color: '#4a90d9'}}>privacy@smartiep.co</a></li>
        </ul>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">Data Processing Agreements</h2>
        <p className="legal-p">If your school or district requires a Data Processing Agreement (DPA) or a Memorandum of Understanding (MOU) before using SmartIEP, please contact us at <a href="mailto:hello@smartiep.co" style={{color: '#4a90d9'}}>hello@smartiep.co</a>. We are happy to work with districts to establish appropriate data governance agreements.</p>
      </div>

      <div className="legal-nav">
        <Link href="/legal/privacy">Privacy Policy</Link>
        <Link href="/legal/terms">Terms of Service</Link>
        <Link href="/legal/cookies">Cookie Policy</Link>
      </div>
    </div>
  );
}
