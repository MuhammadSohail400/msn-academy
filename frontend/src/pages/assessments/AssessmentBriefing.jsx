import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Target,
  Clock,
  Infinity as InfinityIcon,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Flag,
} from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import { initAssessment } from '../../features/assessments/assessmentSlice';
import Button from '../../components/ui/Button';

export default function AssessmentBriefing() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [briefing, setBriefing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const [isLockedNotice, setIsLockedNotice] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadBriefing();
    }
  }, [courseId]);

  const loadBriefing = async () => {
    setIsLoading(true);
    setError(null);
    setIsLockedNotice(false);
    try {
      const res = await assessmentService.getBriefing(courseId);
      setBriefing(res?.data || res);
    } catch (err) {
      console.error('Failed to load assessment briefing:', err);
      const msg = err?.response?.data?.message || err?.message || '';
      if (msg.includes('100%') || msg.includes('complete') || err?.response?.status === 403) {
        setIsLockedNotice(true);
        setError(msg || 'You must complete 100% of course lessons before attempting the final assessment.');
      } else {
        setError(msg || 'Unable to load assessment briefing. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const res = await assessmentService.startAssessment(courseId);
      const attemptData = res?.data || res;

      // Initialize Redux state
      dispatch(
        initAssessment({
          attemptId: attemptData.attemptId,
          courseId,
          courseTitle: briefing?.courseTitle || attemptData.courseTitle || 'Course Assessment',
          startedAt: attemptData.startedAt || new Date().toISOString(),
          durationMinutes: attemptData.durationMinutes || briefing?.timeLimitMinutes || 120,
          questions: attemptData.questions || [],
          answers: attemptData.answers || {},
          flags: attemptData.flags || {},
        })
      );

      // Navigate to active examination engine
      navigate(`/learn/${courseId}/assessment/questions`);
    } catch (err) {
      console.error('Failed to start assessment:', err);
      const msg = err?.response?.data?.message || 'Failed to start assessment session.';
      setError(msg);
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 py-8 animate-pulse">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gray-200" />
        <div className="h-8 w-64 mx-auto rounded bg-gray-200" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="h-44 rounded-2xl bg-gray-200" />
        <div className="h-44 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (isLockedNotice) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Assessment Locked</h2>
        <p className="mt-2 text-sm text-gray-600">
          {error || 'You must complete 100% of the lessons in this course before taking the final assessment.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/learn/${courseId}`}>
            <Button variant="primary">Return to Course Curriculum</Button>
          </Link>
        </div>
      </div>
    );
  }

  const courseTitle = briefing?.courseTitle || 'Data Analytics';

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <span>Assessment Intro (LMS)</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <Link to={`/learn/${courseId}`} className="hover:text-gray-900">
          Course Overview
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Assessment</span>
      </nav>

      {/* Header with Dark Bullseye Icon */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy shadow-md text-brand-crimson">
          <Target className="h-8 w-8 text-brand-crimson" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Course Assessment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Course: <span className="font-semibold text-gray-800">{courseTitle}</span>
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pass Mark */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 text-center space-y-1 shadow-sm">
          <div className="flex justify-center text-emerald-600 mb-1">
            <Target className="h-6 w-6" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-emerald-800">
            {briefing?.passingPercentage || 70}%
          </div>
          <div className="text-xs text-emerald-700 font-medium">Pass Mark</div>
        </div>

        {/* Time Limit */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 sm:p-5 text-center space-y-1 shadow-sm">
          <div className="flex justify-center text-blue-600 mb-1">
            <Clock className="h-6 w-6" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-blue-800">2 Hours</div>
          <div className="text-xs text-blue-700 font-medium">Time Limit</div>
        </div>

        {/* Unlimited Attempts */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 sm:p-5 text-center space-y-1 shadow-sm">
          <div className="flex justify-center text-purple-600 mb-1">
            <InfinityIcon className="h-6 w-6" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-purple-800">Unlimited</div>
          <div className="text-xs text-purple-700 font-medium">Attempts</div>
        </div>

        {/* Question Type */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 text-center space-y-1 shadow-sm">
          <div className="flex justify-center text-amber-600 mb-1">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-amber-800">MCQ Only</div>
          <div className="text-xs text-amber-700 font-medium">Question Type</div>
        </div>
      </div>

      {/* Assessment Overview White Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
          <Flag className="h-5 w-5 text-brand-crimson" />
          <span>Assessment Overview</span>
        </div>
        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson mt-2 flex-shrink-0" />
            <span>
              Questions may be <strong>flagged for review</strong> — flagged questions can be revisited before final submission.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson mt-2 flex-shrink-0" />
            <span>
              You can <strong>change your answers</strong> any time before clicking Submit Assessment.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson mt-2 flex-shrink-0" />
            <span>
              Use the <strong>Question Navigator</strong> to jump directly to any question.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson mt-2 flex-shrink-0" />
            <span>
              The <strong>timer is visible</strong> at all times in the top bar.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson mt-2 flex-shrink-0" />
            <span>Total question count will be shown when the assessment begins.</span>
          </li>
        </ul>
      </div>

      {/* Before You Start Dark Navy Card */}
      <div className="rounded-2xl bg-brand-navy p-6 text-white shadow-md space-y-4">
        <h3 className="font-display text-base font-bold text-white">Before You Start</h3>
        <div className="space-y-2.5 text-xs sm:text-sm text-gray-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-brand-crimson flex-shrink-0" />
            <span>Read each question carefully before answering.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-brand-crimson flex-shrink-0" />
            <span>You can flag questions and return to them before submission.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-brand-crimson flex-shrink-0" />
            <span>Once submitted, answers cannot be changed.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-brand-crimson flex-shrink-0" />
            <span>A score of 70% or above is required to pass.</span>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {error && !isLockedNotice && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartAssessment}
          isLoading={isStarting}
          className="w-full sm:w-auto !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-md text-base font-bold px-8 py-3.5 flex items-center justify-center gap-2"
        >
          <span>Start Assessment</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <Link
          to={`/learn/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Course
        </Link>
      </div>
    </div>
  );
}
