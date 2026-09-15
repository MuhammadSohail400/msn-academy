import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Award, CheckCircle, FileText, Download, ChevronDown, ChevronRight, BookOpen, Clock } from 'lucide-react';
import learningService from '../../services/learningService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

export default function CourseOverview() {
  const { courseId = 'solar-pv-tech' } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedModules, setExpandedModules] = useState(['mod-1', 'mod-2', 'mod-3']);
  const navigate = useNavigate();

  useEffect(() => {
    learningService.getCourseOverview(courseId).then(res => {
      if (res.success) setCourse(res.data);
    });
  }, [courseId]);

  if (!course) {
    return <div className="p-8 text-center text-gray-500">Loading course overview...</div>;
  }

  const toggleModule = (id) => {
    if (expandedModules.includes(id)) {
      setExpandedModules(expandedModules.filter(m => m !== id));
    } else {
      setExpandedModules([...expandedModules, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-navy p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="crimson">{course.category}</Badge>
            <span className="text-xs text-gray-300">Duration: {course.totalDuration}</span>
            <span className="text-xs text-gray-300">• {course.totalLessons} Video Lectures</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-display text-white">
            {course.title}
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            {course.subtitle}
          </p>

          {/* Instructor Badge */}
          <div className="flex items-center gap-3 pt-2">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/20" 
            />
            <div>
              <h4 className="text-sm font-semibold text-white">{course.instructor.name}</h4>
              <p className="text-xs text-gray-300">{course.instructor.title}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              icon={PlayCircle}
              onClick={() => navigate(`/learn/${course.id}/lesson/${course.modules[0]?.lessons[0]?.id || 'mod-1-lesson-1'}`)}
            >
              Start / Continue Lecture
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={Award}
              onClick={() => navigate(`/learn/${course.id}/assessment`)}
            >
              120m Assessment
            </Button>
          </div>
        </div>
      </div>

      {/* Progress & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Modules Syllabus Tree (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-brand-navy flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-crimson" />
              <span>Course Syllabus Modules</span>
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {course.completedLessons} of {course.totalLessons} Completed
            </span>
          </div>

          <div className="space-y-3">
            {course.modules.map((module) => {
              const isExpanded = expandedModules.includes(module.id);

              return (
                <div key={module.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-brand-crimson" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{module.title}</h3>
                        <span className="text-xs text-gray-500">{module.duration} • {module.lessons.length} lessons</span>
                      </div>
                    </div>

                    {module.completed && (
                      <Badge variant="success">
                        <CheckCircle className="mr-1 h-3.5 w-3.5" /> Completed
                      </Badge>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-3 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-gray-400 shrink-0" />
                            )}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-800 truncate">{lesson.title}</h4>
                              <span className="text-[11px] text-gray-500">{lesson.duration}</span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 ml-3"
                            onClick={() => navigate(`/learn/${course.id}/lesson/${lesson.id}`)}
                          >
                            Watch
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Progress Widget & Resources (1 Col) */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-700">Overall Progress</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold font-mono text-brand-navy">{course.progress}%</span>
              <span className="text-xs text-gray-500">{course.completedLessons} / {course.totalLessons} Done</span>
            </div>

            <ProgressBar value={course.progress} variant="crimson" size="md" />

            <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Assessment Status:</span>
                <span className="font-semibold text-amber-600">Eligible to Attempt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Passing Threshold:</span>
                <span className="font-semibold text-gray-900">70% Score</span>
              </div>
            </div>
          </div>

          {/* Downloadable Resources Box */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <Download className="h-4 w-4 text-brand-crimson" />
              <span>Course Resources</span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-800">Solar_Atlas_Pakistan.pdf</span>
                </div>
                <span className="text-[10px] text-gray-500">3.4 MB</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-gray-800">Structure_CAD_Layout.dwg</span>
                </div>
                <span className="text-[10px] text-gray-500">5.2 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
