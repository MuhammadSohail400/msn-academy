import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// Centered Card & Minimal Header — wraps M1's login/register/forgot-password pages
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="px-4 py-5 sm:px-6">
        <Link to="/" className="font-display text-lg font-semibold text-brand-navy">
          MSN Academy
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
