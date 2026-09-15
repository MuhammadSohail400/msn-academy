import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, PlayCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

export default function LessonSidebar({ modules = [], currentLessonId, courseId, progress = 0 }) {
  const [expandedModules, setExpandedModules] = useState(['mod-1', 'mod-3']);
  const navigate = useNavigate();

  const toggleModule = (modId) => {
    if (expandedModules.includes(modId)) {
      setExpandedModules(expandedModules.filter(id => id !== modId));
    } else {
      setExpandedModules([...expandedModules, modId]);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header with Progress Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Course Syllabus</span>
          <span className="text-xs font-bold font-mono text-brand-crimson">{progress}% Done</span>
        </div>
        <ProgressBar value={progress} variant="crimson" size="sm" />
      </div>

      {/* Module Tree Accordion */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[600px]">
        {modules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const isModuleComplete = module.completed;

          return (
            <div key={module.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-brand-crimson shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{module.title}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{module.duration} • {module.lessons?.length || 0} lessons</p>
                  </div>
                </div>
                {isModuleComplete && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-1 border-t border-gray-100 bg-gray-50/50 pt-2">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/learn/${courseId}/lesson/${lesson.id}`)}
                        className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${
                          isActive
                            ? 'bg-brand-navy text-white font-medium shadow-sm'
                            : 'hover:bg-gray-200/60 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {lesson.completed ? (
                            <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                          ) : (
                            <PlayCircle className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ml-2 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Final Timed Assessment Lock / Trigger Card */}
        <div className="mt-3 p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-2">
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-amber-600" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">120m Assessment</h4>
              <p className="text-[11px] text-gray-600">Score 70% to pass and earn certificate</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => navigate(`/learn/${courseId}/assessment`)}
          >
            Launch Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
