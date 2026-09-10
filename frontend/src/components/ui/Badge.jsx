import React from 'react';
import PropTypes from 'prop-types';

// Category pill, Bestseller badge, status tags (order/payment status etc.)
export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-gray-100 text-gray-700',
    crimson: 'bg-brand-crimson-light text-brand-crimson',
    navy: 'bg-brand-navy/10 text-brand-navy',
    violet: 'bg-violet-100 text-brand-violet',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['neutral', 'crimson', 'navy', 'violet', 'success', 'warning', 'danger']),
  className: PropTypes.string,
};
