import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import authService from '../../services/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!password) {
      errors.password = 'New password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errors.password = 'Password must contain both letters and numbers';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your new password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!token) {
      setSubmitError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
      {!success ? (
        <>
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
              Reset Password
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Enter a new secure password for your student account.
            </p>
          </div>

          {!token && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>
                Missing reset token. Please use the link sent to your email or{' '}
                <Link to="/forgot-password" className="underline font-semibold">
                  request a new link
                </Link>
                .
              </span>
            </div>
          )}

          {submitError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="reset-new-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  placeholder="Minimum 8 characters"
                  className={`w-full h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 pr-11 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                  }}
                  placeholder="Re-enter your new password"
                  className={`w-full h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 pr-11 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson text-sm font-bold text-white shadow-sm hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4 animate-in fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-2xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Password Updated
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Your password has been reset successfully. You can now sign in with your new credentials.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center w-full rounded-xl bg-brand-navy py-3 text-sm font-semibold text-white hover:bg-brand-navy/90 transition-colors shadow-sm"
            >
              Proceed to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
