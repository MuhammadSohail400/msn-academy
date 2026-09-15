import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Flag, AlertTriangle, CheckCircle, ListCheck } from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import TimerWidget from '../../components/assessments/TimerWidget';
import QuestionPalette from '../../components/assessments/QuestionPalette';
import QuestionCard from '../../components/assessments/QuestionCard';
import SubmitSafeguardModal from '../../components/assessments/SubmitSafeguardModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AssessmentQuestions() {
  const { courseId = 'solar-pv-tech' } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({ 1: 'B', 2: 'A', 3: 'C', 4: 'B' });
  const [flaggedMap, setFlaggedMap] = useState({ 3: true });
  const [secondsLeft, setSecondsLeft] = useState(7200); // 120 mins
  const [viewMode, setViewMode] = useState('exam'); // 'exam' or 'review'
  const [isSafeguardModalOpen, setIsSafeguardModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    assessmentService.startAssessmentSession(courseId).then(res => {
      if (res.success) {
        setQuestions(res.questions);
      }
    });
  }, [courseId]);

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading evaluation questions...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const qNum = currentIndex + 1;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answersMap).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.keys(flaggedMap).filter(k => flaggedMap[k]).length;

  const handleSelectOption = (optionId) => {
    setAnswersMap(prev => ({ ...prev, [qNum]: optionId }));
  };

  const handleClearOption = () => {
    const updated = { ...answersMap };
    delete updated[qNum];
    setAnswersMap(updated);
  };

  const handleToggleFlag = () => {
    setFlaggedMap(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setViewMode('review');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    assessmentService.submitAnswers('SESS-ACTIVE', answersMap, flaggedMap).then(res => {
      if (res.success) {
        sessionStorage.setItem('last_exam_result', JSON.stringify(res.result));
        navigate(`/learn/${courseId}/assessment/result`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Timer & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant="navy">120m Assessment</Badge>
          <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Certified Solar PV Design</span>
        </div>

        <div className="flex items-center gap-3">
          <TimerWidget secondsLeft={secondsLeft} setSecondsLeft={setSecondsLeft} />

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSafeguardModalOpen(true)}
          >
            Submit Assessment
          </Button>
        </div>
      </div>

      {/* Toggle View Mode */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setViewMode('exam')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'exam'
              ? 'bg-brand-navy text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Live MCQ Questions
        </button>
        <button
          onClick={() => setViewMode('review')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'review'
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          Pre-Submission Summary ({answeredCount}/{totalQuestions} Answered)
        </button>
      </div>

      {/* MODE 1: Live Exam Session */}
      {viewMode === 'exam' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Card (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <QuestionCard
              question={currentQuestion}
              questionNumber={qNum}
              totalQuestions={totalQuestions}
              selectedOption={answersMap[qNum]}
              isFlagged={Boolean(flaggedMap[qNum])}
              onSelectOption={handleSelectOption}
              onToggleFlag={handleToggleFlag}
              onClearOption={handleClearOption}
            />

            {/* Nav Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                icon={ArrowLeft}
              >
                Previous
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
              >
                <span>{currentIndex === totalQuestions - 1 ? 'Go to Review Summary →' : 'Save & Next Question →'}</span>
              </Button>
            </div>
          </div>

          {/* Right Sidebar: Question Navigator Palette (1 Col) */}
          <div>
            <QuestionPalette
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answersMap={answersMap}
              flaggedMap={flaggedMap}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
            />
          </div>
        </div>
      )}

      {/* MODE 2: Pre-Submission Review Grid */}
      {viewMode === 'review' && (
        <div className="space-y-6">
          {/* Summary Alert */}
          {unansweredCount > 0 ? (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-800">Unanswered Questions Alert</h4>
                  <p>You have {unansweredCount} unanswered questions remaining. Click any box below to jump back and answer.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-800">All 20 Questions Completed!</h4>
                <p>Review your selected answers or click 'Confirm Submission' below to finish your exam.</p>
              </div>
            </div>
          )}

          {/* Review Grid */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-brand-navy mb-4 flex items-center gap-2">
              <ListCheck className="h-4 w-4 text-brand-crimson" />
              <span>Question Status Matrix</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const num = idx + 1;
                const ans = answersMap[num];
                const isFlg = flaggedMap[num];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode('exam');
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isFlg
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : ans
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-mono font-bold">
                      <span>Q #{num}</span>
                      <span>{ans ? `Option (${ans})` : 'Unanswered'}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{q.domain}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setViewMode('exam')}
            >
              ← Back to Questions
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsSafeguardModalOpen(true)}
            >
              Confirm Submission →
            </Button>
          </div>
        </div>
      )}

      {/* Safeguard Confirmation Modal */}
      <SubmitSafeguardModal
        isOpen={isSafeguardModalOpen}
        onClose={() => setIsSafeguardModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        secondsLeft={secondsLeft}
      />
    </div>
  );
}
