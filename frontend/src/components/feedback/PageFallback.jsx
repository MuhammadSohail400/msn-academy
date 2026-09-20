import React from 'react';

export default function PageFallback() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-8">
      {/* Subtle brand spinner */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full border-2 border-slate-200" />
        <div className="absolute h-12 w-12 rounded-full border-2 border-brand-crimson border-t-transparent animate-spin" />
        <span className="font-display text-[10px] font-bold text-brand-navy">MSN</span>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">Loading page...</p>
    </div>
  );
}
