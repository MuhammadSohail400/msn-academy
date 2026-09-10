import React from 'react';
import PropTypes from 'prop-types';

// Animated skeleton placeholder blocks — use while data is loading
export default function Skeleton({ className = '', rounded = 'rounded-md' }) {
  return <div className={`animate-pulse bg-gray-200 ${rounded} ${className}`} />;
}

Skeleton.propTypes = {
  className: PropTypes.string,
  rounded: PropTypes.string,
};
