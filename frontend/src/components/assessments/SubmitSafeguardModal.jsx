import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, X } from 'lucide-react';
import Button from '../ui/Button';

export default function SubmitSafeguardModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  unansweredCount = 0,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-in">
        {/* Close 'X' button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Soft Red Exclamation Icon */}
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-50 text-brand-crimson">
          <AlertCircle className="h-8 w-8 text-brand-crimson" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-gray-900">Submit Assessment?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            You are about to submit your final answers. This action cannot be undone. Your results will be displayed immediately.
          </p>
          {unansweredCount > 0 && (
            <p className="text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg p-2 mt-2">
              Note: You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. They will be marked incorrect.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 border-gray-300 text-gray-700 font-semibold"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            isLoading={isSubmitting}
            className="w-full sm:w-1/2 !bg-brand-crimson hover:!bg-brand-crimson-dark text-white font-semibold shadow-md"
          >
            Yes, Submit Now
          </Button>
        </div>
      </div>
    </div>
  );
}

SubmitSafeguardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  unansweredCount: PropTypes.number,
};
