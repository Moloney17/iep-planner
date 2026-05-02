'use client';

import Link from 'next/link';
import { useState } from 'react';

const STEPS = [
  {
    icon: '👤',
    title: 'Add a student',
    desc: 'Enter basic information — name, date of birth, grade, and disability category. You can also add parent contact details.',
    tip: 'You can always edit this information later.',
  },
  {
    icon: '📊',
    title: 'Describe present levels',
    desc: 'Share what the student can currently do across up to 5 domains: cognitive, communication, social-emotional, adaptive, and physical/motor.',
    tip: 'Use specific data — percentages, frequency counts, or assessment scores — for the strongest IEP goals.',
  },
  {
    icon: '🌍',
    title: 'Add context & priorities',
    desc: "Tell Claude about the student's strengths, areas of concern, and what the family most wants to achieve this year.",
    tip: 'The more detail you provide here, the more personalized the IEP will be.',
  },
  {
    icon: '✨',
    title: 'Generate your IEP',
    desc: 'Claude will draft a complete, IDEA 2004-compliant IEP including PLAAFP narrative, measurable annual goals, services, accommodations, and progress monitoring.',
    tip: 'Generation usually takes 30–90 seconds. You can regenerate as many times as you like.',
  },
  {
    icon: '✏️',
    title: 'Review & refine',
    desc: 'Click any section of the generated IEP to edit it directly. Export to HTML for printing, or save as PDF from your browser.',
    tip: 'Always review AI-generated content with your IEP team before using it officially.',
  },
];

const FAQS = [
  {
    q: 'Is this tool IDEA 2004 compliant?',
    a: 'SmartIEP generates drafts aligned with IDEA 2004 requirements — including PLAAFP, measurable annual goals, services, accommodations, and progress monitoring. However, all content must be reviewed and approved by a qualified IEP team before use.',
  },
  {
    q: 'How many IEPs can I generate per day?',
    a: 'You can generate up to 5 IEP drafts per day. This limit resets at midnight. If you need more, contact us and we can discuss your needs.',
  },
  {
    q: 'Is my student data secure?',
    a: 'Yes. Your student records are private to your account — no other user can see them. Data is encrypted in transit and at rest. We never share or sell your data, and it is never used to train AI models.',
  },
  {
    q: 'Can I edit the generated IEP?',
    a: 'Yes — click any text in the generated IEP to edit it inline. Your edits are saved to your account automatically.',
  },
  {
    q: 'What happens if I regenerate an IEP?',
    a: 'The previous version is automatically saved to version history before being replaced. You can view and compare all past versions at any time.',
  },
  {
    q: 'Can I use this with students of any age?',
    a: 'SmartIEP supports students from Early Intervention (birth–3) through Transition (18–21), covering the full IDEA eligibility range.',
  },
  {
    q: 'Does the tool replace my professional judgment?',
    a: 'No — and it is not designed to. SmartIEP is a drafting aid that helps you start faster and with stronger structure. Your professional expertise, knowledge of the student, and team collaboration are essential to producing a legally sound, appropriate IEP.',
  },
];

export default function OnboardingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">💡</div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome to SmartIEP
        </h1>
        <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto leading-relaxed">
          AI-assisted IEP drafting for special education teachers. Here's everything you need to get started.
        </p>
        <Link href="/students/new"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg">
          Add Your First Student →
        </Link>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          How it works
        </h2>
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-2" />}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                <p className="text-blue-600 text-xs mt-1.5 font-medium">💡 {step.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best practices */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-amber-900 mb-4">✅ Tips for best results</h2>
        <ul className="space-y-3">
          {[
            'Use specific, data-driven language in present levels — e.g. "identifies 8/10 uppercase letters" rather than "knows some letters"',
            'Fill in as many domains as are relevant — Claude generates goals only for domains you describe',
            'Include family priorities — this makes the IEP feel collaborative and aligned with IDEA requirements',
            'Always review generated content with your full IEP team before finalizing',
            'Use the Edit Content button to refine any section before exporting',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-amber-800">
              <span className="shrink-0 text-amber-500 font-bold">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-red-900 mb-2">⚠️ Important disclaimer</h2>
        <p className="text-sm text-red-800 leading-relaxed">
          SmartIEP generates draft IEP documents for professional review purposes only. All AI-generated content must be reviewed, modified as needed, and approved by a qualified IEP team — including the special education teacher, general education teacher, administrator, parent/guardian, and related service providers — before implementation. This tool supports, but does not replace, professional judgment and direct assessment of students.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                <span className="text-gray-400 shrink-0 ml-4">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-8">
        <Link href="/students/new"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg">
          Add Your First Student →
        </Link>
        <p className="text-gray-400 text-xs mt-3">
          Questions? Email <a href="mailto:hello@smartiep.co" className="text-blue-500 hover:underline">hello@smartiep.co</a>
        </p>
      </div>
    </div>
  );
}
