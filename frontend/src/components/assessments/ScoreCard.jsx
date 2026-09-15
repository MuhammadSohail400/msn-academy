import React from 'react';
import { Award, XCircle, RotateCcw, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

export default function ScoreCard({ result, courseId }) {
  const navigate = useNavigate();

  if (!result) return null;

  const {
    scorePercent,
    scorePoints,
    totalPoints,
    passingThreshold = 70,
    isPassed,
    candidateName,
    certificateId,
    completionTimeFormatted,
    domainBreakdown = [],
    recommendedModules = []
  } = result;

  return (
    <div className="space-y-6">
      {/* Top Pass / Fail Banner Header */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border shadow-card ${
          isPassed 
            ? 'bg-emerald-50/70 border-emerald-200 text-gray-900' 
            : 'bg-rose-50/70 border-rose-200 text-gray-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div 
              className={`flex h-20 w-20 items-center justify-center rounded-2xl border text-3xl shadow-sm shrink-0 ${
                isPassed 
                  ? 'bg-emerald-100 text-emerald-600 border-emerald-200' 
                  : 'bg-rose-100 text-rose-600 border-rose-200'
              }`}
            >
              {isPassed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <Badge variant={isPassed ? "success" : "danger"}>
                  {isPassed ? 'Assessment Passed' : 'Threshold Not Met'}
                </Badge>
                <span className="text-xs text-gray-500 font-mono">Passing Threshold: {passingThreshold}%</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy">
                {isPassed ? 'Congratulations, You Qualified!' : 'Assessment Attempt Incomplete'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                {isPassed 
                  ? `Great job ${candidateName}! You have successfully demonstrated technical proficiency in this vocational domain.`
                  : `Keep going ${candidateName}! You scored ${scorePercent}%. Review the recommended modules below and retake the assessment when ready.`}
              </p>
            </div>
          </div>

          {/* Large Score Dial Badge */}
          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-white border border-gray-200 shadow-sm shrink-0 min-w-[140px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Final Score</span>
            <span className={`text-4xl font-extrabold font-mono mt-1 ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {scorePercent}%
            </span>
            <span className="text-[11px] font-mono text-gray-500 mt-0.5">{scorePoints} / {totalPoints} Correct</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <span>Time: {completionTimeFormatted || '1h 14m'}</span>
            <span>•</span>
            <span>Candidate: {candidateName}</span>
          </div>

          <div className="flex items-center gap-3">
            {isPassed ? (
              <Button
                variant="primary"
                size="md"
                icon={ShieldCheck}
                onClick={() => navigate(`/certificate/${certificateId || 'MSN-2026-SOL-8819'}`)}
              >
                Claim Verifiable Digital Certificate →
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/learn/${courseId}`)}
                >
                  Review Course Material
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={RotateCcw}
                  onClick={() => navigate(`/learn/${courseId}/assessment`)}
                >
                  Retake Assessment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Domain Performance Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-brand-navy mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-crimson" />
          <span>Domain Performance Breakdown</span>
        </h3>

        <div className="space-y-4">
          {domainBreakdown.map((item, idx) => {
            const isDomainPassed = item.percent >= 70;

            return (
              <div key={idx} className="p-3.5 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-gray-800">{item.domain}</span>
                  <span className={`font-mono font-bold ${isDomainPassed ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {item.correct} / {item.total} ({item.percent}%)
                  </span>
                </div>
                <ProgressBar
                  value={item.percent}
                  variant={isDomainPassed ? "emerald" : "crimson"}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Review Topics if Failed */}
      {!isPassed && recommendedModules.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>Recommended Modules for Re-study</span>
          </h3>
          <ul className="space-y-2 text-xs text-amber-800">
            {recommendedModules.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
