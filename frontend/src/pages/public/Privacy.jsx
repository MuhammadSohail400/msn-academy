import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-brand-crimson">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Your privacy is critically important to us. Learn how MSN Academy collects, utilizes, and protects your personal and educational data.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: January 2026 • Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      {/* 2. Content Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-brand-crimson">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              1. Information We Collect
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you register, enroll in courses, or communicate with MSN Academy, we collect information necessary to deliver quality tech education and certificate validation:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Account & Contact Info:</strong> Full name, email address, phone number, and password credentials (stored as cryptographic hashes).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Learning & Assessment Records:</strong> Video lecture completion status, quiz submissions, examination scores, and generated digital credentials.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Billing & Invoices:</strong> Order transaction identifiers, payment methods (e.g. Bank Transfer, JazzCash, EasyPaisa), and billing addresses. We do not store raw card numbers.</span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-brand-crimson">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              2. How We Protect Your Data
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We implement strict technical and organizational safeguards to ensure confidentiality, integrity, and availability:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>All client-to-server traffic is encrypted end-to-end via Transport Layer Security (TLS/HTTPS).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Passwords are hashed using industry-standard Argon2id / Bcrypt with unique cryptographic salts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>We never sell, rent, or trade your personal data with third-party advertisers.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-brand-crimson">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              3. Verifiable Certificates & Public Records
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you successfully complete an MSN Academy course and pass the final evaluation, a public credential record is generated with a unique Verification ID. This record includes your full student name, course title, and completion date to allow potential employers and recruiters to verify your authenticity. You can request your certificate record to be made private at any time through student support.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">
            4. Your Rights & Questions
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You have the right to inspect, correct, export, or request the deletion of your student profile and personal data. For privacy-related inquiries, reach out to our team at{' '}
            <a href="mailto:info@msnacademy.pk" className="font-medium text-brand-crimson hover:underline">
              info@msnacademy.pk
            </a>.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Contact Privacy Support</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
