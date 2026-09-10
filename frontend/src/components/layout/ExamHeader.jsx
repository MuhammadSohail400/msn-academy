import React from 'react';
import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';
import Button from '../ui/Button';

// Distraction-free exam countdown & submit button — owned by M4 (Assessment Engine)
// secondsLeft is owned by the feature (features/assessments), this component only displays it.
export default function ExamHeader({ secondsLeft = 0, onSubmit, isSubmitting = false }) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft <= 300; // last 5 minutes

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <span className="font-display text-base font-semibold text-brand-navy">Course Assessment</span>

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums ${
            isLowTime ? 'bg-brand-crimson-light text-brand-crimson' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <Button variant="primary" size="sm" onClick={onSubmit} isLoading={isSubmitting}>
          Submit Assessment
        </Button>
      </div>
    </header>
  );
}

ExamHeader.propTypes = {
  secondsLeft: PropTypes.number,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
