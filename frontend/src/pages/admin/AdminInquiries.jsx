import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminInquiries({ limit: 50 });
      if (res.success) {
        setInquiries(res.data?.inquiries || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contact Inquiries CRM</h1>
          <p className="text-sm text-slate-400 mt-1">
            Student consultations, admission inquiries, and support leads.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Inquiries</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Inquiries Cards Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Inquiries ({inquiries.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No contact inquiries found.</div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((iq) => {
              const status = iq.status || 'NEW';
              return (
                <div
                  key={iq._id || iq.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{iq.name}</span>
                      <span className="text-xs text-slate-400">({iq.email})</span>
                      {iq.phone && (
                        <span className="text-xs text-slate-500">| {iq.phone}</span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-amber-400">{iq.subject}</div>
                    <p className="text-xs text-slate-400 line-clamp-2">{iq.message}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        status === 'RESOLVED' || status === 'CLOSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : status === 'IN_PROGRESS'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
