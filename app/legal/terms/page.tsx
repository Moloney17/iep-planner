import Link from 'next/link';

export default function TermsOfService() {
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
        .legal-highlight { background: #fff8e8; border-left: 3px solid #f0a500; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
        .legal-highlight p { margin: 0; font-size: 15px; color: #7a5200; font-style: italic; }
        .legal-contact { background: #f8f7f4; border-radius: 12px; padding: 24px; margin-top: 48px; font-family: sans-serif; }
        .legal-contact h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #1a1a2e; }
        .legal-contact p { font-size: 14px; color: #666; margin: 0; }
        .legal-contact a { color: #4a90d9; }
        .legal-nav { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-family: sans-serif; }
        .legal-nav a { font-size: 13px; color: #4a90d9; text-decoration: none; }
        .legal-nav a:hover { text-decoration: underline; }
      `}</style>

      <Link href="/landing" className="legal-back">← Back to SmartIEP</Link>

      <div className="legal-badge">Terms of Service</div>
      <h1 className="legal-h1">Terms of Service</h1>
      <p className="legal-updated">Last updated: {updated}</p>

      <div className="legal-highlight">
        <p>Important: SmartIEP generates draft IEP documents for review purposes only. All AI-generated content must be reviewed and approved by qualified special education professionals before use. SmartIEP is not a substitute for professional educational or legal judgment.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">1. Acceptance of terms</h2>
        <p className="legal-p">By creating an account or using SmartIEP ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms constitute a legally binding agreement between you and SmartIEP.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">2. Description of service</h2>
        <p className="legal-p">SmartIEP is an AI-assisted drafting tool that helps special education professionals generate draft Individualized Education Program (IEP) documents. The Service uses artificial intelligence to produce draft content based on information you provide.</p>
        <p className="legal-p"><strong>SmartIEP is a drafting aid, not a legal document generator.</strong> Output from the Service is a starting point for professional review, not a final, legally effective document.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">3. Your responsibilities</h2>
        <p className="legal-p">By using SmartIEP, you agree that:</p>
        <ul className="legal-ul">
          <li>You are a qualified special education professional or are working under the supervision of one</li>
          <li>You will review all AI-generated content for accuracy, appropriateness, and legal compliance before using it in any official IEP</li>
          <li>You are responsible for ensuring that your use of this tool complies with IDEA 2004, FERPA, and any applicable state or district policies</li>
          <li>You will not use SmartIEP as a substitute for professional judgment or direct assessment of students</li>
          <li>You are responsible for the accuracy of any information you enter about students</li>
          <li>You will obtain any necessary consent or authorization before entering student information into the Service</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">4. Acceptable use</h2>
        <p className="legal-p">You agree not to:</p>
        <ul className="legal-ul">
          <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
          <li>Attempt to circumvent rate limits or access controls</li>
          <li>Share your account credentials with others</li>
          <li>Enter false or fabricated student information</li>
          <li>Use the Service to generate IEPs for students you do not have professional responsibility for</li>
          <li>Attempt to reverse-engineer, copy, or resell the Service</li>
          <li>Use automated tools or scripts to access the Service without permission</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">5. AI-generated content disclaimer</h2>
        <p className="legal-p">SmartIEP uses large language model AI technology to generate IEP drafts. While we strive for quality and IDEA compliance, AI-generated content:</p>
        <ul className="legal-ul">
          <li>May contain errors, inaccuracies, or legally insufficient language</li>
          <li>Must be reviewed and modified by a qualified IEP team before implementation</li>
          <li>Is not a substitute for formal assessment, professional evaluation, or team deliberation</li>
          <li>May not reflect the most current legal requirements in your jurisdiction</li>
        </ul>
        <p className="legal-p">SmartIEP does not guarantee that any generated document will meet legal requirements or be approved by any school, district, or regulatory body.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">6. Limitation of liability</h2>
        <p className="legal-p">To the fullest extent permitted by law, SmartIEP shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to:</p>
        <ul className="legal-ul">
          <li>Reliance on AI-generated IEP content without professional review</li>
          <li>Legal or regulatory consequences arising from improper use of generated documents</li>
          <li>Loss of student data due to technical failure</li>
          <li>Any harm to students arising from the use of AI-generated content</li>
        </ul>
        <p className="legal-p">Our total liability to you for any claim arising from use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">7. Account termination</h2>
        <p className="legal-p">We reserve the right to suspend or terminate your account at any time for violation of these Terms, abuse of the Service, or for any other reason at our discretion. You may delete your account at any time by contacting us at <a href="mailto:hello@smartiep.co" style={{color: '#4a90d9'}}>hello@smartiep.co</a>.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">8. Changes to the service</h2>
        <p className="legal-p">We may modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice of significant changes where possible. Your continued use of the Service after changes constitutes acceptance of the new terms.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">9. Governing law</h2>
        <p className="legal-p">These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration rather than in court, except where prohibited by law.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-h2">10. Contact</h2>
        <p className="legal-p">Questions about these Terms? Email us at <a href="mailto:hello@smartiep.co" style={{color: '#4a90d9'}}>hello@smartiep.co</a>.</p>
      </div>

      <div className="legal-contact">
        <h3>Need help?</h3>
        <p>Email <a href="mailto:hello@smartiep.co">hello@smartiep.co</a> with any questions about these terms.</p>
      </div>

      <div className="legal-nav">
        <Link href="/legal/privacy">Privacy Policy</Link>
        <Link href="/legal/cookies">Cookie Policy</Link>
        <Link href="/legal/ferpa">FERPA Notice</Link>
      </div>
    </div>
  );
}
