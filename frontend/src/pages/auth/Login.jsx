import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function MsnLogo() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-5 w-7 items-center justify-center border border-white">
        <span className="text-[9px] font-semibold leading-none text-white">
          MSN
        </span>

        <span className="absolute -bottom-1 left-0 h-0.5 w-8 rotate-[-10deg] bg-brand-crimson" />
      </div>

      <span className="mt-1 text-[11px] leading-none text-white">
        Academy
      </span>
    </div>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    console.log('Login data:', formData);
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] md:flex md:flex-col md:items-center md:justify-center md:px-4 md:py-8">
      <section className="flex min-h-49 flex-col bg-brand-navy px-6 pb-8 pt-12 md:hidden">
        <MsnLogo />

        <div className="mt-auto text-center">
          <h1 className="font-display text-[22px] font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-[#9BA6BB]">
            Sign in to continue your learning
          </p>
        </div>
      </section>

      <div className="mb-8 hidden h-20 w-30 items-center justify-center rounded-2xl bg-brand-navy md:flex">
        <MsnLogo />
      </div>

      <section className="w-full px-6 py-5 md:max-w-112 md:rounded-2xl md:border md:border-[#E5E7EB] md:bg-white md:px-8 md:py-8 md:shadow-card">
        <div className="hidden md:block">
          <h2 className="font-display text-[24px] font-bold leading-8 text-brand-navy">
            Student Login
          </h2>

          <p className="mt-1.5 max-w-82 text-sm leading-5 text-[#A8B1C0]">
            Welcome back. Sign in to access your learning dashboard.
          </p>
        </div>

        <div className="space-y-3 md:hidden">
          <button
            type="button"
            className="flex h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-[#DCE2EA] bg-white text-sm font-semibold text-[#465166]"
          >
            <span className="text-[21px] font-bold text-[#4285F4]">G</span>
            Continue with Google
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-black text-sm font-semibold text-white"
          >
            <span className="text-[23px]">●</span>
            Continue with Apple
          </button>
        </div>

        <div className="my-9 flex items-center gap-3 md:hidden">
          <div className="h-px flex-1 bg-[#E3E7ED]" />
          <span className="text-xs text-[#A1ABBB]">or sign in with email</span>
          <div className="h-px flex-1 bg-[#E3E7ED]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:mt-7">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#697386]"
            >
              Email Address
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              label=""
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-11 rounded-md border-[#DCE2EA] px-4 py-2 text-sm placeholder:text-[#a6aebc]"
              required
            />
          </div>

          <div>
            <div className="my-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[#697386]"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-crimson hover:text-brand-crimson-hover"
              >
                Forgot Password?
              </Link>
            </div>

            <Input
              id="password"
              name="password"
              type="password"
              label=""
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="h-11 rounded-md border-[#DCE2EA] px-4 py-2 text-sm placeholder:text-[#a6aebc]"
              required
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-brand-crimson">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-13 w-full rounded-md bg-[#ED1C24] text-base font-bold shadow-none hover:bg-[#D71920] md:h-12 cursor-pointer"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-2 text-center text-xs text-[#7D889B] md:mt-6 md:text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-brand-crimson hover:text-brand-crimson-hover"
          >
            Create Account
          </Link>
        </p>
      </section>
    </div>
  );
}