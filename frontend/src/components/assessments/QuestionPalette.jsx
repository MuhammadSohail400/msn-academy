import React from 'react';

export default function QuestionPalette({ 
  totalQuestions = 20, 
  currentIndex = 0, 
  answersMap = {}, 
  flaggedMap = {}, 
  onSelectQuestion 
}) {
  const questionsArray = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const answeredCount = Object.keys(answersMap).length;
  const flaggedCount = Object.keys(flaggedMap).filter(k => flaggedMap[k]).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        Question Navigator
      </h3>

      {/* Grid of Question Numbers */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questionsArray.map((qNum) => {
          const isCurrent = currentIndex === qNum - 1;
          const isAnswered = Boolean(answersMap[qNum]);
          const isFlagged = Boolean(flaggedMap[qNum]);

          let statusStyle = "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";

          if (isFlagged) {
            statusStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
          } else if (isAnswered) {
            statusStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
          }

          if (isCurrent) {
            statusStyle += " ring-2 ring-brand-navy ring-offset-1 font-bold";
          }

          return (
            <button
              key={qNum}
              onClick={() => onSelectQuestion(qNum - 1)}
              className={`relative flex items-center justify-center h-10 rounded-lg border text-xs font-mono transition-all ${statusStyle}`}
            >
              <span>{qNum}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Answered</span>
          </div>
          <span className="font-mono font-bold text-emerald-700">{answeredCount}</span>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Flagged for Review</span>
          </div>
          <span className="font-mono font-bold text-amber-700">{flaggedCount}</span>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gray-300" />
            <span>Unanswered</span>
          </div>
          <span className="font-mono font-bold text-gray-500">{unansweredCount}</span>
        </div>
      </div>
    </div>
  );
}
