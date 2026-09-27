import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminOrders({ limit: 50 });
      if (res.success) {
        setOrders(res.data?.orders || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Commercial Orders Ledger</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track student checkouts, order statuses, and transaction amounts.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Orders</span>
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
            Total Orders ({orders.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading orders ledger...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                      {o.orderNumber || o._id?.slice(-8) || 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-white">{o.userId?.fullName || 'Student'}</div>
                      <div className="text-[11px] text-slate-500">{o.userId?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {o.items?.length || 1} course(s)
                    </td>
                    <td className="py-3 px-3 font-semibold text-amber-400">
                      PKR {(o.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : o.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {o.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
