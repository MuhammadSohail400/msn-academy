import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Search,
  Eye,
  X,
  CreditCard,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await adminService.getAdminOrders(params);
      if (res.success) {
        setOrders(res.data?.orders || res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const orderNo = (o.orderNumber || o._id || '').toLowerCase();
    const studentName = o.userId?.fullName?.toLowerCase() || '';
    const studentEmail = o.userId?.email?.toLowerCase() || '';
    return orderNo.includes(term) || studentName.includes(term) || studentEmail.includes(term);
  });

  const totalVolume = orders.reduce(
    (sum, o) => (o.status === 'COMPLETED' ? sum + (o.totalAmount || 0) : sum),
    0
  );
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Commercial Orders Master Ledger</h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Audit Trail
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track student checkouts, order invoices, and financial fulfillment statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Ledger</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Volume Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Total Orders Logged</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{orders.length}</span>
            <span className="text-xs text-slate-400">Lifetime checkouts</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Completed Volume</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">
              PKR {totalVolume.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">{completedCount} paid</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-medium text-slate-400">Pending Checkout Invoices</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Awaiting payment</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'COMPLETED', 'PENDING', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Invoices' : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, name..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Orders ({filteredOrders.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading orders ledger...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredOrders.map((o) => {
                  const status = o.status?.toUpperCase() || 'PENDING';
                  const orderNum = o.orderNumber || o._id?.slice(-8) || 'N/A';
                  const firstCourse = o.items?.[0]?.courseId?.title || o.items?.[0]?.title || 'Course Enrollment';

                  return (
                    <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        #{orderNum}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {o.userId?.fullName || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-400">{o.userId?.email || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="truncate block font-medium text-slate-200">
                          {firstCourse}
                        </span>
                        {o.items?.length > 1 && (
                          <span className="text-[10px] text-amber-400">
                            +{o.items.length - 1} more course(s)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-400 text-sm">
                        PKR {(o.totalAmount || 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {status === 'COMPLETED' && <CheckCircle2 className="h-3 w-3" />}
                          {status === 'PENDING' && <Clock className="h-3 w-3" />}
                          {status === 'CANCELLED' && <XCircle className="h-3 w-3" />}
                          {status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Order Invoice #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Customer Information
              </span>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-semibold text-white">
                  {selectedOrder.userId?.fullName || 'Student'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-slate-300">{selectedOrder.userId?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Order Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    selectedOrder.status === 'COMPLETED'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : selectedOrder.status === 'PENDING'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Ordered Items:</span>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 divide-y divide-slate-800/80">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white block">
                        {item.courseId?.title || item.title || 'Course'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Item ID: {item.courseId?._id || item.courseId || item._id}
                      </span>
                    </div>
                    <span className="font-bold text-amber-400">
                      PKR {(item.price || item.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Subtotal:</span>
                <span>PKR {(selectedOrder.subtotal || selectedOrder.totalAmount || 0).toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Discount Applied:</span>
                  <span>- PKR {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Net Total:</span>
                <span className="text-amber-400">
                  PKR {(selectedOrder.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
