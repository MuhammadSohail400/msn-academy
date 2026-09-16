import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, PlayCircle, Lock, FileText, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDuration } from '../../utils/formatters';

export default function SyllabusAccordion({ modules = [] }) {
  // Track open module indices. Default: expand first module
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleModule = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => setOpenIndices(modules.map((_, i) => i));
  const collapseAll = () => setOpenIndices([]);

  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures?.length || 0), 0);
  const totalMinutes = modules.reduce((acc, m) => acc + (m.totalDurationMinutes || 0), 0);

  if (!modules.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Curriculum details coming soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Header & Toggle Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2 font-medium">
          <span>{modules.length} Modules</span>
          <span>•</span>
          <span>{totalLectures} Lectures</span>
          {totalMinutes > 0 && (
            <>
              <span>•</span>
              <span>{formatDuration(totalMinutes)} total length</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={expandAll}
            className="font-medium text-brand-navy hover:text-brand-crimson text-xs"
          >
            Expand all
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="font-medium text-gray-500 hover:text-gray-700 text-xs"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {modules.map((moduleItem, modIdx) => {
          const isOpen = openIndices.includes(modIdx);
          const lectures = moduleItem.lectures || [];

          return (
            <div
              key={moduleItem._id || moduleItem.title || modIdx}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors"
            >
              {/* Module Title Row */}
              <button
                type="button"
                onClick={() => toggleModule(modIdx)}
                className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left transition-colors hover:bg-gray-100/80"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-crimson' : ''
                    }`}
                  />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-brand-navy sm:text-base">
                      Module {modIdx + 1}: {moduleItem.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {lectures.length} lectures
                      {moduleItem.totalDurationMinutes
                        ? ` • ${formatDuration(moduleItem.totalDurationMinutes)}`
                        : ''}
                    </p>
                  </div>
                </div>
              </button>

              {/* Lectures List */}
              {isOpen && (
                <div className="divide-y divide-gray-100 border-t border-gray-100 bg-white">
                  {lectures.map((lecture, lecIdx) => (
                    <div
                      key={lecture._id || lecture.title || lecIdx}
                      className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        {lecture.isPreview ? (
                          <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-crimson" />
                        ) : (
                          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        )}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">
                              {modIdx + 1}.{lecIdx + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {lecture.title}
                            </span>
                            {lecture.isPreview && (
                              <Badge variant="crimson" className="text-[10px] py-0.5 px-2">
                                Free Preview
                              </Badge>
                            )}
                          </div>

                          {/* Key Topics */}
                          {lecture.keyTopics && lecture.keyTopics.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {lecture.keyTopics.map((topic) => (
                                <span
                                  key={topic}
                                  className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 sm:shrink-0">
                        {lecture.resources && lecture.resources.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                            {lecture.resources.length} resource
                            {lecture.resources.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {lecture.durationMinutes && (
                          <span className="font-medium text-gray-600">
                            {formatDuration(lecture.durationMinutes)}
                          </span>
                        )}
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

SyllabusAccordion.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      totalDurationMinutes: PropTypes.number,
      lectures: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          title: PropTypes.string.isRequired,
          durationMinutes: PropTypes.number,
          isPreview: PropTypes.bool,
          keyTopics: PropTypes.arrayOf(PropTypes.string),
          resources: PropTypes.array,
        })
      ),
    })
  ),
};
