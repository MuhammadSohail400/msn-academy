import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import authService from '../../services/authService';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailParam = searchParams.get('email') || '';
  const codeParam = searchParams.get('code') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [debugCode, setDebugCode] = useState(codeParam || '');

  // Sync state if query parameters change
  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (codeParam) setCode(codeParam);
  }, [emailParam, codeParam]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-submit if both email and 6-digit code are present in URL
  useEffect(() => {
    if (emailParam && codeParam && codeParam.length === 6 && !isSuccess && !error && !loading) {
      handleVerify(null, emailParam, codeParam);
    }
  }, [emailParam, codeParam]);

  const handleVerify = async (e, targetEmail = email, targetCode = code) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanEmail = targetEmail.trim().toLowerCase();
    const cleanCode = targetCode.trim();

    if (!cleanEmail) {
      setError('Please provide your email address.');
      return;
    }

    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyEmail(cleanEmail, cleanCode);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err?.message ||
          'Invalid or expired verification code. Please request a new code.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError('');
    setInfoMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your email address to receive a new code.');
      return;
    }

    setResending(true);
    try {
      const res = await authService.resendVerification(cleanEmail);
      const codeFromDev = res?.data?.debugVerificationCode || res?.debugVerificationCode;
      if (codeFromDev) {
        setDebugCode(codeFromDev);
      }
      setInfoMessage('A fresh 6-digit verification code has been dispatched to your email.');
      setCooldown(60);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err?.message ||
          'Failed to resend verification code. Please try again later.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
      {!isSuccess ? (
        <>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
              Verify Your Email
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              We sent a 6-digit verification code to your email. Enter it below to activate your MSN Academy student account.
            </p>
          </div>

          {debugCode && (
            <div className="mb-5 rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 text-left animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">
                  🛠️ Dev Mode Code:{' '}
                  <span className="font-mono text-sm font-bold tracking-widest text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200 ml-1">
                    {debugCode}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCode(debugCode);
                    setError('');
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                >
                  Auto-fill →
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={(e) => handleVerify(e)} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="verify-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="verify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="verify-code"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                6-Digit Verification Code
              </label>
              <input
                id="verify-code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="h-13 w-full text-center tracking-[8px] font-mono text-xl font-bold rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full h-11 flex items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-700 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Account...
                </>
              ) : (
                'Verify & Activate Account'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                {resending && <RefreshCw className="h-3 w-3 animate-spin" />}
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
              </button>
            </p>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Email Verified Successfully!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your MSN Academy account is now active and verified. You can now access all course materials, assessments, and certifications.
          </p>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full h-11 flex items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-700 shadow-sm cursor-pointer"
            >
              Go to Student Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
