import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  { label, type = 'text', error, id, className = '', ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name;
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          placeholder=" "
          className={`peer w-full rounded-lg border px-3.5 pt-5 pb-2 text-sm text-gray-800 placeholder-transparent
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? 'border-brand-crimson focus:ring-brand-crimson'
              : 'border-gray-300 focus:border-brand-navy focus:ring-brand-navy'}
            ${isPassword ? 'pr-10' : ''}
            ${className}`}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="absolute left-3.5 top-2 text-xs text-gray-500 transition-all
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-navy"
          >
            {label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-brand-crimson">{error}</p>}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
