import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  BookOpen,
  LayoutDashboard,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Lock,
} from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import Button from '../../components/ui/Button';

export default function AssessmentResult() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reduxResult = useSelector((state) => state.assessments.result);
  const queryAttemptId = searchParams.get('attemptId');
  const targetAttemptId = queryAttemptId || reduxResult?.attemptId;

  const [resultData, setResultData] = useState(reduxResult || null);
  const [isLoading, setIsLoading] = useState(!reduxResult && Boolean(targetAttemptId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resultData && targetAttemptId) {
      fetchResult();
    }
  }, [targetAttemptId]);

  const fetchResult = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await assessmentService.getResult(targetAttemptId);
      setResultData(res?.data || res);
    } catch (err) {
      console.error('Failed to load assessment result:', err);
      setError('Could not retrieve evaluation scorecard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-16 px-4 text-center animate-pulse">
        <div className="h-20 w-20 mx-auto rounded-full bg-gray-200 mb-6" />
        <div className="h-8 w-64 mx-auto rounded bg-gray-200 mb-4" />
        <div className="h-4 w-96 mx-auto rounded bg-gray-200 mb-8" />
        <div className="h-40 rounded-2xl bg-gray-200 mb-6" />
        <div className="h-12 w-48 mx-auto rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Scorecard Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">
          {error || 'No submitted assessment attempt was found for this session.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/learn/${courseId}`}>
            <Button variant="primary">Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    courseTitle = 'Data Analytics',
    totalQuestions = 10,
    correctAnswersCount = 0,
    scorePercentage = 0,
    passingPercentage = 70,
    isPassed = false,
    certificateId,
  } = resultData;

  const certificateUrl = certificateId ? `/certificate/${certificateId}` : '/certificate';

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <span>Assessment Result (LMS)</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">{courseTitle}</span>
      </nav>

      {/* Main Scorecard Container */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md">
        {/* Pass / Fail Header Banner */}
        <div
          className={`p-8 text-center space-y-4 ${
            isPassed ? 'bg-gradient-to-b from-emerald-50/70 to-white' : 'bg-gradient-to-b from-red-50/70 to-white'
          }`}
        >
          {/* Status Badge Icon */}
          <div className="flex justify-center">
            {isPassed ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                <XCircle className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1
              className={`font-display text-2xl sm:text-3xl font-extrabold ${
                isPassed ? 'text-emerald-900' : 'text-red-700'
              }`}
            >
              {isPassed ? '🎉 Congratulations! You Passed.' : 'Not Passed'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 max-w-md mx-auto">
              {isPassed
                ? `You have successfully completed the ${courseTitle} course.`
                : "You did not meet the 70% pass mark. Don't worry — you can retake the assessment anytime."}
            </p>
          </div>

          {/* Big Score Comparisons */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div
                className={`font-display text-4xl sm:text-6xl font-black ${
                  isPassed ? 'text-emerald-600' : 'text-brand-crimson'
                }`}
              >
                {scorePercentage}%
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Your Score</div>
            </div>

            <div className="h-12 w-px bg-gray-200" />

            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-gray-400">
                {passingPercentage}%
              </div>
              <div className="text-xs font-semibold text-gray-400 mt-1">Pass Mark</div>
            </div>
          </div>
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 border-y border-gray-100 divide-x divide-gray-100 bg-gray-50/50 py-4 text-center">
          <div>
            <div className="font-display text-lg sm:text-xl font-bold text-gray-900">
              {correctAnswersCount}/{totalQuestions}
            </div>
            <div className="text-[11px] sm:text-xs text-gray-500">Correct Answers</div>
          </div>

          <div>
            <div className="font-display text-lg sm:text-xl font-bold text-gray-900">
              {passingPercentage}%
            </div>
            <div className="text-[11px] sm:text-xs text-gray-500">Pass Mark</div>
          </div>

          <div>
            <div
              className={`font-display text-lg sm:text-xl font-bold ${
                isPassed ? 'text-emerald-600' : 'text-brand-crimson'
              }`}
            >
              {isPassed ? 'PASSED' : 'FAILED'}
            </div>
            <div className="text-[11px] sm:text-xs text-gray-500">Status</div>
          </div>
        </div>

        {/* Bottom Alert Banner & Action Buttons */}
        <div className="p-6 sm:p-8 space-y-6">
          {isPassed ? (
            /* Pass State Banner */
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 flex items-start gap-3.5">
              <Award className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Certificate Available!</h4>
                <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                  Your Certificate of Completion is ready to download and verify.
                </p>
              </div>
            </div>
          ) : (
            /* Fail State Banner */
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 sm:p-5 flex items-start gap-3.5">
              <Lock className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900">Certificate Locked</h4>
                <p className="text-xs sm:text-sm text-red-700 mt-0.5">
                  Pass the assessment to earn your certificate. Attempts: Unlimited.
                </p>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {isPassed ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(certificateUrl)}
                  className="w-full !bg-emerald-600 hover:!bg-emerald-700 text-white rounded-xl shadow-md text-sm font-bold py-3.5 flex items-center justify-center gap-2"
                >
                  <Award className="h-5 w-5" />
                  View My Certificate
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="w-full border-gray-300 text-gray-700 font-semibold py-3.5 flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/learn/${courseId}/assessment`)}
                  className="w-full !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-md text-sm font-bold py-3.5 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Retake Assessment
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/learn/${courseId}`)}
                  className="w-full border-gray-300 text-gray-700 font-semibold py-3.5 flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Return to Course
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
