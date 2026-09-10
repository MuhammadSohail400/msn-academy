import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Checkbox = forwardRef(function Checkbox({ label, id, className = '', ...props }, ref) {
  const checkboxId = id || props.name;

  return (
    <label htmlFor={checkboxId} className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-brand-crimson focus:ring-brand-crimson"
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
});

Checkbox.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;
