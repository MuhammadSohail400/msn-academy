import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 4, className = '', ...props },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800
          focus:outline-none focus:ring-2
          ${error ? 'border-brand-crimson focus:ring-brand-crimson' : 'border-gray-300 focus:border-brand-navy focus:ring-brand-navy'}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-brand-crimson">{error}</p>}
    </div>
  );
});

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default Textarea;
