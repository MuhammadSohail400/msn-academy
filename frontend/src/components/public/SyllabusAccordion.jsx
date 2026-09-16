import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Lock, Clock, BookOpen } from 'lucide-react';

export default function SyllabusAccordion({ modules = [] }) {
  // By default, expand the first module
  const [expandedIndices, setExpandedIndices] = useState([0]);

  if (!modules || modules.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Curriculum details are currently being finalized by the department lead.
      </div>
    );
  }

  const toggleModule = (index) => {
    if (expandedIndices.includes(index)) {
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  const expandAll = () => setExpandedIndices(modules.map((_, i) => i));
  const collapseAll = () => setExpandedIndices([]);

  const totalLecturesCount = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);
  const totalMinutes = modules.reduce(
    (acc, m) => acc + (m.totalDurationMinutes || m.lectures?.reduce((lAcc, l) => lAcc + (l.durationMinutes || 0), 0) || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Syllabus Header Stats & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 pb-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-brand-crimson" />
            {modules.length} Modules • {totalLecturesCount} Lectures
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            {Math.round(totalMinutes / 60)} Hours Total Length
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-semibold text-brand-crimson hover:underline"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-semibold text-slate-600 hover:underline"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Modules */}
      <div className="space-y-3">
        {modules.map((module, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const lectures = module.lectures || [];

          return (
            <div
              key={module._id || idx}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all"
            >
              {/* Module Header Button */}
              <button
                type="button"
                onClick={() => toggleModule(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-navy/10 text-xs font-bold text-brand-navy">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {module.title}
                    </h4>
                    <div className="mt-1 text-xs text-slate-500">
                      {lectures.length} Lectures {module.totalDurationMinutes ? `• ${module.totalDurationMinutes} mins` : ''}
                    </div>
                  </div>
                </div>

                <div className="ml-3 shrink-0 text-slate-400">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {/* Module Lectures List */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 border-t border-slate-100 bg-white">
                  {lectures.map((lecture, lIdx) => (
                    <div
                      key={lecture._id || lIdx}
                      className="flex items-center justify-between px-4 sm:px-6 py-3.5 text-xs sm:text-sm hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {lecture.isPreview ? (
                          <PlayCircle className="h-4 w-4 text-brand-crimson shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-300 shrink-0" />
                        )}
                        <span className="text-slate-700 font-medium line-clamp-1">
                          {lecture.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 ml-3">
                        {lecture.isPreview && (
                          <span className="rounded bg-brand-crimson/10 px-2 py-0.5 text-[11px] font-semibold text-brand-crimson">
                            Preview
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {lecture.durationMinutes ? `${lecture.durationMinutes}m` : '15m'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
