import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Award, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import learningService from '../../services/learningService';
import Button from '../../components/ui/Button';

export default function MyCourses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | IN_PROGRESS | COMPLETED
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await learningService.getMyEnrollments();
      // res is ApiResponse with data array or res.data
      const data = res?.data || res || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
      setError('Unable to load your enrolled courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inProgressList = enrollments.filter((e) => !e.isCompleted && (e.progressPercentage || 0) < 100);
  const completedList = enrollments.filter((e) => e.isCompleted || (e.progressPercentage || 0) >= 100);

  const displayedList =
    activeTab === 'IN_PROGRESS'
      ? inProgressList
      : activeTab === 'COMPLETED'
      ? completedList
      : enrollments;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <span>My Courses LMS</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">My Courses</span>
      </nav>

      {/* Header Section */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-1 text-sm text-gray-600">
          All enrolled courses. No marketplace or discovery content here.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'ALL'
              ? 'bg-white shadow-sm text-brand-navy border border-gray-200 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          All Courses ({enrollments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-white shadow-sm text-brand-navy border border-gray-200 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          In Progress ({inProgressList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('COMPLETED')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'COMPLETED'
              ? 'bg-white shadow-sm text-brand-navy border border-gray-200 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Completed ({completedList.length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchEnrollments}
            className="text-xs font-semibold underline hover:no-underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm animate-pulse"
            >
              <div className="h-32 sm:h-24 sm:w-44 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 w-1/3 rounded bg-gray-200" />
                <div className="h-4 w-1/4 rounded bg-gray-200" />
                <div className="h-3 w-3/4 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Cards List */}
      {!isLoading && displayedList.length > 0 && (
        <div className="space-y-4">
          {displayedList.map((course) => {
            const isFinished = course.isCompleted || (course.progressPercentage || 0) >= 100;
            const progress = course.progressPercentage || 0;
            const targetLessonId = course.lastAccessedLesson?.id;
            const continueUrl = targetLessonId
              ? `/learn/${course.courseId}/lesson/${targetLessonId}`
              : `/learn/${course.courseId}`;

            return (
              <div
                key={course.enrollmentId || course.courseId}
                className="group relative flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5 rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-full sm:w-44 h-36 sm:h-28 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand-navy/5 text-brand-navy">
                        <BookOpen className="h-8 w-8 text-brand-navy/40" />
                      </div>
                    )}
                    {/* Mobile Progress Badge */}
                    <div className="sm:hidden absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                      {progress}%
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {isFinished ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          In Progress
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {course.lastAccessedLesson?.title
                        ? course.lastAccessedLesson.title
                        : `Course Modules · ${course.completedLecturesCount || 0} of ${course.totalLectures || 0} completed`}
                    </p>

                    {/* Progress Bar Row */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFinished ? 'bg-emerald-500' : 'bg-brand-crimson'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(progress, isFinished ? 100 : 0))}%` }}
                        />
                      </div>
                      <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-gray-700 min-w-[36px] text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 xl:flex-shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-gray-100 justify-end w-full xl:w-auto">
                  {isFinished ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/certificate`)}
                        className="flex-1 sm:flex-initial !border-emerald-600 !text-emerald-700 hover:!bg-emerald-50 text-xs font-semibold whitespace-nowrap"
                      >
                        <Award className="mr-1.5 h-4 w-4" />
                        View Certificate
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/learn/${course.courseId}`)}
                        className="flex-1 sm:flex-initial text-xs font-medium whitespace-nowrap"
                      >
                        Course Overview
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => navigate(continueUrl)}
                      className="w-full sm:w-auto !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-sm text-sm font-semibold flex items-center justify-center gap-1.5 px-5 py-2.5 whitespace-nowrap"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && displayedList.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-gray-900">
            {activeTab === 'COMPLETED'
              ? 'No completed courses yet'
              : activeTab === 'IN_PROGRESS'
              ? 'No courses in progress'
              : 'No enrolled courses found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md">
            {activeTab === 'COMPLETED'
              ? 'Keep learning to complete your courses and earn verified certificates!'
              : 'Explore our catalog and enroll in high-impact programs designed for career acceleration.'}
          </p>
          <div className="mt-6">
            <Link to="/courses">
              <Button variant="primary" size="md">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
