import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, ArrowLeft, ArrowRight, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import {
  fetchCart,
  removeFromCart,
  applyPromoCode,
} from '../../features/cart/slice/cartSlice';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, appliedCoupon, subtotal, discount, total, currency, isLoading, error } =
    useSelector((state) => state.cart);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  // Load cart from server on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (courseId) => {
    setRemovingId(courseId);
    try {
      await dispatch(removeFromCart(courseId)).unwrap();
    } finally {
      setRemovingId(null);
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

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">Sign in to view your cart</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your cart is linked to your account. Please log in to see your saved courses.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-brand-crimson px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/courses"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
        </div>
        <div className="space-y-3.5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
              <div className="h-20 w-20 rounded-xl bg-slate-200 shrink-0" />
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
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-400 mb-3" />
        <p className="text-sm text-slate-600">{error}</p>
        <button
          onClick={() => dispatch(fetchCart())}
          className="mt-4 rounded-xl bg-brand-crimson px-5 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Shopping Cart
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-800">Your cart is empty</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Explore our catalog to find industry-focused vocational tech courses and start learning today.
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Item Cards List */}
          <div className="space-y-3.5">
            {items.map((item) => (
              <div
                key={item.courseId}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Rounded Thumbnail */}
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-slate-400" />
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <div className="font-display text-sm sm:text-base font-extrabold text-brand-crimson">
                      {currency} {Number(item.price).toLocaleString()}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-slate-400 line-through">
                        {currency} {Number(item.originalPrice).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.courseId)}
                  disabled={removingId === item.courseId}
                  aria-label={`Remove ${item.title}`}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {removingId === item.courseId ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-brand-crimson transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Promo Code Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Promo Code
            </h4>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                disabled={promoLoading}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              />
              <button
                type="submit"
                disabled={promoLoading}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors shrink-0 disabled:opacity-50"
              >
                {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
              </button>
            </form>

            {promoMessage && (
              <p className="mt-2 text-xs text-emerald-600 font-medium">{promoMessage}</p>
            )}
            {promoError && (
              <p className="mt-2 text-xs text-rose-500">{promoError}</p>
            )}
            {appliedCoupon && (
              <p className="mt-2 text-xs text-emerald-600 font-medium">
                ✓ Code <strong>{appliedCoupon.code}</strong> applied — {appliedCoupon.discountPercentage}% off
              </p>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 border-b border-slate-100 pb-4">
              {items.map((item) => (
                <div key={item.courseId} className="flex justify-between items-center">
                  <span className="truncate max-w-[200px]">{item.title}</span>
                  <span className="font-semibold text-slate-900 shrink-0 ml-4">
                    {currency} {Number(item.price).toLocaleString()}
                  </span>
                </div>
              ))}

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
              <span className="font-display text-xl font-extrabold text-brand-crimson">
                {currency} {Number(total).toLocaleString()}
              </span>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
