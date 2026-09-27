import React, { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminPayments({ limit: 50 });
      if (res.success) {
        setPayments(res.data?.payments || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Payment Verification Desk</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit bank transfer deposit receipts and review payment ledger.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Payments</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Payments ({payments.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading payment ledger...</div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reference / Slip</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {payments.map((p) => {
                  const status = p.status?.toUpperCase() || 'PENDING';
                  return (
                    <tr key={p._id || p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-white">{p.userId?.fullName || 'Student'}</div>
                        <div className="text-[11px] text-slate-500">{p.userId?.email || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-amber-400">
                        PKR {(p.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.method || 'BANK'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            status === 'VERIFIED' || status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : status === 'SUBMITTED' || status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        {p.transactionReference || p.bankReference || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
