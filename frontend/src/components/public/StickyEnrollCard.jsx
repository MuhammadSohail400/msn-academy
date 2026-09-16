import React, { useState } from 'react';
import { Play, Check, ShoppingCart, CheckCircle2, ShieldCheck, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/slice/cartSlice';

export default function StickyEnrollCard({ course }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [addError, setAddError] = useState('');

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const id = course?.id || course?._id || '';
  const price = course?.price ?? 0;
  const currency = course?.currency || 'PKR';
  const durationHours = course?.durationHours || 0;
  const thumbnail =
    course?.thumbnail ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop';
  const previewVideoUrl = course?.previewVideoUrl || null;

  const isInCart = cartItems.some((item) => item.courseId === id);
  const isEnrolled = course?.isEnrolled === true;

  const handleEnrollNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/checkout?courseId=${id}`);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (isInCart) { navigate('/cart'); return; }
    try {
      setAddingToCart(true);
      setAddError('');
      await dispatch(addToCart(id)).unwrap();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      setAddError(err || 'Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Video Thumbnail with Circular Play Button */}
        <div className="relative aspect-video w-full bg-slate-900 group cursor-pointer" onClick={() => setModalOpen(true)}>
          <img src={thumbnail} alt="Course preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 fill-slate-900 ml-1" />
            </div>
          </div>
        </div>

        {/* Pricing & CTA Body */}
        <div className="p-6 space-y-5">
          <div className="font-display text-3xl font-extrabold text-slate-900">
            {currency} {Number(price).toLocaleString()}
          </div>

          {addError && (
            <p className="text-xs text-rose-500">{addError}</p>
          )}

          <div className="space-y-2.5">
            {isEnrolled ? (
              <button
                onClick={() => navigate('/my-courses')}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Go to My Courses
              </button>
            ) : (
              <>
                <button
                  onClick={handleEnrollNow}
                  className="w-full rounded-xl bg-brand-crimson py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
                >
                  Enroll Now
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-center text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  {addingToCart ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  <span>
                    {addedSuccess ? '✓ Added to Cart!' : isInCart ? 'View Cart' : 'Add to Cart'}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Inclusions Checklist */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5">
              This Course Includes:
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{durationHours} hours of on-demand video</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Downloadable resources and datasets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Certificate of Completion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Lifetime access</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Self-paced learning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Video Modal Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-black overflow-hidden shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full flex items-center justify-center">
              {previewVideoUrl ? (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                />
              ) : (
                <div className="text-center text-white/60 p-8">
                  <p className="text-sm">Preview video is not available for this course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
