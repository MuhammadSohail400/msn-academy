import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Button from '../ui/Button';

export default function ExamHeader({
  courseTitle = 'Course Assessment',
  secondsLeft = 7200,
  onReviewSubmit,
  isSubmitting = false,
  showTimer = true,
  actionText = 'Review & Submit',
}) {
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft <= 300; // last 5 minutes

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-brand-navy px-4 sm:px-8 text-white shadow-md">
      {/* Left: Brand / Title */}
      <div className="flex items-center gap-3">
        <Link to="/my-courses" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-crimson font-display font-bold text-sm text-white shadow-sm">
            MSN
          </div>
          <span className="hidden sm:inline-block font-display text-sm font-semibold text-white group-hover:text-gray-200 transition-colors">
            {courseTitle.startsWith('Course Assessment') ? courseTitle : `Course Assessment: ${courseTitle}`}
          </span>
        </Link>
      </div>

      {/* Center: 120-minute countdown timer */}
      {showTimer && (
        <div
          className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-4 py-1.5 text-xs sm:text-base font-bold tabular-nums tracking-wide shadow-inner shrink-0 ${
            isLowTime
              ? 'bg-brand-crimson text-white animate-pulse'
              : 'bg-[#1a2942] text-white border border-[#2b3e5d]'
          }`}
          title="Time remaining for this assessment attempt"
        >
          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300" />
          <span>{formattedTime}</span>
        </div>
      )}

      {/* Right: Review & Submit button */}
      <div className="shrink-0">
        {onReviewSubmit && (
          <Button
            variant="primary"
            size="sm"
            onClick={onReviewSubmit}
            isLoading={isSubmitting}
            className="!bg-brand-crimson hover:!bg-brand-crimson-dark text-white font-medium px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md shadow-sm shrink-0"
          >
            {actionText}
          </Button>
        )}
      </div>
    </header>
  );
}

ExamHeader.propTypes = {
  courseTitle: PropTypes.string,
  secondsLeft: PropTypes.number,
  onReviewSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  showTimer: PropTypes.bool,
  actionText: PropTypes.string,
};
