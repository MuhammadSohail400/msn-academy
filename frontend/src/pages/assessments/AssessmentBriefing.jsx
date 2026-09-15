import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, Award, CheckSquare, Square, ArrowRight, HelpCircle } from 'lucide-react';
import assessmentService from '../../services/assessmentService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AssessmentBriefing() {
  const { courseId = 'solar-pv-tech' } = useParams();
  const [briefing, setBriefing] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    assessmentService.getBriefing(courseId).then(res => {
      if (res.success) setBriefing(res.data);
    });
  }, [courseId]);

  if (!briefing) {
    return <div className="p-8 text-center text-gray-500">Loading evaluation briefing...</div>;
  }

  const handleStartExam = () => {
    if (!acceptedTerms) return;
    navigate(`/learn/${courseId}/assessment/questions`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Briefing Header Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-card text-gray-900">
        <div className="flex items-center gap-4 mb-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <div className="mb-1">
              <Badge variant="crimson">Vocational Certification Assessment</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
              {briefing.courseTitle}
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mt-2">
          This 120-minute timed multiple-choice evaluation tests your technical mastery. Passing this assessment (≥70%) qualifies you for an instant, publicly verifiable digital certificate.
        </p>
      </div>

      {/* Exam Specs Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <Clock className="h-5 w-5 text-brand-navy mx-auto mb-1" />
          <span className="text-xs font-semibold text-gray-500 uppercase block">Duration</span>
          <span className="text-base sm:text-lg font-bold font-mono text-gray-900">120 Minutes</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <Award className="h-5 w-5 text-amber-600 mx-auto mb-1" />
          <span className="text-xs font-semibold text-gray-500 uppercase block">Pass Mark</span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-600">70% (14/20)</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <HelpCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <span className="text-xs font-semibold text-gray-500 uppercase block">Total MCQs</span>
          <span className="text-base sm:text-lg font-bold font-mono text-gray-900">20 Questions</span>
        </div>
      </div>

      {/* Guidelines & Rules Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-brand-navy flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>Evaluation Rules & Guidelines</span>
        </h3>

        <ul className="space-y-2.5 text-xs text-gray-700">
          {briefing.rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy text-white font-mono text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Terms Acknowledgment Checkbox */}
      <div 
        onClick={() => setAcceptedTerms(!acceptedTerms)}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
          acceptedTerms 
            ? 'bg-brand-crimson-light/40 border-brand-crimson text-brand-navy' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
        }`}
      >
        {acceptedTerms ? (
          <CheckSquare className="h-5 w-5 text-brand-crimson shrink-0" />
        ) : (
          <Square className="h-5 w-5 text-gray-400 shrink-0" />
        )}
        <span className="text-xs font-medium select-none">
          I have read and agree to the 120-minute timed evaluation rules, passing threshold terms (70%), and anti-cheating guidelines.
        </span>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        size="lg"
        disabled={!acceptedTerms}
        onClick={handleStartExam}
        className="w-full text-sm"
        icon={ArrowRight}
      >
        Begin 120-Minute Assessment Now
      </Button>
    </div>
  );
}
