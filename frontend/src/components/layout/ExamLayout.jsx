import React from 'react';
import { Outlet } from 'react-router-dom';
import ExamHeader from './ExamHeader';

// Distraction-free shell for the assessment flow — no sidebar, no public nav.
// secondsLeft/onSubmit will be lifted from features/assessments state once M4 builds the timer logic.
export default function ExamLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader secondsLeft={7200} onSubmit={() => {}} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
