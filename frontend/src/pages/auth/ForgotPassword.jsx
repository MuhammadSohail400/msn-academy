import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import authService from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [debugToken, setDebugToken] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldError('');

    if (!email.trim()) {
      setFieldError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      const token = res?.data?.debugResetToken || res?.debugResetToken;
      if (token) {
        setDebugToken(token);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
      {!submitted ? (
        <>
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                  fieldError
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
                }`}
              />
              {fieldError && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{fieldError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson text-sm font-bold text-white shadow-sm hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Instructions</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-navy transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-4 animate-in fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-2xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Check your email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            If an account exists for <span className="font-semibold text-slate-800">{email}</span>,
            we have sent instructions to reset your password.
          </p>


          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full rounded-xl bg-brand-navy py-3 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors shadow-sm"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
