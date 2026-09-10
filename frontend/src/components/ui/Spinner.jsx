import React from 'react';
import PropTypes from 'prop-types';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block ${sizes[size]} rounded-full border-current border-t-transparent animate-spin ${className}`}
    />
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};
