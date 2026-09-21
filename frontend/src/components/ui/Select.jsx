import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, options = [], error, id, className = '', placeholder = 'Select an option', ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-800
            focus:outline-none focus:ring-2
            ${error ? 'border-brand-crimson focus:ring-brand-crimson' : 'border-gray-300 focus:border-brand-navy focus:ring-brand-navy'}
            ${className}`}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-xs text-brand-crimson">{error}</p>}
    </div>
  );
});

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), label: PropTypes.string })
  ),
  error: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Select;
