import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScoreCard from '../../components/assessments/ScoreCard';
import { mockPassResult, mockFailResult } from '../../data/mockAssessment';

export default function AssessmentResult({ resultOverride = null }) {
  const { courseId = 'solar-pv-tech' } = useParams();
  const [result, setResult] = useState(resultOverride || mockPassResult);

  useEffect(() => {
    if (resultOverride) {
      setResult(resultOverride);
      return;
    }

    const stored = sessionStorage.getItem('last_exam_result');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (e) {
        setResult(mockPassResult);
      }
    } else {
      setResult(mockPassResult);
    }
  }, [resultOverride]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Switcher for Demo / Testing */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 text-xs shadow-sm">
        <span className="text-gray-500 font-medium">Demo Preview Toggle:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setResult(mockPassResult)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              result.isPassed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pass Result (85%)
          </button>
          <button
            onClick={() => setResult(mockFailResult)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              !result.isPassed
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Fail Result (55%)
          </button>
        </div>
      </div>

      <ScoreCard result={result} courseId={courseId} />
    </div>
  );
}
