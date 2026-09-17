import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function OrderFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy shadow-lg">
        <img src="/logo.svg" alt="MSN Academy" className="h-10 w-10 object-contain" onError={(e) => { e.target.style.display='none'; }} />
        <span className="sr-only">MSN Academy</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-5">
        {/* Rose X icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
          <XCircle className="h-10 w-10 text-rose-500" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">
            Payment Failed
          </h1>
          <p className="text-sm font-semibold text-brand-crimson">
            Your payment could not be processed.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          No charge has been made. Please try again or choose a different payment method.
        </p>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry Payment</span>
          </button>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-navy py-3.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Change Payment Method</span>
          </button>
        </div>

        {/* Preview state switcher */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 mb-2">Preview payment states:</p>
          <div className="flex items-center justify-center gap-3 text-xs font-semibold">
            <Link to="/order/success" className="text-emerald-600 hover:underline">Success</Link>
            <span className="text-slate-300">·</span>
            <span className="text-rose-500">Failed</span>
            <span className="text-slate-300">·</span>
            <Link to="/order/pending" className="text-amber-500 hover:underline">Pending</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
