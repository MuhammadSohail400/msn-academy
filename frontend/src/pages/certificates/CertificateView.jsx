import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Maximize2,
  ShieldCheck,
  Share2,
  Loader2,
  AlertCircle,
  Award,
} from 'lucide-react';
import certificateService from '../../services/certificateService';

// Format date as "DD Month YYYY"
function formatIssuedDate(dateStr) {
  if (!dateStr) return '[DD Month YYYY]';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ── Printable Certificate Card ─────────────────────────────────────────────────
function CertificateCard({ cert }) {
  const issuedDate = new Date(cert.issuedAt || Date.now());
  const day = issuedDate.toLocaleDateString('en-US', { day: '2-digit' });
  const month = issuedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = issuedDate.getFullYear();

  return (
    <div
      id="certificate-print"
      className="relative flex rounded-xl overflow-hidden border border-slate-200 shadow-md"
      style={{ minHeight: '420px' }}
    >
      {/* Left dark navy spine */}
      <div className="w-14 bg-brand-navy flex items-center justify-center shrink-0">
        <span
          className="text-white font-display font-extrabold text-lg tracking-widest"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.25em' }}
        >
          Certificate
        </span>
      </div>

      {/* Geometric corner accents */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-80">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {[0,1,2,3].map((i) => (
            <rect key={i} x={10+i*8} y={i*8} width={60-i*8} height={10} fill="#0F1F4B" opacity={0.15+i*0.1} />
          ))}
        </svg>
      </div>
      <div className="absolute bottom-0 left-14 w-20 h-20 opacity-80">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {[0,1,2,3].map((i) => (
            <rect key={i} x={i*8} y={10+i*8} width={10} height={60-i*8} fill="#0F1F4B" opacity={0.15+i*0.1} />
          ))}
        </svg>
      </div>

      {/* Main certificate body */}
      <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy">
            <span className="text-white font-display text-xs font-bold leading-none">MSN<br/>Acad.</span>
          </div>
        </div>

        {/* Certificate headings */}
        <div>
          <h2 className="font-display text-3xl font-extrabold text-brand-navy leading-none">Certificate</h2>
          <p className="text-sm text-slate-500 font-medium">Of Completion</p>
        </div>

        {/* Presented to */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500">This certificate is presented to</p>
          <div className="border-b-2 border-brand-navy pb-1 px-4">
            <p className="font-display text-xl font-bold text-brand-navy">
              {cert.studentName || '[ Your Name ]'}
            </p>
          </div>
        </div>

        {/* Course */}
        <div className="space-y-0.5">
          <p className="text-xs text-slate-500">for successfully completing the course</p>
          <p className="font-display text-base font-bold text-brand-navy">
            {cert.courseTitle ? `[ ${cert.courseTitle} ]` : '[ Your Course Name ]'}
          </p>
        </div>

        {/* Body text */}
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          This certificate is proudly presented in recognition of your successful completion
          of the course. Your dedication, commitment and hard work have been commendable.
        </p>

        {/* Footer: date stamp + signature */}
        <div className="flex items-end justify-between w-full pt-2">
          {/* Date stamp */}
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-brand-navy bg-white text-brand-navy text-center shrink-0">
            <span className="text-xs font-bold leading-none">{day}</span>
            <span className="text-[10px] font-bold leading-none">{month}</span>
            <span className="text-[10px] font-bold leading-none">{year}</span>
          </div>

          {/* Signature */}
          <div className="text-right">
            <p className="font-serif italic text-sm text-slate-700">M. Suleman Naqvi</p>
            <p className="text-[10px] text-slate-500 font-semibold">Founder of MSN Academy</p>
          </div>
        </div>

        {/* Certificate ID */}
        <p className="text-[10px] text-slate-400 font-mono pt-1">
          Certificate Number: {cert.certNumber || cert.id || 'MSN-XXXX-XXXXX'}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CertificateView() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError('');
      try {
        let res;
        if (certId) {
          res = await certificateService.getCertificateById(certId);
          if (!cancelled) setCert(res.data);
        } else {
          // No certId — load list of certificates
          res = await certificateService.getMyCertificates();
          if (!cancelled) setCert(res.data?.[0] || null); // show first one
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Certificate not found');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [certId]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`I just earned a certificate from MSN Academy!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-brand-crimson" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !cert) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Certificate of Completion
        </h1>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Award className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="font-display text-base font-bold text-slate-800">No Certificate Found</h3>
          <p className="mt-1 text-xs text-slate-500">
            {error || 'Complete a course to earn your certificate.'}
          </p>
          <Link
            to="/my-courses"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-5 py-2.5 text-xs font-semibold text-white"
          >
            Go to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Certificate of Completion
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your earned certificate for completing the {cert.courseTitle} course.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left — Certificate card */}
        <div className="lg:col-span-7">
          <CertificateCard cert={cert} />
        </div>

        {/* Right — Details panel + action buttons */}
        <div className="lg:col-span-5 space-y-4">
          {/* Certificate Details Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="font-display text-base font-bold text-slate-900">Certificate Details</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Student Name</p>
                <p className="font-semibold text-slate-900">{cert.studentName || '[Student Full Name]'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Course</p>
                <p className="font-semibold text-slate-900">{cert.courseTitle || '[Course Title Placeholder]'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Certificate ID</p>
                <p className="font-mono font-semibold text-slate-900">{cert.certNumber || cert.id || 'MSN-XXXX-XXXX'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Issue Date</p>
                <p className="font-semibold text-slate-900">{formatIssuedDate(cert.issuedAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>

            {/* View Full Screen */}
            <button
              onClick={() => document.getElementById('certificate-print')?.requestFullscreen?.()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
              <span>View Full Screen</span>
            </button>

            {/* Verify Certificate */}
            <Link
              to={`/verify?id=${cert.certNumber || cert.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify Certificate</span>
            </Link>

            {/* Share on LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share on LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
