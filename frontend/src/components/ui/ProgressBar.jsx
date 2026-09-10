import React from 'react';
import PropTypes from 'prop-types';

// Animated percentage progress bar — used for course/lesson completion
export default function ProgressBar({ value = 0, size = 'md', variant = 'crimson', showLabel = false, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const variants = {
    crimson: 'bg-brand-crimson',
    navy: 'bg-brand-navy',
    emerald: 'bg-brand-emerald',
  };

  return (
    <div className={className}>
      <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${heights[size]}`}>
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`h-full rounded-full transition-all duration-500 ease-out ${variants[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs text-gray-500">{clamped}% complete</p>}
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['crimson', 'navy', 'emerald']),
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};
