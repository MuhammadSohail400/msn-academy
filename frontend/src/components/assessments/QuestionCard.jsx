import React from 'react';
import { Flag, XCircle } from 'lucide-react';
import Badge from '../ui/Badge';

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedOption, 
  isFlagged, 
  onSelectOption, 
  onToggleFlag, 
  onClearOption 
}) {
  if (!question) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Question Header & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Badge variant="navy">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded bg-gray-100">
            Domain: {question.domain}
          </span>
        </div>

        <button
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isFlagged
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
          <span>{isFlagged ? 'Flagged for Review' : 'Flag for Review'}</span>
        </button>
      </div>

      {/* Question Statement */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed mb-6">
        {question.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-crimson bg-brand-crimson-light/30 ring-1 ring-brand-crimson text-brand-navy shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
              }`}
            >
              <div 
                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-bold font-mono shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-brand-crimson text-white border-brand-crimson'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {opt.id}
              </div>
              <span className="text-sm font-medium mt-0.5">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      {selectedOption && (
        <div className="flex justify-end">
          <button
            onClick={onClearOption}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-crimson transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Clear selected answer</span>
          </button>
        </div>
      )}
    </div>
  );
}
