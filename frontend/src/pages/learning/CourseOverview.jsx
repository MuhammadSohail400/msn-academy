import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Lock,
  Download,
  FileText,
  ChevronRight,
  ChevronDown,
  Award,
  AlertCircle,
  Play,
  BarChart2,
} from 'lucide-react';
import learningService from '../../services/learningService';
import Button from '../../components/ui/Button';

export default function CourseOverview() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    if (courseId) {
      fetchOverview();
    }
  }, [courseId]);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await learningService.getCourseOverview(courseId);
      const data = res?.data || res;
      setCourseData(data);

      // Expand all modules by default
      if (data?.modules) {
        const initial = {};
        data.modules.forEach((mod) => {
          initial[mod.id] = true;
        });
        setExpandedModules(initial);
      }
    } catch (err) {
      console.error('Failed to load course overview:', err);
      setError('Could not load course curriculum. Please ensure you are enrolled.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-12 animate-pulse">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="flex justify-between items-center">
          <div className="h-10 w-72 rounded bg-gray-200" />
          <div className="h-10 w-36 rounded bg-gray-200" />
        </div>
        <div className="h-28 rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-44 rounded-2xl bg-gray-200" />
            <div className="h-44 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Unable to load course</h2>
        <p className="mt-2 text-sm text-gray-600">{error || 'Course overview could not be found.'}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={fetchOverview}>
            Try Again
          </Button>
          <Link to="/my-courses">
            <Button variant="primary">Back to My Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    progressPercentage = 0,
    totalLectures = 0,
    completedLecturesCount = 0,
    canTakeAssessment = false,
    modules = [],
  } = courseData;

  // Find first in-progress or next uncompleted lesson
  let nextLessonToWatch = null;
  for (const mod of modules) {
    for (const lec of mod.lectures || []) {
      if (!lec.isCompleted) {
        nextLessonToWatch = lec;
        break;
      }
    }
    if (nextLessonToWatch) break;
  }
  // If all completed, default to first lesson
  if (!nextLessonToWatch && modules[0]?.lectures?.[0]) {
    nextLessonToWatch = modules[0].lectures[0];
  }

  const continueHref = nextLessonToWatch
    ? `/learn/${courseId}/lesson/${nextLessonToWatch.id}`
    : `/learn/${courseId}`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <Link to="/my-courses" className="hover:text-gray-900 transition-colors">
          My Courses
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-md">{title}</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            By MSN Academy Instructor · {totalLectures} lessons · Comprehensive Program
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(continueHref)}
          className="!bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-sm text-sm font-semibold flex items-center justify-center gap-2 px-6 py-2.5"
        >
          <Play className="h-4 w-4 fill-white" />
          Continue Learning
        </Button>
      </div>

      {/* Progress Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold text-gray-900">Your Progress</span>
          <span className="font-display text-sm font-bold text-brand-crimson">{progressPercentage}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-crimson transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {completedLecturesCount} of {totalLectures} lessons completed
        </p>
      </div>

      {/* Main Content Layout: Curriculum on Left, Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Course Curriculum */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Course Curriculum</h2>

          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules[mod.id] ?? true;
            const lectures = mod.lectures || [];

            return (
              <div
                key={mod.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Module Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between bg-gray-50/70 px-5 py-4 text-left transition-colors hover:bg-gray-100/70"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-brand-navy" />
                    <div>
                      <span className="font-display text-sm sm:text-base font-bold text-brand-navy">
                        {mod.title}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {lectures.length} {lectures.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {/* Module Lectures */}
                {isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {lectures.map((lec, lecIdx) => {
                      const isCurrent = nextLessonToWatch?.id === lec.id && !lec.isCompleted;

                      return (
                        <div
                          key={lec.id}
                          className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                            isCurrent
                              ? 'bg-red-50/40 border-l-4 border-brand-crimson'
                              : 'hover:bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {lec.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                            ) : isCurrent ? (
                              <PlayCircle className="h-5 w-5 flex-shrink-0 text-brand-crimson" />
                            ) : (
                              <Lock className="h-4 w-4 flex-shrink-0 text-gray-300" />
                            )}
                            <div className="min-w-0">
                              <span
                                className={`text-sm font-medium truncate block ${
                                  isCurrent
                                    ? 'text-brand-crimson font-semibold'
                                    : lec.isCompleted
                                    ? 'text-gray-900'
                                    : 'text-gray-600'
                                }`}
                              >
                                {lec.title}
                              </span>
                            </div>
                            {isCurrent && (
                              <span className="hidden sm:inline-flex rounded-full bg-brand-crimson px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>

                          {/* Right: Duration & Action */}
                          <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500 ml-4">
                            <span>{lec.durationMinutes ? `${lec.durationMinutes} min` : '10 min'}</span>
                            {lec.isCompleted ? (
                              <Link
                                to={`/learn/${courseId}/lesson/${lec.id}`}
                                className="font-semibold text-brand-crimson hover:underline"
                              >
                                Rewatch
                              </Link>
                            ) : isCurrent ? (
                              <Link
                                to={`/learn/${courseId}/lesson/${lec.id}`}
                                className="font-semibold text-brand-crimson hover:underline"
                              >
                                Watch
                              </Link>
                            ) : (
                              <span className="text-gray-400">Locked</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Assessment Banner Card */}
          <div className="mt-8 rounded-2xl bg-brand-navy p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-crimson">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Final Assessment</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-lg">
                  Complete all lessons to unlock · MCQ · 70% to pass · 2 hours · Unlimited attempts
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              {canTakeAssessment ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`/learn/${courseId}/assessment`)}
                  className="w-full sm:w-auto !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-md text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Take Assessment
                </Button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed border border-white/10"
                >
                  <Lock className="h-4 w-4" />
                  Locked
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Resources & Progress Summary */}
        <div className="space-y-6">
          {/* Downloadable Resources Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
              <Download className="h-5 w-5 text-brand-crimson" />
              <span>Resources</span>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Course Slides.pdf', size: '2.4 MB' },
                { title: 'Exercise Files.zip', size: '8.1 MB' },
                { title: 'Reference Guide.pdf', size: '1.2 MB' },
              ].map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Download className="h-4 w-4 text-brand-crimson flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{res.title}</span>
                  </div>
                  <span className="text-gray-400 flex-shrink-0 ml-2">{res.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
              <BarChart2 className="h-5 w-5 text-brand-crimson" />
              <span>Progress Summary</span>
            </div>
            <div className="space-y-3 divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-500">Lessons Completed</span>
                <span className="font-bold text-gray-900">
                  {completedLecturesCount} / {totalLectures}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-gray-500">Assessment</span>
                <span
                  className={`font-bold ${
                    canTakeAssessment ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {canTakeAssessment ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-gray-500">Certificate</span>
                <span
                  className={`font-bold ${
                    progressPercentage >= 100 ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {progressPercentage >= 100 ? 'Earned' : 'Not earned'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
