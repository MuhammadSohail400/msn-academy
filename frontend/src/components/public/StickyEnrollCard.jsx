import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Check, Video, Award, FileText, Infinity as InfinityIcon, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatPKR } from '../../utils/formatters';

export default function StickyEnrollCard({ course }) {
  const navigate = useNavigate();

  if (!course) return null;

  const {
    _id,
    slug,
    title,
    price = 0,
    originalPrice,
    durationHours = 0,
    totalLectures = 0,
  } = course;

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleEnroll = () => {
    // Navigate to checkout page with selected course info
    navigate(`/checkout?courseSlug=${slug}&courseId=${_id || ''}`);
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-brand-navy">
              {formatPKR(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-base text-gray-400 line-through">
                {formatPKR(originalPrice)}
              </span>
            )}
            {discountPercent && (
              <Badge variant="crimson" className="font-semibold">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" /> 7-Day Money-Back Guarantee
          </p>
        </div>

        {/* Enroll Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleEnroll}
          className="w-full text-base font-semibold shadow-lg"
        >
          Enroll Now & Start Learning
        </Button>

        {/* Includes List */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500">
            This Course Includes:
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2.5">
              <Video className="h-4 w-4 text-brand-crimson shrink-0" />
              <span>{durationHours > 0 ? `${durationHours} hours` : 'On-demand'} HD video lectures</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-brand-crimson shrink-0" />
              <span>120m Assessment & Verified Certificate</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-brand-crimson shrink-0" />
              <span>Downloadable code samples & guides</span>
            </li>
            <li className="flex items-center gap-2.5">
              <InfinityIcon className="h-4 w-4 text-brand-crimson shrink-0" />
              <span>Full lifetime access to curriculum</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4 text-brand-crimson shrink-0" />
              <span>Dedicated instructor Q&A support</span>
            </li>
          </ul>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500">
          <Check className="h-4 w-4 text-emerald-500" />
          <span>Instant access after enrollment</span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/95 px-4 py-3 shadow-modal backdrop-blur lg:hidden">
        <div>
          <div className="text-xs text-gray-500">Course Fee</div>
          <div className="font-display text-lg font-bold text-brand-navy">
            {formatPKR(price)}
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleEnroll}>
          Enroll Now
        </Button>
      </div>
    </>
  );
}

StickyEnrollCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    durationHours: PropTypes.number,
    totalLectures: PropTypes.number,
  }).isRequired,
};
