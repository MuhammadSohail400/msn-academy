import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, Award, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Terms() {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-brand-crimson">
            <Scale className="h-3.5 w-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Please read these terms carefully before accessing or enrolling in courses on MSN Academy.
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
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              1. Acceptance & Student Accounts
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            By creating an account, browsing courses, or completing enrollments at MSN Academy, you agree to be bound by these Terms of Use and our Privacy Policy. Each student is responsible for maintaining the confidentiality of their credentials and all activities occurring under their account.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-brand-crimson">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              2. Course Access & Intellectual Property
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Upon purchasing a course, you receive a personal, non-transferable, revocable license for lifetime personal study:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Course curriculum, video lectures, source code starter kits, and assessments are protected by intellectual property laws.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>You may not copy, record, mirror, publicly broadcast, or resell any video content or learning materials without explicit written consent from MSN Academy.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-brand-crimson">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              3. Assessments & Academic Honesty
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Certificates of completion are awarded strictly based on merit and individual performance. Learners must achieve a minimum score of 70% on the final timed assessment. Any fraudulent activity, automated exam tampering, or impersonation will lead to immediate revocation of credentials and account suspension.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">
            4. Pricing & Payments
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All prices are stated in Pakistani Rupees (PKR). We provide transparent pricing without hidden recurring charges. Enrollments become active immediately upon automated payment confirmation or within a few hours for manual bank transfers after proof verification.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-crimson-hover transition-colors"
            >
              <span>Explore Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>Have Questions?</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
