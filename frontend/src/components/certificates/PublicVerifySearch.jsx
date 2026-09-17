import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';

export default function PublicVerifySearch({ onSearch, loading, initialValue = '' }) {
  const [certId, setCertId] = useState(initialValue);

  useEffect(() => {
    if (initialValue) {
      setCertId(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanId = certId.trim();
    if (cleanId) {
      onSearch(cleanId);
    }
  };

  const handleChipClick = (sampleId) => {
    setCertId(sampleId);
    onSearch(sampleId);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="cert-id-input"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2.5"
        >
          Certificate ID
        </label>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              id="cert-id-input"
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. MSN-DEMO-0001"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm sm:text-base font-mono font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 transition-all pr-10"
            />
            {certId && (
              <button
                type="button"
                onClick={() => setCertId('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !certId.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Sample Chips */}
        <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-slate-500">
          <span>Try:</span>
          <button
            type="button"
            onClick={() => handleChipClick('MSN-DEMO-0001')}
            className="font-mono text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors focus:outline-none font-medium"
          >
            MSN-DEMO-0001
          </button>
          <span className="text-slate-300">or</span>
          <button
            type="button"
            onClick={() => handleChipClick('MSN-DEMO-0002')}
            className="font-mono text-brand-crimson hover:text-brand-crimson-hover hover:underline transition-colors focus:outline-none font-medium"
          >
            MSN-DEMO-0002
          </button>
        </div>
      </form>
    </div>
  );
}
