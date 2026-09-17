import React from 'react';
import { CheckCircle2, Award, ShieldCheck, Calendar, Hash, User, BookOpen, X, Printer, Share2 } from 'lucide-react';

export default function VerificationBadgeModal({ cert, isOpen, onClose }) {
  if (!isOpen || !cert) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MSN Academy Verified Certificate - ${cert.studentName}`,
          text: `Verified certificate for ${cert.studentName} in ${cert.courseTitle}`,
          url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Verified Badge Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100/80 border border-emerald-200 text-emerald-600 mb-4 shadow-sm">
            <ShieldCheck className="h-9 w-9 stroke-[2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Official Verified Credential
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            Certificate of Achievement
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Verified directly from the MSN Academy Registry
          </p>
        </div>

        {/* Certificate Details */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4 divide-y divide-slate-200/60 text-sm">
          <div className="flex justify-between py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" /> Student
            </span>
            <span className="font-semibold text-slate-900">{cert.studentName}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-slate-400" /> Course
            </span>
            <span className="font-semibold text-slate-900 text-right">{cert.courseTitle}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-slate-400" /> Certificate ID
            </span>
            <span className="font-mono font-bold text-brand-navy">{cert.certificateNumber}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" /> Issue Date
            </span>
            <span className="font-medium text-slate-800">{cert.issueDate}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-slate-400" /> Issued By
            </span>
            <span className="font-semibold text-slate-900">MSN Academy</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-slate-500">Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Valid & Active
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="h-4 w-4 text-slate-500" />
            Share Verification
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Record
          </button>
        </div>
      </div>
    </div>
  );
}
