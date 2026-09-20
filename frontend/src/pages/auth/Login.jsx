import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser } from '../../features/auth/slice/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const isSignedOut = searchParams.get('signedOut') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setSubmitError(err || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-3xl bg-white border border-slate-200/90 shadow-sm p-5 sm:p-8 transition-all">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
          Student Login
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Welcome back. Sign in to access your learning dashboard.
        </p>
      </div>

      {/* Sign Out Success Alert */}
      {isSignedOut && !submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
          <span>You have been signed out successfully.</span>
        </div>
      )}

      {/* Global Error Alert */}
      {submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
        {/* Email Address */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
            }}
            placeholder="you@example.com"
            autoComplete="off"
            className={`w-full h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${fieldErrors.email
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
              }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
              }}
              placeholder="Enter your password"
              autoComplete="new-password"
              className={`w-full h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 pr-11 transition-all focus:outline-none focus:ring-2 ${fieldErrors.password
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Sign In CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson text-sm font-bold text-white shadow-sm hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <span>Don't have an account? </span>
        <Link
          to="/register"
          className="font-bold text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors ml-1"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
