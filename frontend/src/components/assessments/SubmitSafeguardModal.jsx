import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function SubmitSafeguardModal({ 
  isOpen, 
  onClose, 
  onConfirmSubmit, 
  unansweredCount = 0, 
  flaggedCount = 0, 
  secondsLeft = 7200 
}) {
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Assessment?" size="md">
      <div className="space-y-4">
        {/* Warning Alert if Unanswered Questions Exist */}
        {unansweredCount > 0 ? (
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Warning: {unansweredCount} Unanswered Questions Remaining</span>
            </div>
            <p>
              You still have <strong className="font-mono text-amber-900">{unansweredCount} unanswered questions</strong>. Unanswered questions will receive zero (0) points.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-emerald-800 mb-1">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>All 20 Questions Answered!</span>
            </div>
            <p>You have answered all questions and are ready to finalize your evaluation.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
          <div>
            <span className="text-gray-500 block">Time Remaining:</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{hours}h {minutes}m</span>
          </div>
          <div>
            <span className="text-gray-500 block">Flagged for Review:</span>
            <span className="font-mono font-bold text-amber-600 text-sm">{flaggedCount} questions</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
          >
            ← Return to Exam
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirmSubmit}
          >
            Confirm & Submit →
          </Button>
        </div>
      </div>
    </Modal>
  );
}
