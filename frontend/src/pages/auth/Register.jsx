import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { registerUser } from '../../features/auth/slice/authSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain both letters and numbers';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Use and Privacy Policy';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    try {
      await dispatch(
        registerUser({
          fullName,
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: formData.phoneNumber.trim() || undefined,
        })
      ).unwrap();

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200/90 shadow-sm p-8 sm:p-10 transition-all">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
          Create Account
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Join MSN Academy and start learning today.
        </p>
      </div>

      {/* Social Auth Buttons matching Figma Create Account.png */}
      <div className="space-y-2.5 mb-6">
        <button
          type="button"
          onClick={() => setSubmitError('Social sign-up with Google will be enabled soon. Please register using email.')}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          {/* Google G Logo */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => setSubmitError('Social sign-up with Apple will be enabled soon. Please register using email.')}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-black py-3 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-2xs"
        >
          {/* Apple Logo */}
          <svg className="h-4 w-4 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.3-9.58-11.2-20.35-14.7-32.32-3.51-11.97-5.26-23.01-5.26-33.12 0-14.88 3.72-27.21 11.16-37 7.44-9.79 17.06-14.79 28.86-15.01 5.38 0 11.45 1.48 18.21 4.44 6.76 2.96 10.99 4.49 12.69 4.59 1.34 0 5.66-1.57 12.96-4.71 7.3-3.14 13.49-4.53 18.57-4.17 14.15 1.02 25.13 6.64 32.94 16.85-12.39 7.45-18.42 17.65-18.09 30.61.32 10.22 4.24 18.73 11.76 25.53 7.52 6.8 16.48 10.66 26.88 11.59-2.34 7.23-5.29 14.54-8.86 21.94zM119.22 31.84c0-7.25 2.65-13.98 7.95-20.19 5.3-6.21 11.83-10.26 19.59-12.15.54 2.11.81 4.14.81 6.09 0 7.26-2.82 14.28-8.46 21.06-5.64 6.78-12.37 10.74-20.19 11.88-.27-2.2-.42-4.13-.42-6.69z" />
          </svg>
          <span>Continue with Apple</span>
        </button>
      </div>

      {/* Global Error Alert */}
      {submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name Fields (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="First name"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                fieldErrors.firstName
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
              }`}
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Last name"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                fieldErrors.lastName
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
              }`}
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                : 'border-slate-200 focus:border-brand-crimson focus:ring-brand-crimson/20'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="+92 XXX XXX XXXX"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Minimum 8 characters"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 pr-11 transition-all focus:outline-none focus:ring-2 ${
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
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 pr-11 transition-all focus:outline-none focus:ring-2 ${
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
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-crimson focus:ring-brand-crimson"
            />
            <span className="text-xs text-slate-500 leading-normal">
              I agree to the{' '}
              <a href="#" className="text-brand-crimson hover:underline font-medium">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-crimson hover:underline font-medium">
                Privacy Policy
              </a>
            </span>
          </label>
          {fieldErrors.agreeTerms && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{fieldErrors.agreeTerms}</p>
          )}
        </div>

        {/* Create Account CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-bold text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors ml-1"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
