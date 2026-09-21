import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { closeCartDrawer } from '../../store/slices/uiSlice';
import {
  removeFromCart,
  emptyCart,
  applyPromoCode,
} from '../../features/cart/slice/cartSlice';

export default function CartDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.ui?.isCartDrawerOpen ?? false);
  const { items, subtotal, discount, total, currency, appliedCoupon } = useSelector(
    (state) => state.cart
  );
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);

  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleRemove = async (courseId) => {
    if (!courseId) return;
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
      setPromoMessage(`Promo applied: ${data.discountPercentage}% off`);
      setPromoCode('');
    } catch (err) {
      setPromoError(err || 'Invalid or expired promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleProceedCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Shopping Cart
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {items?.length || 0} {items?.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <div className="flex items-center gap-2">
              {items && items.length > 0 && (
                <button
                  type="button"
                  disabled={clearing}
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors px-2 py-1 rounded hover:bg-rose-50 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Remove all items from cart"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{clearing ? 'Clearing...' : 'Clear all'}</span>
                </button>
              )}
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {(!items || items.length === 0) ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-800">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our industry-standard courses and accelerate your tech career.
                </p>
                <button
                  onClick={() => {
                    handleClose();
                    navigate('/courses');
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-crimson px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-crimson-hover transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              items.map((item) => {
                const courseId = item.courseId || item._id || item.id || item.course?._id || item.course?.id;
                const isRemoving = removingId === courseId;
                const thumbnail = item.thumbnail || item.course?.thumbnail;
                const title = item.title || item.course?.title;
                const price = item.price ?? item.course?.price ?? 0;
                const category = item.category || item.course?.category;

                return (
                  <div
                    key={courseId || Math.random()}
                    className="relative flex items-center gap-3.5 rounded-xl border border-slate-200/80 p-3.5 bg-white shadow-2xs hover:border-slate-300 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-brand-navy/5 text-brand-navy font-bold text-xs">
                          MSN
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      {category && (
                        <span className="inline-block rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                          {category}
                        </span>
                      )}
                      <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {title}
                      </h4>
                      <p className="mt-1 font-bold text-sm text-brand-crimson">
                        {currency} {Number(price).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => handleRemove(courseId)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
                      title="Remove course"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })
            )}

            {/* Promo Code Form */}
            {items && items.length > 0 && (
              <div className="mt-6 rounded-xl border border-slate-200/80 p-4 bg-slate-50/50">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  PROMO CODE
                </label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs uppercase font-mono text-slate-800 placeholder:text-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading || !promoCode.trim()}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    {promoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                  </button>
                </form>
                {promoMessage && (
                  <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {promoMessage}
                  </p>
                )}
                {promoError && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {promoError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer with Summary & Checkout CTA */}
          {items && items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {currency} {subtotal?.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>
                      –{currency} {discount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-brand-crimson text-base font-extrabold">
                    {currency} {total?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-crimson text-sm font-bold text-white shadow-sm hover:bg-brand-crimson-hover transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <Link
                  to="/cart"
                  onClick={handleClose}
                  className="hover:text-brand-navy hover:underline font-medium"
                >
                  View full cart page
                </Link>
                <button
                  type="button"
                  onClick={handleClose}
                  className="hover:text-slate-800 font-medium"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
