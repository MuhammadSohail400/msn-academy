import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

// Generic network failure card with retry action
export default function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-brand-crimson-light bg-brand-crimson-light/30 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 h-10 w-10 text-brand-crimson" />
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onRetry: PropTypes.func,
};
