'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Student, GeneratedIEP, DOMAIN_COLORS } from '@/lib/types';
import { getStudent } from '@/lib/storage';

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return dateStr; }
}

export default function PDFPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [iep, setIep] = useState<GeneratedIEP | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getStudent(id).then(s => {
      if (!s || !s.generatedIEP) { router.push(`/students/${id}`); return; }
      setStudent(s);
      setIep(s.generatedIEP);
      setLoaded(true);
      // Auto-trigger print dialog after content loads
      setTimeout(() => window.print(), 800);
    });
  }, [id, router]);

  if (!loaded || !student || !iep) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Preparing document...</p>
      </div>
    </div>
  );

  const domainColors: Record<string, string> = {
    'Cognitive/Academic': '#1d4ed8',
    'Communication/Language': '#7c3aed',
    'Social-Emotional': '#15803d',
    'Adaptive/Self-Help': '#c2410c',
    'Physical/Motor': '#b91c1c',
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #111; background: white; }

        .pdf-controls {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: #1a1a2e; color: white; padding: 12px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pdf-controls p { font-family: sans-serif; font-size: 14px; }
        .pdf-btn {
          background: #4a90d9; color: white; border: none; padding: 8px 20px;
          border-radius: 6px; font-family: sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; margin-left: 8px;
        }
        .pdf-btn-outline {
          background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 20px; border-radius: 6px; font-family: sans-serif;
          font-size: 14px; cursor: pointer; margin-left: 8px;
          text-decoration: none; display: inline-block;
        }

        .document { max-width: 820px; margin: 80px auto 40px; padding: 40px; background: white; }

        .doc-header { border-bottom: 3px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 28px; }
        .doc-title { font-size: 24pt; font-weight: bold; color: #1d4ed8; }
        .doc-subtitle { font-size: 13pt; color: #374151; margin-top: 6px; }
        .draft-banner {
          background: #fef3c7; border: 1px solid #f59e0b; padding: 10px 14px;
          margin-top: 14px; font-size: 9.5pt; color: #92400e; border-radius: 4px;
          font-family: sans-serif;
        }

        .info-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 18px; margin-bottom: 28px;
        }
        .info-item { display: flex; flex-direction: column; gap: 3px; }
        .info-label { font-family: sans-serif; font-size: 8pt; font-weight: bold; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; }
        .info-value { font-size: 10.5pt; color: #111; }

        .section { margin-bottom: 32px; }
        .section-header {
          background: #1d4ed8; color: white; padding: 9px 16px;
          border-radius: 4px; margin-bottom: 14px;
          display: flex; justify-content: space-between; align-items: center;
          font-family: sans-serif;
        }
        .section-title { font-size: 12pt; font-weight: bold; }
        .section-badge { font-size: 8pt; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 12px; }

        .plaafp-text p { margin-bottom: 12px; line-height: 1.75; text-align: justify; font-size: 10.5pt; }
        .lre-box {
          background: #fffbeb; border: 1px solid #f59e0b; border-radius: 4px;
          padding: 14px; margin-top: 14px; font-family: sans-serif;
        }
        .lre-label { font-size: 8pt; font-weight: bold; text-transform: uppercase; color: #b45309; margin-bottom: 6px; }
        .lre-text { font-size: 10pt; line-height: 1.6; color: #1a1a2e; font-family: Georgia, serif; }

        .goal-card {
          border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;
          margin-bottom: 14px; page-break-inside: avoid;
        }
        .goal-domain {
          display: inline-block; color: white; font-size: 8.5pt; font-weight: bold;
          padding: 3px 12px; border-radius: 12px; margin-bottom: 10px;
          font-family: sans-serif;
        }
        .goal-statement { font-size: 10.5pt; font-weight: bold; margin-bottom: 12px; line-height: 1.6; }
        .benchmarks-label { font-family: sans-serif; font-size: 8pt; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
        .benchmarks { padding-left: 20px; margin-bottom: 12px; }
        .benchmarks li { font-size: 10pt; margin-bottom: 5px; line-height: 1.5; }
        .goal-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid #f3f4f6; padding-top: 10px; font-family: sans-serif; }
        .meta-label { font-size: 8pt; font-weight: bold; text-transform: uppercase; color: #9ca3af; display: block; margin-bottom: 2px; }
        .meta-value { font-size: 9.5pt; color: #374151; }

        table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 9.5pt; }
        th { background: #f1f5f9; text-align: left; padding: 9px 12px; font-size: 8pt; text-transform: uppercase; color: #6b7280; font-weight: bold; border-bottom: 2px solid #e2e8f0; }
        td { padding: 9px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; line-height: 1.5; }
        tr:last-child td { border-bottom: none; }

        .accom-list { list-style: none; font-family: sans-serif; }
        .accom-list li { padding: 7px 0; border-bottom: 1px solid #f3f4f6; font-size: 10pt; line-height: 1.5; }
        .accom-list li:before { content: '✓  '; color: #1d4ed8; font-weight: bold; }
        .accom-list li:last-child { border-bottom: none; }

        .progress-card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin-bottom: 12px; page-break-inside: avoid; }
        .progress-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-family: sans-serif; font-size: 9.5pt; }

        .sig-section { page-break-before: always; }
        .sig-intro { font-family: sans-serif; font-size: 9.5pt; color: #374151; margin-bottom: 20px; line-height: 1.6; }
        .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .sig-block { padding-top: 10px; }
        .sig-line { height: 40px; border-bottom: 1px solid #374151; margin-bottom: 6px; }
        .sig-name { font-family: sans-serif; font-size: 10pt; font-weight: bold; color: #1a1a2e; }
        .sig-date { font-family: sans-serif; font-size: 9pt; color: #6b7280; margin-top: 3px; }

        .doc-footer {
          margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb;
          font-family: sans-serif; font-size: 8.5pt; color: #9ca3af; text-align: center;
        }

        @media print {
          .pdf-controls { display: none !important; }
          .document { margin: 0; padding: 28px; max-width: 100%; }
          body { font-size: 10pt; }
          @page { margin: 0.75in; size: letter; }
        }
      `}</style>

      {/* Print controls — hidden when printing */}
      <div className="pdf-controls">
        <p>📄 {student.name} — IEP Document · Ready to print or save as PDF</p>
        <div>
          <button className="pdf-btn" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
          <a href={`/students/${id}`} className="pdf-btn-outline">← Back</a>
        </div>
      </div>

      <div className="document">
        {/* Header */}
        <div className="doc-header">
          <div className="doc-title">Individualized Education Program (IEP)</div>
          <div className="doc-subtitle">{student.name} · {student.grade} · {student.disabilityCategory}</div>
          <div className="draft-banner">
            ⚠️ DRAFT — FOR PROFESSIONAL REVIEW ONLY. This AI-generated IEP must be reviewed and approved by a qualified IEP team before implementation. Not legally effective until signed by all required parties.
          </div>
        </div>

        {/* Student Info */}
        <div className="info-grid">
          <div className="info-item"><span className="info-label">Student Name</span><span className="info-value">{student.name}</span></div>
          <div className="info-item"><span className="info-label">Date of Birth</span><span className="info-value">{formatDate(student.dateOfBirth)}</span></div>
          <div className="info-item"><span className="info-label">Grade / Level</span><span className="info-value">{student.grade}</span></div>
          <div className="info-item"><span className="info-label">Disability Category</span><span className="info-value">{student.disabilityCategory}</span></div>
          <div className="info-item"><span className="info-label">IEP Meeting Date</span><span className="info-value">{formatDate(student.meetingDate)}</span></div>
          <div className="info-item"><span className="info-label">Annual Review Date</span><span className="info-value">{formatDate(student.reviewDate)}</span></div>
          {student.parentName && <div className="info-item"><span className="info-label">Parent / Guardian</span><span className="info-value">{student.parentName}</span></div>}
          {student.parentPhone && <div className="info-item"><span className="info-label">Contact</span><span className="info-value">{student.parentPhone}</span></div>}
          <div className="info-item"><span className="info-label">Generated</span><span className="info-value">{formatDate(iep.generatedAt)}</span></div>
        </div>

        {/* PLAAFP */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Present Levels of Academic Achievement &amp; Functional Performance</span>
            <span className="section-badge">IDEA Required</span>
          </div>
          <div className="plaafp-text">
            {iep.plaafp.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>
          {iep.lreStatement && (
            <div className="lre-box">
              <div className="lre-label">Least Restrictive Environment (LRE)</div>
              <div className="lre-text">{iep.lreStatement}</div>
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Measurable Annual Goals</span>
            <span className="section-badge">{iep.goals.length} goal{iep.goals.length !== 1 ? 's' : ''} · IDEA Required</span>
          </div>
          {iep.goals.map((goal, i) => (
            <div key={i} className="goal-card">
              <div className="goal-domain" style={{background: domainColors[goal.domain] ?? '#374151'}}>{goal.domain}</div>
              <p className="goal-statement">{goal.goalStatement}</p>
              {goal.benchmarks.length > 0 && (
                <>
                  <div className="benchmarks-label">Short-Term Objectives</div>
                  <ol className="benchmarks">{goal.benchmarks.map((b, j) => <li key={j}>{b}</li>)}</ol>
                </>
              )}
              <div className="goal-meta">
                <div><span className="meta-label">Success Criteria</span><span className="meta-value">{goal.successCriteria}</span></div>
                <div><span className="meta-label">Timeframe</span><span className="meta-value">{goal.timeframe}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Special Education &amp; Related Services</span>
            <span className="section-badge">IDEA Required</span>
          </div>
          <table>
            <thead><tr><th>Service Type</th><th>Frequency</th><th>Duration</th><th>Setting</th><th>Provider</th></tr></thead>
            <tbody>{iep.services.map((s, i) => <tr key={i}><td>{s.serviceType}</td><td>{s.frequency}</td><td>{s.duration}</td><td>{s.setting}</td><td>{s.provider}</td></tr>)}</tbody>
          </table>
        </div>

        {/* Accommodations */}
        <div className="section">
          <div className="section-header"><span className="section-title">Classroom Accommodations &amp; Supports</span></div>
          <ul className="accom-list">{iep.accommodations.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>

        {iep.assessmentAccommodations.length > 0 && (
          <div className="section">
            <div className="section-header"><span className="section-title">Assessment Accommodations</span></div>
            <ul className="accom-list">{iep.assessmentAccommodations.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}

        {/* Progress Monitoring */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Progress Monitoring Plan</span>
            <span className="section-badge">IDEA Required</span>
          </div>
          {iep.progressMonitoring.map((plan, i) => (
            <div key={i} className="progress-card">
              <div className="goal-domain" style={{background: domainColors[plan.goalDomain] ?? '#374151'}}>{plan.goalDomain}</div>
              <div className="progress-grid">
                <div><span className="meta-label">Data Collection</span><span className="meta-value">{plan.dataCollectionMethod}</span></div>
                <div><span className="meta-label">Frequency</span><span className="meta-value">{plan.frequency}</span></div>
                <div><span className="meta-label">Responsible Party</span><span className="meta-value">{plan.responsibleParty}</span></div>
                <div><span className="meta-label">Reporting Schedule</span><span className="meta-value">{plan.reportingSchedule}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div className="section sig-section">
          <div className="section-header"><span className="section-title">IEP Team Signatures</span></div>
          <p className="sig-intro">By signing below, IEP team members confirm participation in the development of this IEP. Parent/guardian signature indicates participation in the meeting; it does not necessarily indicate agreement with all components of the IEP.</p>
          <div className="sig-grid">
            {[
              'Special Education Teacher',
              'General Education Teacher',
              'Parent / Guardian',
              'School Administrator / Designee',
              'Related Service Provider (if applicable)',
              'Student (if age-appropriate)',
            ].map((role, i) => (
              <div key={i} className="sig-block">
                <div className="sig-line" />
                <div className="sig-name">{role}</div>
                <div className="sig-date">Date: _______________</div>
              </div>
            ))}
          </div>
        </div>

        <div className="doc-footer">
          AI-Generated IEP Draft · SmartIEP (smartiep.co) · Generated {new Date(iep.generatedAt).toLocaleString()} · IDEA 2004 Aligned · Requires professional review and team approval before implementation
        </div>
      </div>
    </>
  );
}
