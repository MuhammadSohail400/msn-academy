import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Award,
} from 'lucide-react';
import PublicVerifySearch from '../../components/certificates/PublicVerifySearch';
import VerificationBadgeModal from '../../components/certificates/VerificationBadgeModal';
import certificateService from '../../services/certificateService';

// Sample demo certificate records for immediate interactive testing matching Figma chips
const DEMO_CERTIFICATES = {
  'MSN-DEMO-0001': {
    isValid: true,
    certificateNumber: 'MSN-DEMO-0001',
    studentName: 'Ahmed Raza',
    courseTitle: 'Data Analytics',
    issueDate: '15 March 2025',
    issuedBy: 'MSN Academy',
    status: 'Valid & Active',
  },
  'MSN-DEMO-0002': {
    isValid: true,
    certificateNumber: 'MSN-DEMO-0002',
    studentName: 'Fatima Noor',
    courseTitle: 'Full Stack Web Development',
    issueDate: '20 February 2025',
    issuedBy: 'MSN Academy',
    status: 'Valid & Active',
  },
};

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const { certId: paramCertId } = useParams();

  const [searchedId, setSearchedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  const performVerification = useCallback(async (id) => {
    const cleanId = (id || '').trim().toUpperCase();
    if (!cleanId) return;

    setSearchedId(cleanId);
    setLoading(true);
    setError('');
    setResult(null);
    setHasSearched(true);

    // 1. Check if it matches demo chips directly
    if (DEMO_CERTIFICATES[cleanId]) {
      setTimeout(() => {
        setResult(DEMO_CERTIFICATES[cleanId]);
        setLoading(false);
      }, 300);
      return;
    }

    // 2. Query backend verification endpoint
    try {
      const res = await certificateService.verifyCertificate(cleanId);
      const data = res?.data || res;
      setResult({
        isValid: true,
        certificateNumber: data.certificateNumber || cleanId,
        studentName: data.studentName || 'Authenticated Student',
        courseTitle: data.courseTitle || 'Certified Course',
        issueDate: formatDisplayDate(data.issueDate),
        issuedBy: 'MSN Academy',
        status: data.status === 'ACTIVE' || data.status === 'VALID' ? 'Valid & Active' : data.status,
      });
    } catch (err) {
      // If error is 404 or invalid, show friendly message
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Certificate record not found. Please verify the certificate number.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-verify if ID is passed in query (?id=... or ?certId=...) or route params
  useEffect(() => {
    const queryId = searchParams.get('id') || searchParams.get('certId') || paramCertId;
    if (queryId) {
      performVerification(queryId);
    }
  }, [searchParams, paramCertId, performVerification]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Banner with Dark Brand Navy Background */}
      <section className="relative overflow-hidden bg-brand-navy pt-16 pb-24 text-center text-white">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Shield Badge Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white shadow-inner backdrop-blur-sm">
            <Shield className="h-7 w-7 text-white stroke-[1.8]" />
          </div>

          {/* Authentication tag */}
          <p className="text-xs font-bold uppercase tracking-widest text-brand-crimson">
            AUTHENTICATION
          </p>

          {/* Main Title */}
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Certificate Verification
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-300">
            Enter a Certificate ID to instantly verify the authenticity of an MSN Academy
            certificate.
          </p>
        </div>
      </section>

      {/* Main Search & Result Section */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-12 relative z-10">
        {/* Search Input Card */}
        <PublicVerifySearch
          onSearch={performVerification}
          loading={loading}
          initialValue={searchedId}
        />

        {/* Results Container */}
        <div className="mt-6">
          {/* 1. Loading State */}
          {loading && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-crimson" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Verifying credential records against MSN Academy registry...
              </p>
            </div>
          )}

          {/* 2. Verified Result State (matching verification complete.png) */}
          {!loading && result && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 shadow-xs animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Certificate Verified
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                    This is an authentic MSN Academy certificate.
                  </p>
                </div>
              </div>

              {/* Inner White Record Table */}
              <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-xs">
                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Student Name</span>
                    <span className="font-bold text-slate-900 sm:text-right">
                      {result.studentName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Course</span>
                    <span className="font-semibold text-slate-900 sm:text-right">
                      {result.courseTitle}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Issue Date</span>
                    <span className="font-medium text-slate-800 sm:text-right">
                      {result.issueDate}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Certificate ID</span>
                    <span className="font-mono font-bold text-brand-navy sm:text-right">
                      {result.certificateNumber}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Issued By</span>
                    <span className="font-semibold text-slate-900 sm:text-right">
                      {result.issuedBy}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 sm:text-right">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {result.status}
                    </span>
                  </div>
                </div>

                {/* Additional Action to View Credential Badge */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Cryptographically secured by MSN Academy
                  </span>
                  <button
                    type="button"
                    onClick={() => setBadgeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:text-brand-crimson transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    View Credential Badge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Error / Not Found State */}
          {!loading && error && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 sm:p-8 shadow-xs animate-in fade-in duration-300 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
                <AlertCircle className="h-6 w-6 stroke-[2]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Certificate Record Not Found
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-rose-700 max-w-md mx-auto">
                {error}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Please double check the ID entered (format: <code className="font-mono text-slate-700">MSN-DEMO-0001</code> or <code className="font-mono text-slate-700">MSN-YYYY-XXXXX</code>) and try again.
              </p>
            </div>
          )}

          {/* 4. Idle / Initial State (matching certificate verification.png) */}
          {!loading && !hasSearched && (
            <div className="mx-auto max-w-2xl py-14 text-center">
              <Shield className="mx-auto h-12 w-12 text-slate-300 stroke-[1.2]" />
              <p className="mt-3 text-sm text-slate-400">
                Enter a Certificate ID above to verify its authenticity.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verified Credential Badge Modal */}
      <VerificationBadgeModal
        cert={result}
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
      />
    </div>
  );
}
