import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, BookOpen } from 'lucide-react';

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderNumber = state?.orderNumber || '';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy shadow-lg">
        <img src="/logo.svg" alt="MSN Academy" className="h-10 w-10 object-contain" onError={(e) => { e.target.style.display='none'; }} />
        <span className="sr-only">MSN Academy</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-5">
        {/* Green checkmark icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">
            Payment Successful!
          </h1>
          <p className="text-sm font-semibold text-brand-crimson">
            Your enrollment is confirmed.
          </p>
          {orderNumber && (
            <p className="text-xs text-slate-400 font-mono">{orderNumber}</p>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          You're all set. Your course has been added to your student dashboard.
          Start learning right now.
        </p>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/my-courses')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-navy py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Start Learning</span>
          </button>
        </div>

        {/* Preview state switcher */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 mb-2">Preview payment states:</p>
          <div className="flex items-center justify-center gap-3 text-xs font-semibold">
            <span className="text-emerald-600">Success</span>
            <span className="text-slate-300">·</span>
            <Link to="/order/failed" className="text-rose-500 hover:underline">Failed</Link>
            <span className="text-slate-300">·</span>
            <Link to="/order/pending" className="text-amber-500 hover:underline">Pending</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
