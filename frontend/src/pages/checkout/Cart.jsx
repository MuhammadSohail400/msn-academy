import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { XCircle, ArrowLeft, ArrowRight, ShoppingBag, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import {
  fetchCart,
  removeFromCart,
  emptyCart,
  applyPromoCode,
} from '../../features/cart/slice/cartSlice';

const CATEGORY_BADGES = {
  'Data Science': 'bg-amber-100 text-amber-800',
  'Design': 'bg-purple-100 text-purple-700',
  'Web Development': 'bg-emerald-100 text-emerald-700',
  'Marketing': 'bg-pink-100 text-pink-700',
  'Artificial Intelligence': 'bg-indigo-100 text-indigo-700',
  'Productivity': 'bg-cyan-100 text-cyan-700',
};

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, appliedCoupon, subtotal, discount, total, currency, isLoading, error } =
    useSelector((state) => state.cart);

  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  // Load cart from server on mount for both guest and authenticated users
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = async (courseId) => {
    setRemovingId(courseId);
    try {
      await dispatch(removeFromCart(courseId)).unwrap();
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await dispatch(emptyCart()).unwrap();
    } finally {
      setClearing(false);
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMessage('');
    setPromoError('');
    try {
      const data = await dispatch(applyPromoCode(promoCode.trim().toUpperCase())).unwrap();
      setPromoMessage(`Promo applied: ${data.discountPercentage}% off (–${currency} ${data.discountAmount?.toLocaleString()})`);
      setPromoCode('');
    } catch (err) {
      setPromoError(err || 'Invalid or expired promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading && items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
        </div>
        <div className="space-y-3.5 max-w-2xl">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
        <p className="text-sm text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchCart())}
          className="rounded-xl bg-brand-crimson px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-crimson-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {items.length} {items.length === 1 ? 'course' : 'courses'} in your cart
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            disabled={clearing}
            onClick={handleClearAll}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer disabled:opacity-50"
            title="Clear all courses from cart"
          >
            <Trash2 className="h-4 w-4" />
            <span>{clearing ? 'Clearing...' : 'Clear All'}</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs max-w-xl mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">Your cart is empty</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Explore our catalog to find industry-focused vocational tech courses and start learning today.
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.courseId}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rounded Thumbnail */}
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
                        MSN
                      </div>
                    )}

                    {/* Details */}
                    <div className="min-w-0 space-y-1">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${CATEGORY_BADGES[item.category] || 'bg-amber-100 text-amber-800'}`}>
                        {item.badge || item.category || 'BESTSELLER'}
                      </span>
                      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-base sm:text-lg font-bold text-brand-crimson">
                          {currency} {Number(item.price).toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {currency} {Number(item.originalPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Circular Remove Button */}
                  <button
                    onClick={() => handleRemove(item.courseId)}
                    disabled={removingId === item.courseId}
                    aria-label={`Remove ${item.title}`}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {removingId === item.courseId ? (
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    ) : (
                      <XCircle className="h-6 w-6 stroke-[1.5]" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-crimson transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Promo Code + Order Summary */}
          <div className="lg:col-span-4 space-y-5 sticky top-28">
            {/* Promo Code Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Promo Code
              </h4>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  disabled={promoLoading}
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoCode.trim()}
                  className="h-11 rounded-xl border border-slate-900 bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                </button>
              </form>

              {promoMessage && (
                <p className="mt-2.5 text-xs text-emerald-600 font-medium">{promoMessage}</p>
              )}
              {promoError && (
                <p className="mt-2.5 text-xs text-rose-500 font-medium">{promoError}</p>
              )}
              {appliedCoupon && (
                <p className="mt-2.5 text-xs text-emerald-600 font-medium">
                  ✓ Code <strong>{appliedCoupon.code}</strong> applied — {appliedCoupon.discountPercentage}% off
                </p>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-slate-900">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 border-b border-slate-100 pb-4">
                {items.map((item) => (
                  <div key={item.courseId} className="flex justify-between items-center">
                    <span className="truncate pr-3">{item.title}</span>
                    <span className="font-semibold text-slate-900 shrink-0">
                      {currency} {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-1">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {currency} {Number(subtotal).toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>– {currency} {Number(discount).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-display text-base font-bold text-slate-900">Total</span>
                <span className="font-display text-2xl font-extrabold text-brand-crimson">
                  {currency} {Number(total).toLocaleString()}
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson text-sm font-bold text-white shadow-sm hover:bg-brand-crimson-hover transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
