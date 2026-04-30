import { NextRequest, NextResponse } from 'next/server';
import { Student, GeneratedIEP } from '@/lib/types';

export const maxDuration = 30;

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch { return dateStr; }
}

function buildHtml(student: Student, iep: GeneratedIEP): string {
  const domainColors: Record<string, string> = {
    'Cognitive/Academic': '#1d4ed8', 'Communication/Language': '#7c3aed',
    'Social-Emotional': '#15803d', 'Adaptive/Self-Help': '#c2410c', 'Physical/Motor': '#b91c1c',
  };
  const goals = iep.goals.map(g => `
    <div class="goal-card">
      <div class="domain-badge" style="background:${domainColors[g.domain] ?? '#374151'}">${escapeHtml(g.domain)}</div>
      <p class="goal-statement">${escapeHtml(g.goalStatement)}</p>
      ${g.benchmarks.length > 0 ? `<p class="section-label">Short-Term Objectives</p><ol class="benchmarks">${g.benchmarks.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ol>` : ''}
      <div class="goal-meta">
        <div><span class="meta-label">Success Criteria</span><span>${escapeHtml(g.successCriteria)}</span></div>
        <div><span class="meta-label">Timeframe</span><span>${escapeHtml(g.timeframe)}</span></div>
      </div>
    </div>`).join('');
  const servicesRows = iep.services.map(s => `<tr><td>${escapeHtml(s.serviceType)}</td><td>${escapeHtml(s.frequency)}</td><td>${escapeHtml(s.duration)}</td><td>${escapeHtml(s.setting)}</td><td>${escapeHtml(s.provider)}</td></tr>`).join('');
  const progressCards = iep.progressMonitoring.map(p => `
    <div class="progress-card">
      <div class="domain-badge" style="background:${domainColors[p.goalDomain] ?? '#374151'}">${escapeHtml(p.goalDomain)}</div>
      <div class="progress-grid">
        <div><span class="meta-label">Data Collection</span><span>${escapeHtml(p.dataCollectionMethod)}</span></div>
        <div><span class="meta-label">Frequency</span><span>${escapeHtml(p.frequency)}</span></div>
        <div><span class="meta-label">Responsible Party</span><span>${escapeHtml(p.responsibleParty)}</span></div>
        <div><span class="meta-label">Reporting Schedule</span><span>${escapeHtml(p.reportingSchedule)}</span></div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>IEP — ${escapeHtml(student.name)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,'Times New Roman',serif;font-size:11pt;color:#111;background:white}.page{max-width:750px;margin:0 auto;padding:40px}
.doc-header{border-bottom:3px solid #1d4ed8;padding-bottom:16px;margin-bottom:24px}.doc-title{font-size:22pt;font-weight:bold;color:#1d4ed8}.doc-subtitle{font-size:13pt;color:#374151;margin-top:4px}
.draft-banner{background:#fef3c7;border:1px solid #f59e0b;padding:8px 12px;margin-top:12px;font-size:9pt;color:#92400e;border-radius:4px}
.info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.info-row{display:flex;flex-direction:column;gap:2px}.info-label{font-size:8pt;font-weight:bold;text-transform:uppercase;color:#6b7280;letter-spacing:.05em}.info-value{font-size:10.5pt;color:#111}
.section{margin-bottom:28px;page-break-inside:avoid}.section-header{background:#1d4ed8;color:white;padding:8px 14px;border-radius:4px;font-size:12pt;font-weight:bold;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.idea-badge{font-size:8pt;background:rgba(255,255,255,.2);padding:2px 8px;border-radius:12px}
.plaafp-text p{margin-bottom:10px;line-height:1.7;text-align:justify}.lre-box{background:#fffbeb;border:1px solid #f59e0b;border-radius:4px;padding:12px;margin-top:12px}.lre-label{font-size:8pt;font-weight:bold;text-transform:uppercase;color:#b45309;margin-bottom:4px}
.goal-card{border:1px solid #e5e7eb;border-radius:6px;padding:14px;margin-bottom:12px;page-break-inside:avoid}.domain-badge{display:inline-block;color:white;font-size:8.5pt;font-weight:bold;padding:3px 10px;border-radius:12px;margin-bottom:8px}
.goal-statement{font-size:10.5pt;font-weight:600;margin-bottom:10px;line-height:1.6}.section-label{font-size:8pt;font-weight:bold;text-transform:uppercase;color:#6b7280;margin-bottom:6px;letter-spacing:.05em}
.benchmarks{padding-left:20px;margin-bottom:10px}.benchmarks li{font-size:10pt;margin-bottom:4px;line-height:1.5}.goal-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid #f3f4f6;padding-top:10px;margin-top:8px;font-size:9.5pt}
.meta-label{display:block;font-size:8pt;font-weight:bold;text-transform:uppercase;color:#9ca3af;margin-bottom:2px}
table{width:100%;border-collapse:collapse;font-size:9.5pt}th{background:#f1f5f9;text-align:left;padding:8px 10px;font-size:8pt;text-transform:uppercase;color:#6b7280;font-weight:bold;border-bottom:2px solid #e2e8f0}td{padding:8px 10px;border-bottom:1px solid #f3f4f6;vertical-align:top;line-height:1.5}tr:last-child td{border-bottom:none}
.accom-list{list-style:none}.accom-list li{padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:10pt;line-height:1.5}.accom-list li::before{content:'✓ ';color:#1d4ed8;font-weight:bold}.accom-list li:last-child{border-bottom:none}
.progress-card{border:1px solid #e5e7eb;border-radius:6px;padding:12px;margin-bottom:10px;page-break-inside:avoid}.progress-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;font-size:9.5pt}
.sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px}.sig-block{border-top:1px solid #374151;padding-top:8px}.sig-name{font-size:10pt;font-weight:bold}.sig-date{font-size:9pt;color:#6b7280;margin-top:4px}.sig-line{height:36px;border-bottom:1px solid #9ca3af;margin-top:16px}
.doc-footer{margin-top:32px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:8.5pt;color:#9ca3af;text-align:center}
.signature-section{page-break-before:always}
</style></head><body><div class="page">
<div class="doc-header"><div class="doc-title">Individualized Education Program (IEP)</div><div class="doc-subtitle">${escapeHtml(student.name)} · ${escapeHtml(student.grade)} · ${escapeHtml(student.disabilityCategory)}</div><div class="draft-banner">⚠️ DRAFT — FOR PROFESSIONAL REVIEW ONLY. Must be reviewed and approved by a qualified IEP team before implementation.</div></div>
<div class="info-box">
  <div class="info-row"><span class="info-label">Student Name</span><span class="info-value">${escapeHtml(student.name)}</span></div>
  <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${formatDate(student.dateOfBirth)}</span></div>
  <div class="info-row"><span class="info-label">Grade / Level</span><span class="info-value">${escapeHtml(student.grade)}</span></div>
  <div class="info-row"><span class="info-label">Disability Category</span><span class="info-value">${escapeHtml(student.disabilityCategory)}</span></div>
  <div class="info-row"><span class="info-label">IEP Meeting Date</span><span class="info-value">${formatDate(student.meetingDate)}</span></div>
  <div class="info-row"><span class="info-label">Annual Review Date</span><span class="info-value">${formatDate(student.reviewDate)}</span></div>
  ${student.parentName ? `<div class="info-row"><span class="info-label">Parent / Guardian</span><span class="info-value">${escapeHtml(student.parentName)}</span></div>` : ''}
  ${student.parentPhone ? `<div class="info-row"><span class="info-label">Contact</span><span class="info-value">${escapeHtml(student.parentPhone)}</span></div>` : ''}
  <div class="info-row"><span class="info-label">Generated</span><span class="info-value">${formatDate(iep.generatedAt)}</span></div>
</div>
<div class="section"><div class="section-header">Present Levels of Academic Achievement &amp; Functional Performance<span class="idea-badge">IDEA Required</span></div><div class="plaafp-text">${iep.plaafp.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>${iep.lreStatement ? `<div class="lre-box"><div class="lre-label">Least Restrictive Environment (LRE)</div><p style="font-size:10pt;line-height:1.6">${escapeHtml(iep.lreStatement)}</p></div>` : ''}</div>
<div class="section"><div class="section-header">Measurable Annual Goals<span class="idea-badge">${iep.goals.length} goal${iep.goals.length !== 1 ? 's' : ''} · IDEA Required</span></div>${goals}</div>
<div class="section"><div class="section-header">Special Education &amp; Related Services<span class="idea-badge">IDEA Required</span></div><table><thead><tr><th>Service Type</th><th>Frequency</th><th>Duration</th><th>Setting</th><th>Provider</th></tr></thead><tbody>${servicesRows}</tbody></table></div>
<div class="section"><div class="section-header">Classroom Accommodations &amp; Supports</div><ul class="accom-list">${iep.accommodations.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul></div>
${iep.assessmentAccommodations.length > 0 ? `<div class="section"><div class="section-header">Assessment Accommodations</div><ul class="accom-list">${iep.assessmentAccommodations.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul></div>` : ''}
<div class="section"><div class="section-header">Progress Monitoring Plan<span class="idea-badge">IDEA Required</span></div>${progressCards}</div>
<div class="section signature-section"><div class="section-header">IEP Team Signatures</div><p style="font-size:9.5pt;color:#374151;margin-bottom:16px">By signing below, team members confirm participation in this IEP's development.</p>
<div class="sig-grid">
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Special Education Teacher</div><div class="sig-date">Date: _______________</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">General Education Teacher</div><div class="sig-date">Date: _______________</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Parent / Guardian</div><div class="sig-date">Date: _______________</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">School Administrator / Designee</div><div class="sig-date">Date: _______________</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Related Service Provider (if applicable)</div><div class="sig-date">Date: _______________</div></div>
  <div class="sig-block"><div class="sig-line"></div><div class="sig-name">Student (if age-appropriate)</div><div class="sig-date">Date: _______________</div></div>
</div></div>
<div class="doc-footer">AI-Generated IEP Draft · IEP Planner · Generated ${new Date(iep.generatedAt).toLocaleString()} · IDEA 2004 Aligned · Requires professional review before use</div>
</div></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { student, iep }: { student: Student; iep: GeneratedIEP } = await request.json();
    return new NextResponse(buildHtml(student, iep), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: 500 });
  }
}
