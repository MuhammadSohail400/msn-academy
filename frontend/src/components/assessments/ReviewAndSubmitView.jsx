import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircle2,
  AlertCircle,
  Flag,
  ArrowLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button';

export default function ReviewAndSubmitView({
  questions = [],
  answers = {},
  flags = {},
  onSelectQuestion,
  onBackToQuestions,
  onOpenSubmitModal,
  isSubmitting = false,
}) {
  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedQuestions = questions.filter((q) => flags[q.id]);
  const flaggedCount = flaggedQuestions.length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 px-4 sm:px-6 pb-20">
      {/* Top Back Link */}
      <div>
        <button
          type="button"
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back to Questions</span>
        </button>
      </div>

      {/* Heading & Subtitle */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Review & Submit</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Check your answers before final submission. You can return to any question to change your answer.
        </p>
      </div>

      {/* 3 Stat Boxes */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {/* Answered */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 sm:p-6 text-center space-y-1 shadow-sm">
          <div className="font-display text-2xl sm:text-4xl font-extrabold text-emerald-600">
            {answeredCount}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Answered</span>
          </div>
        </div>

        {/* Unanswered */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 text-center space-y-1 shadow-sm">
          <div className="font-display text-2xl sm:text-4xl font-extrabold text-gray-500">
            {unansweredCount}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold text-gray-600">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <span>Unanswered</span>
          </div>
        </div>

        {/* Flagged */}
        <div className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-6 text-center space-y-1 shadow-sm">
          <div className="font-display text-2xl sm:text-4xl font-extrabold text-amber-500">
            {flaggedCount}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold text-amber-700">
            <Flag className="h-4 w-4 text-amber-500" />
            <span>Flagged</span>
          </div>
        </div>
      </div>

      {/* Question Summary Grid Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <h3 className="font-display text-base sm:text-lg font-bold text-gray-900">Question Summary</h3>

        {/* Tile Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 sm:gap-3">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] != null;
            const isFlagged = Boolean(flags[q.id]);

            let tileClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
            if (isFlagged) {
              tileClasses = 'bg-amber-500 text-white shadow-sm hover:bg-amber-600';
            } else if (isAnswered) {
              tileClasses = 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`relative flex h-11 w-full sm:h-12 items-center justify-center rounded-xl text-sm sm:text-base font-bold transition-transform hover:scale-105 active:scale-95 ${tileClasses}`}
                title={`Question ${idx + 1}: ${isFlagged ? 'Flagged' : isAnswered ? 'Answered' : 'Unanswered'}`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <Flag className="absolute top-1.5 right-1.5 h-2.5 w-2.5 fill-white text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded bg-emerald-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded bg-gray-200" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded bg-amber-500" />
            <span>Flagged</span>
          </div>
        </div>
      </div>

      {/* Unanswered warning banner */}
      {unansweredCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{unansweredCount} unanswered questions</strong> — unanswered questions will be marked incorrect. Go back to answer them before submitting.
          </span>
        </div>
      )}

      {/* Flagged questions quick review list if any */}
      {flaggedCount > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm space-y-3">
          <h4 className="font-display text-sm font-bold text-amber-900">Flagged Questions for Review</h4>
          <div className="divide-y divide-amber-100">
            {flaggedQuestions.map((q) => {
              const qIdx = questions.findIndex((item) => item.id === q.id);
              return (
                <div key={q.id} className="flex items-center justify-between py-2 text-xs sm:text-sm">
                  <span className="font-medium text-amber-900">Question {qIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => onSelectQuestion(qIdx)}
                    className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-900"
                  >
                    <span>Review</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ready to Submit Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-sm space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900">Ready to Submit?</h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Once submitted, you cannot change your answers. Results are shown immediately. Pass mark: <strong>70%</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onBackToQuestions}
            className="w-full sm:w-auto px-6 border-gray-300 text-gray-700 font-semibold"
          >
            Go Back to Questions
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onOpenSubmitModal}
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-8 !bg-brand-crimson hover:!bg-brand-crimson-dark text-white font-semibold shadow-md"
          >
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

ReviewAndSubmitView.propTypes = {
  questions: PropTypes.array,
  answers: PropTypes.object,
  flags: PropTypes.object,
  onSelectQuestion: PropTypes.func.isRequired,
  onBackToQuestions: PropTypes.func.isRequired,
  onOpenSubmitModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};
