import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
  X,
} from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import {
  initAssessment,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  decrementTimer,
  setAssessmentResult,
} from '../../features/assessments/assessmentSlice';
import ExamHeader from '../../components/layout/ExamHeader';
import ReviewAndSubmitView from '../../components/assessments/ReviewAndSubmitView';
import SubmitSafeguardModal from '../../components/assessments/SubmitSafeguardModal';
import Button from '../../components/ui/Button';

export default function AssessmentQuestions() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assessmentState = useSelector((state) => state.assessments);
  const {
    attemptId,
    courseTitle,
    questions,
    currentIndex,
    answers,
    flags,
    secondsLeft,
  } = assessmentState;

  const [viewMode, setViewMode] = useState('QUESTION'); // 'QUESTION' | 'REVIEW'
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileNavigatorOpen, setIsMobileNavigatorOpen] = useState(false);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(false);
  const [error, setError] = useState(null);

  // Resume or start assessment attempt if not loaded in memory
  useEffect(() => {
    if (!attemptId || questions.length === 0) {
      resumeOrStart();
    }
  }, [courseId, attemptId]);

  const resumeOrStart = async () => {
    setIsLoadingAttempt(true);
    setError(null);
    try {
      const res = await assessmentService.startAssessment(courseId);
      const data = res?.data || res;

      dispatch(
        initAssessment({
          attemptId: data.attemptId,
          courseId,
          courseTitle: data.courseTitle || 'Course Assessment',
          startedAt: data.startedAt || new Date().toISOString(),
          durationMinutes: data.durationMinutes || 120,
          questions: data.questions || [],
          answers: data.answers || {},
          flags: data.flags || {},
        })
      );
    } catch (err) {
      console.error('Failed to start/resume assessment session:', err);
      setError('Could not load active exam session. Please check your eligibility.');
    } finally {
      setIsLoadingAttempt(false);
    }
  };

  // 1-second countdown timer interval
  useEffect(() => {
    if (!attemptId || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptId, secondsLeft, dispatch]);

  // Auto-submit when time expires
  const hasAutoSubmitted = useRef(false);
  useEffect(() => {
    if (attemptId && secondsLeft <= 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      handleFinalSubmit();
    }
  }, [secondsLeft, attemptId]);

  const currentQuestion = questions[currentIndex] || null;

  // Handle Option Click (Autosaves immediately)
  const handleSelectOption = async (optionKey) => {
    if (!currentQuestion || !attemptId) return;

    dispatch(
      setAnswer({
        questionId: currentQuestion.id,
        selectedOptionKey: optionKey,
      })
    );

    try {
      await assessmentService.recordAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOptionKey: optionKey,
        isFlagged: Boolean(flags[currentQuestion.id]),
      });
    } catch (err) {
      console.error('Autosave answer error:', err);
    }
  };

  // Handle Flag Toggle (Autosaves immediately)
  const handleToggleFlag = async () => {
    if (!currentQuestion || !attemptId) return;

    const newFlag = !flags[currentQuestion.id];
    dispatch(toggleFlag(currentQuestion.id));

    try {
      await assessmentService.recordAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOptionKey: answers[currentQuestion.id] || null,
        isFlagged: newFlag,
      });
    } catch (err) {
      console.error('Autosave flag error:', err);
    }
  };

  // Next / Previous Navigation
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
    } else {
      setViewMode('REVIEW');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      dispatch(setCurrentIndex(currentIndex - 1));
    }
  };

  // Final Assessment Submission
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await assessmentService.submitAssessment(attemptId);
      const resultData = res?.data || res;

      dispatch(setAssessmentResult(resultData));
      navigate(`/learn/${courseId}/assessment/result?attemptId=${attemptId}`);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert('Submission failed. Please check your network connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingAttempt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-crimson border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">Initializing 120-minute timed exam session...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Exam Session Error</h2>
        <p className="mt-2 text-sm text-gray-600">{error || 'No assessment questions could be loaded.'}</p>
        <div className="mt-6">
          <Link to={`/learn/${courseId}/assessment`}>
            <Button variant="primary">Return to Briefing</Button>
          </Link>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = questions.filter((q) => flags[q.id]).length;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Distraction-Free Header */}
      <ExamHeader
        courseTitle={courseTitle || 'Data Analytics'}
        secondsLeft={secondsLeft}
        onReviewSubmit={() => {
          if (viewMode === 'QUESTION') {
            setViewMode('REVIEW');
          } else {
            setIsSubmitModalOpen(true);
          }
        }}
        isSubmitting={isSubmitting}
        actionText={viewMode === 'QUESTION' ? 'Review & Submit' : 'Submit Assessment'}
      />

      {/* Review View Mode */}
      {viewMode === 'REVIEW' ? (
        <ReviewAndSubmitView
          questions={questions}
          answers={answers}
          flags={flags}
          onSelectQuestion={(idx) => {
            dispatch(setCurrentIndex(idx));
            setViewMode('QUESTION');
          }}
          onBackToQuestions={() => setViewMode('QUESTION')}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          isSubmitting={isSubmitting}
        />
      ) : (
        /* Active Question View Mode */
        <div className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* Mobile Top Bar with Question Count & Qs Trigger */}
          <div className="lg:hidden flex items-center justify-between bg-white rounded-xl p-3 mb-4 border border-gray-200 shadow-sm">
            <span className="font-display text-sm font-bold text-brand-navy">
              Question {currentIndex + 1} / {questions.length}
            </span>
            <button
              type="button"
              onClick={() => setIsMobileNavigatorOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Qs ({answeredCount}/{questions.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left 3 Cols: Question & Choices */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question Header: Number & Flag Button */}
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-extrabold uppercase tracking-wider text-brand-crimson">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    flags[currentQuestion?.id]
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Flag
                    className={`h-3.5 w-3.5 ${
                      flags[currentQuestion?.id] ? 'fill-amber-500 text-amber-500' : 'text-gray-400'
                    }`}
                  />
                  <span>{flags[currentQuestion?.id] ? 'Flagged' : 'Flag for Review'}</span>
                </button>
              </div>

              {/* Question Statement Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {currentQuestion?.prompt || 'Question Statement'}
                </h2>
              </div>

              {/* Options A / B / C / D */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.key;

                  return (
                    <div
                      key={option.key}
                      onClick={() => handleSelectOption(option.key)}
                      className={`group flex items-center gap-4 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-2 border-brand-crimson bg-red-50/20 shadow-sm'
                          : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-sm'
                      }`}
                    >
                      {/* Option Letter Circle */}
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-brand-crimson text-white shadow-sm'
                            : 'border-2 border-gray-300 text-gray-600 group-hover:border-gray-400'
                        }`}
                      >
                        {option.key}
                      </div>

                      {/* Option Text */}
                      <span
                        className={`text-sm sm:text-base ${
                          isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-5 border-gray-300 text-gray-700 font-semibold"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {currentIndex < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="px-6 !bg-brand-navy hover:!bg-[#15253e] text-white font-semibold shadow-sm"
                  >
                    Save & Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setViewMode('REVIEW')}
                    className="px-6 !bg-brand-crimson hover:!bg-brand-crimson-dark text-white font-semibold shadow-sm"
                  >
                    Review & Submit
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column: Question Navigator Sidebar (Desktop) */}
            <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5 sticky top-20">
              <h3 className="font-display text-base font-bold text-gray-900">Question Navigator</h3>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-brand-navy" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-emerald-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-gray-200" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-amber-500" />
                  <span>Flagged</span>
                </div>
              </div>

              {/* Number Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[q.id] != null;
                  const isFlagged = Boolean(flags[q.id]);

                  let btnClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                  if (isCurrent) {
                    btnClasses = 'bg-brand-navy text-white shadow-md ring-2 ring-brand-navy/30';
                  } else if (isFlagged) {
                    btnClasses = 'bg-amber-500 text-white';
                  } else if (isAnswered) {
                    btnClasses = 'bg-emerald-600 text-white';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => dispatch(setCurrentIndex(idx))}
                      className={`h-9 w-full rounded-xl text-xs font-bold transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative ${btnClasses}`}
                    >
                      {idx + 1}
                      {isFlagged && !isCurrent && (
                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary Counters */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Answered</span>
                  <span>{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 font-semibold">
                  <span>Unanswered</span>
                  <span>{unansweredCount}</span>
                </div>
                <div className="flex items-center justify-between text-amber-600 font-semibold">
                  <span>Flagged</span>
                  <span>{flaggedCount}</span>
                </div>
              </div>

              {/* Review & Submit Button */}
              <Button
                variant="primary"
                size="md"
                onClick={() => setViewMode('REVIEW')}
                className="w-full !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-sm text-xs font-bold py-2.5"
              >
                Review & Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Question Navigator Drawer */}
      {isMobileNavigatorOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 lg:hidden">
          <div className="rounded-t-3xl bg-white p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display text-base font-bold text-gray-900">Question Navigator</h3>
              <button
                type="button"
                onClick={() => setIsMobileNavigatorOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] != null;
                const isFlagged = Boolean(flags[q.id]);

                let btnClasses = 'bg-gray-100 text-gray-700';
                if (isCurrent) {
                  btnClasses = 'bg-brand-navy text-white';
                } else if (isFlagged) {
                  btnClasses = 'bg-amber-500 text-white';
                } else if (isAnswered) {
                  btnClasses = 'bg-emerald-600 text-white';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      dispatch(setCurrentIndex(idx));
                      setIsMobileNavigatorOpen(false);
                      setViewMode('QUESTION');
                    }}
                    className={`h-10 rounded-xl text-xs font-bold ${btnClasses}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsMobileNavigatorOpen(false);
                setViewMode('REVIEW');
              }}
              className="w-full !bg-brand-crimson text-white text-xs font-bold py-3 mt-3"
            >
              Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* Safeguard Submission Modal */}
      <SubmitSafeguardModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
        unansweredCount={unansweredCount}
      />
    </div>
  );
}
