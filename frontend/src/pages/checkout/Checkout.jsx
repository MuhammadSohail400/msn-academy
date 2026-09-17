import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ChevronRight,
  Lock,
  Landmark,
  Smartphone,
  CreditCard,
  Loader2,
  AlertCircle,
  ShieldCheck,
  User,
} from 'lucide-react';
import orderService from '../../services/orderService';

const PAYMENT_METHODS = [
  {
    id: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Direct transfer to MSN Academy bank account',
    icon: Landmark,
  },
  {
    id: 'EASYPAISA',
    label: 'Easypaisa',
    description: 'Pay via Easypaisa mobile account',
    icon: Smartphone,
  },
  {
    id: 'JAZZCASH',
    label: 'JazzCash',
    description: 'Pay via JazzCash mobile account',
    icon: CreditCard,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, discount, total, currency, appliedCoupon } = useSelector(
    (state) => state.cart
  );
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <User className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900">Sign in to checkout</h1>
        <p className="mt-2 text-sm text-slate-500">You need to be logged in to place an order.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login?redirect=/checkout"
            className="rounded-xl bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            Existing Student Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Guard: empty cart
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Add some courses before checking out.</p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!agreed) {
      setError('Please agree to the Terms of Use and Refund Policy to continue.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await orderService.checkout(paymentMethod, notes);
      const { order, paymentDetails } = res.data;
      // Navigate to pending page with order info in state
      navigate('/order/pending', {
        state: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          currency: order.currency,
          paymentMethod: order.paymentMethod,
          paymentDetails,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/cart" className="hover:text-slate-800">Cart</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-800">Checkout</span>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-5">

            {/* 1. Account card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-brand-crimson" />
                <h2 className="font-display text-base font-bold text-slate-900">Account</h2>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white text-sm font-bold shrink-0">
                    {user?.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 rounded-xl bg-brand-navy py-3 text-sm font-semibold text-white hover:bg-brand-navy/90">
                    Guest Checkout
                  </button>
                  <button className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Existing Student Sign In
                  </button>
                </div>
              )}
            </div>

            {/* 2. Account Information (pre-filled for logged in users) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-slate-900 mb-5">
                Account Information
              </h2>

              <div className="space-y-4">
                {/* First / Last Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName?.split(' ')[0] || ''}
                      placeholder="First name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName?.split(' ').slice(1).join(' ') || ''}
                      placeholder="Last name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Your course access details will be sent to this email.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || ''}
                    placeholder="+92 XXX XXX XXXX"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-brand-crimson" />
                <h2 className="font-display text-base font-bold text-slate-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-brand-crimson bg-rose-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Radio button */}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 transition-colors ${
                          isSelected ? 'border-brand-crimson' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-brand-crimson" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{method.label}</p>
                        <p className="text-xs text-slate-500">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Optional notes */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={250}
                  placeholder="e.g. Payment will be sent via Meezan Bank"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson resize-none"
                />
              </div>
            </div>

            {/* 4. Terms Agreement */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
                  className="mt-0.5 h-4 w-4 accent-brand-crimson rounded"
                />
                <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  I agree to MSN Academy's{' '}
                  <Link to="/terms" className="font-semibold text-brand-crimson hover:underline">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link to="/refund" className="font-semibold text-brand-crimson hover:underline">
                    Refund Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ── Right column: Order Summary ──────────────────────────── */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="font-display text-base font-bold text-slate-900">Order Summary</h3>

              {/* Course items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.courseId} className="flex items-center gap-3">
                    {/* Thumbnail */}
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-slate-200 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.category || ''}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {currency} {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Discount</span>
                    <span className="text-emerald-600 font-medium">
                      – {currency} {Number(discount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-display text-sm font-bold text-slate-900">Total</span>
                  <span className="font-display text-lg font-extrabold text-brand-navy">
                    {currency} {Number(total).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>
                  {submitting
                    ? 'Placing Order…'
                    : `Place Order · ${currency} ${Number(total).toLocaleString()}`}
                </span>
              </button>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
