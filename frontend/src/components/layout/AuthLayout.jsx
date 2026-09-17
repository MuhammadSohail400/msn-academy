import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Back to Website link */}
      <div className="w-full max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Website</span>
        </Link>
      </div>

      {/* Centered Brand Logo & Auth Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-4">
        {/* MSN Academy Navy Badge Logo */}
        <Link to="/" className="mb-6 flex flex-col items-center group">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-white shadow-md border border-white/10 transition-transform group-hover:scale-105">
            <div className="flex flex-col items-center">
              <div className="border border-white/30 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider leading-none">
                MSN
              </div>
              <span className="text-[9px] tracking-widest uppercase mt-0.5 text-slate-300 font-medium leading-none">
                Academy
              </span>
            </div>
          </div>
        </Link>

        {/* Child Auth Card */}
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
