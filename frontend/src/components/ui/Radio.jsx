import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

// Radio selection button card — used for payment method / plan selection
const Radio = forwardRef(function Radio(
  { label, description, id, checked, className = '', ...props },
  ref
) {
  const radioId = id || props.name + '-' + props.value;

  return (
    <label
      htmlFor={radioId}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors
        ${checked ? 'border-brand-navy bg-brand-navy/[0.03] ring-1 ring-brand-navy' : 'border-gray-300 hover:border-gray-400'}
        ${className}`}
    >
      <input ref={ref} id={radioId} type="radio" checked={checked} className="mt-0.5 h-4 w-4 text-brand-navy focus:ring-brand-navy" {...props} />
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {description && <span className="block text-xs text-gray-500">{description}</span>}
      </span>
    </label>
  );
});

Radio.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
};

export default Radio;
