import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader2, AlertCircle, ShoppingBag, X } from 'lucide-react';
import orderService from '../../services/orderService';

const STATUS_TABS = ['All Orders', 'Completed', 'Pending', 'Failed'];

const STATUS_MAP = {
  'All Orders': null,
  'Completed': 'COMPLETED',
  'Pending': 'PENDING',
  'Failed': 'FAILED',
};

const STATUS_BADGE = {
  COMPLETED: 'text-emerald-600',
  PENDING: 'text-amber-500',
  UNDER_REVIEW: 'text-sky-600',
  FAILED: 'text-rose-500',
  CANCELLED: 'text-slate-400',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Order Receipt Modal ───────────────────────────────────────────────────────
function OrderReceiptModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await orderService.getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="font-display text-base font-bold text-slate-900 mb-5">Order Details</h3>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand-crimson" />
          </div>
        )}
        {error && (
          <p className="text-sm text-rose-600 py-4 text-center">{error}</p>
        )}
        {order && !loading && (
          <div className="space-y-4">
            {/* Meta */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number</span>
                <span className="font-mono font-semibold text-slate-800">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-semibold ${STATUS_BADGE[order.status] || 'text-slate-600'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-semibold text-slate-800">
                  {order.paymentMethod?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Courses
              </h4>
              <div className="space-y-2">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-700">
                    <span className="truncate pr-3">{item.title}</span>
                    <span className="font-semibold shrink-0">
                      {order.currency} {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>– {order.currency} {Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Total</span>
                <span>{order.currency} {Number(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await orderService.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Client-side filter by status tab
  const filtered = orders.filter((order) => {
    const statusFilter = STATUS_MAP[activeTab];
    if (!statusFilter) return true;
    return order.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Order History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage all your orders in one place
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-brand-crimson text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-crimson" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button onClick={loadOrders} className="ml-2 text-xs font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ShoppingBag className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="font-display text-base font-bold text-slate-800">No orders yet</h3>
          <p className="mt-1 text-xs text-slate-500">
            {activeTab === 'All Orders'
              ? 'Your order history will appear here after your first purchase.'
              : `No ${activeTab.toLowerCase()} orders found.`}
          </p>
        </div>
      )}

      {/* Order Cards */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left — course/order info */}
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {/* Show first item title if available, else order number */}
                    {order.firstCourseTitle || order.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{order.orderNumber}</p>
                </div>

                {/* Center — date */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>

                {/* Right — amount + status */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-display text-sm font-extrabold text-slate-900">
                    {order.currency || 'PKR'} {Number(order.totalAmount).toLocaleString()}
                  </span>
                  <span className={`text-xs font-bold ${STATUS_BADGE[order.status] || 'text-slate-500'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* View Details button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setSelectedOrderId(order.id)}
                  className="rounded-xl border border-slate-300 px-8 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Receipt Modal */}
      {selectedOrderId && (
        <OrderReceiptModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
