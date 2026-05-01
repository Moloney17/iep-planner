import Link from 'next/link';

export default function PrivacyPolicy() {
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
        .legal-ul { padding-left: 24px; margin-bottom: 16px; }
        .legal-ul li { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 8px; }
        .legal-highlight { background: #f0f7ff; border-left: 3px solid #4a90d9; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
        .legal-highlight p { margin: 0; font-size: 15px; color: #2a6fad; font-style: italic; }
        .legal-contact { background: #f8f7f4; border-radius: 12px; padding: 24px; margin-top: 48px; font-family: sans-serif; }
        .legal-contact h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1a1a2e; }
        .legal-contact p { font-size: 14px; color: #666; margin: 0; }
        .legal-contact a { color: #4a90d9; }
        .legal-nav { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-family: sans-serif; }
        .legal-nav a { font-size: 13px; color: #4a90d9; text-decoration: none; }
        .legal-nav a:hover { text-decoration: underline; }
      `}</style>

      <Link href="/landing" className="legal-back">← Back to SmartIEP</Link>

      <div className="legal-badge">Privacy Policy</div>
      <h1 className="legal-h1">Your privacy matters to us.</h1>
      <p className="legal-updated">Last updated: {updated}</p>

      <div className="legal-highlight">
        <p>Plain-language summary: We collect only what we need to run the service. Student data you enter is yours alone — it is never shared, sold, or used to train AI models. You can delete your data at any time.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">1. Who we are</h2>
        <p className="legal-p">SmartIEP ("we," "us," or "our") is an AI-assisted IEP drafting tool operated at smartiep.co. We are not a school, district, or educational agency. We provide a software tool to help special education professionals draft IEP documents.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">2. What information we collect</h2>
        <p className="legal-p"><strong>Account information:</strong> When you create an account, we collect your name and email address. This is used solely to authenticate you and associate your data with your account.</p>
        <p className="legal-p"><strong>Student data you enter:</strong> When you use SmartIEP, you may enter information about students including names, dates of birth, disability categories, assessment data, and parent/guardian contact information. This data is stored securely and is only accessible to you.</p>
        <p className="legal-p"><strong>Usage data:</strong> We collect basic usage information such as the number of IEPs generated, to help us improve the service and manage rate limits. We do not track your behavior across other websites.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">3. How we use your information</h2>
        <ul className="legal-ul">
          <li>To authenticate you and provide access to your account</li>
          <li>To generate IEP drafts using the student information you provide</li>
          <li>To store your student records so you can access them across sessions</li>
          <li>To enforce usage limits and prevent abuse of the service</li>
          <li>To communicate with you about your account (e.g., password resets)</li>
        </ul>
        <p className="legal-p"><strong>We do not use your data or student data to train AI models.</strong> The student information you enter is sent to Anthropic's Claude API solely to generate the IEP draft you requested, and is not retained by Anthropic for training purposes under their API terms.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">4. How we store and protect your data</h2>
        <p className="legal-p">Your data is stored in Supabase, a secure cloud database platform with enterprise-grade encryption at rest and in transit. Each user's data is isolated — row-level security policies ensure that no user can access another user's student records.</p>
        <p className="legal-p">We use Supabase Auth for authentication, which means your password is never stored in plain text and is managed by Supabase's secure authentication system.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">5. Who we share data with</h2>
        <p className="legal-p">We do not sell, rent, or share your personal data or student data with third parties for marketing purposes. We share data only with the following service providers who help us operate SmartIEP:</p>
        <ul className="legal-ul">
          <li><strong>Supabase</strong> — database and authentication hosting</li>
          <li><strong>Anthropic</strong> — AI model provider (receives student data only to generate the requested IEP draft)</li>
          <li><strong>Vercel</strong> — application hosting and content delivery</li>
        </ul>
        <p className="legal-p">Each of these providers is bound by their own privacy policies and data processing agreements.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">6. FERPA and student education records</h2>
        <p className="legal-p">The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records. SmartIEP is a tool used by educators and is not itself an educational agency subject to FERPA. However, we take the privacy of student information seriously.</p>
        <p className="legal-p">If you are entering student information into SmartIEP, you are responsible for ensuring that your use of this tool complies with your school or district's FERPA obligations and data privacy policies. We recommend using initials or pseudonyms for students wherever possible. See our <Link href="/legal/ferpa" style={{color: '#4a90d9'}}>FERPA Notice</Link> for more information.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">7. Your rights and choices</h2>
        <p className="legal-p">You have the right to:</p>
        <ul className="legal-ul">
          <li>Access the data associated with your account at any time</li>
          <li>Delete individual student records from within the app</li>
          <li>Request deletion of your entire account and all associated data by emailing us</li>
          <li>Export your data (IEP documents can be exported from within the app)</li>
        </ul>
        <p className="legal-p">To request account deletion or a copy of your data, email us at <a href="mailto:privacy@smartiep.co" style={{color: '#4a90d9'}}>privacy@smartiep.co</a>. We will respond within 30 days.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">8. Cookies</h2>
        <p className="legal-p">We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies. See our <Link href="/legal/cookies" style={{color: '#4a90d9'}}>Cookie Policy</Link> for details.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">9. Children's privacy</h2>
        <p className="legal-p">SmartIEP is designed for use by adults (educators and administrators). We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">10. Changes to this policy</h2>
        <p className="legal-p">We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the site. Your continued use of SmartIEP after changes are posted constitutes your acceptance of the updated policy.</p>
      </div>

      <div className="legal-contact">
        <h3>Questions about privacy?</h3>
        <p>Email us at <a href="mailto:privacy@smartiep.co">privacy@smartiep.co</a> and we'll respond within 30 days.</p>
      </div>

      <div className="legal-nav">
        <Link href="/legal/terms">Terms of Service</Link>
        <Link href="/legal/cookies">Cookie Policy</Link>
        <Link href="/legal/ferpa">FERPA Notice</Link>
      </div>
    </div>
  );
}
