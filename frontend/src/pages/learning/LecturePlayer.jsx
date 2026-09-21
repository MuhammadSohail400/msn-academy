import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Lock,
  Download,
  AlertCircle,
  Award,
} from 'lucide-react';
import learningService from '../../services/learningService';
import VideoPlayer from '../../components/learning/VideoPlayer';
import Button from '../../components/ui/Button';

export default function LecturePlayer() {
  const { courseId, id: lessonId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [courseOverview, setCourseOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (courseId && lessonId) {
      loadLessonAndOverview();
    }
  }, [courseId, lessonId]);

  const loadLessonAndOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [lessonRes, overviewRes] = await Promise.all([
        learningService.getLessonContent(courseId, lessonId),
        learningService.getCourseOverview(courseId),
      ]);

      setLessonData(lessonRes?.data || lessonRes);
      setCourseOverview(overviewRes?.data || overviewRes);
    } catch (err) {
      console.error('Error loading lecture player:', err);
      setError('Could not load lesson. Please verify your enrollment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      await learningService.completeLesson(courseId, lessonId);
      // Update local completed state
      setLessonData((prev) => (prev ? { ...prev, isCompleted: true } : prev));

      // Refresh overview to update counts and checkmarks
      const overviewRes = await learningService.getCourseOverview(courseId);
      setCourseOverview(overviewRes?.data || overviewRes);

      // If next lesson exists, advance
      if (lessonData?.nextLessonId) {
        navigate(`/learn/${courseId}/lesson/${lessonData.nextLessonId}`);
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
        <div className="h-6 w-72 rounded bg-gray-200" />
        <div className="h-8 w-96 rounded bg-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full rounded-2xl bg-gray-200" />
            <div className="h-32 rounded-2xl bg-gray-200" />
          </div>
          <div className="h-96 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Lesson Unavailable</h2>
          <p className="mt-2 text-sm text-gray-600">{error || 'Could not load lecture contents.'}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={`/learn/${courseId}`}>
              <Button variant="primary">Return to Course Overview</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find module title for breadcrumb
  let activeModuleName = 'Course Curriculum';
  let allLecturesList = [];
  if (courseOverview?.modules) {
    for (const mod of courseOverview.modules) {
      for (const lec of mod.lectures || []) {
        allLecturesList.push({ ...lec, moduleId: mod.id, moduleTitle: mod.title });
        if (lec.id === lessonId) {
          activeModuleName = mod.title;
        }
      }
    }
  }

  const currentLectureIndex = allLecturesList.findIndex((l) => l.id === lessonId);
  const totalLecturesCount = allLecturesList.length || 1;
  const currentStep = currentLectureIndex >= 0 ? currentLectureIndex + 1 : 1;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumb */}
      <nav className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
        <div className="flex items-center gap-2 truncate">
          <Link to={`/learn/${courseId}`} className="hover:text-gray-900 transition-colors">
            {courseOverview?.title || 'Course'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate hidden sm:inline-block">{activeModuleName}</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 hidden sm:inline-block" />
          <span className="text-gray-900 font-semibold truncate">{lessonData.title}</span>
        </div>

        {/* Mobile Curriculum Toggle */}
        <button
          type="button"
          onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
          className="lg:hidden flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
        >
          <BookOpen className="h-4 w-4" />
          Curriculum
        </button>
      </nav>

      {/* Lesson Heading */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          {lessonData.title}
        </h1>
      </div>

      {/* Main Player Grid: Player + Description on Left, Curriculum Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Video Player & Lesson Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Branded Video Player */}
          <VideoPlayer
            videoUrl={lessonData.videoStreamUrl}
            title={lessonData.title}
            durationMinutes={lessonData.durationMinutes || 12}
            onVideoCompleted={() => {
              if (!lessonData.isCompleted) {
                handleMarkComplete();
              }
            }}
          />

          {/* Lesson Description Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-display text-lg font-bold text-gray-900">Lesson Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {lessonData.description ||
                "In this lesson, you'll learn how to set up your local development environment for data analytics work. We'll install the necessary tools including Python, Jupyter Notebooks, and the key data analysis libraries you'll use throughout the course. By the end of this lesson, you will have a fully functional analytics workstation ready for the hands-on exercises in upcoming lessons."}
            </p>
          </div>

          {/* Downloadable Resources Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
              <Download className="h-5 w-5 text-brand-crimson" />
              <span>Downloadable Resources</span>
            </div>
            <div className="space-y-2">
              {(lessonData.resources && lessonData.resources.length > 0
                ? lessonData.resources
                : [
                    { title: 'Exercise Files.zip', downloadUrl: '#', size: '8.1 MB' },
                    { title: 'Reference Guide.pdf', downloadUrl: '#', size: '1.2 MB' },
                  ]
              ).map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-xs sm:text-sm hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Download className="h-4 w-4 text-brand-crimson flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{res.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{res.size || 'Download'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Lesson Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Prev Lesson Button */}
            {lessonData.prevLessonId ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/learn/${courseId}/lesson/${lessonData.prevLessonId}`)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>
            ) : (
              <div className="hidden sm:block w-32" />
            )}

            {/* Lesson Step Indicator Bar */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">
                Lesson {currentStep} of {totalLecturesCount}
              </span>
              <div className="flex items-center gap-1">
                {allLecturesList.map((lec, idx) => (
                  <div
                    key={lec.id}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentLectureIndex
                        ? 'w-6 bg-brand-crimson'
                        : lec.isCompleted
                        ? 'w-4 bg-emerald-500'
                        : 'w-3 bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Next Lesson / Mark Complete Button */}
            {lessonData.nextLessonId ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleMarkComplete}
                isLoading={isCompleting}
                className="w-full sm:w-auto !bg-brand-crimson hover:!bg-brand-crimson-dark text-white rounded-xl shadow-sm text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 px-5"
              >
                <span>{lessonData.isCompleted ? 'Next Lesson' : 'Next Lesson'}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/learn/${courseId}/assessment`)}
                className="w-full sm:w-auto !bg-emerald-600 hover:!bg-emerald-700 text-white rounded-xl shadow-sm text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 px-5"
              >
                <Award className="h-4 w-4" />
                <span>Take Assessment</span>
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Course Curriculum Tree */}
        <div
          className={`${
            isCurriculumOpen ? 'block' : 'hidden lg:block'
          } rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 lg:sticky lg:top-20`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-display text-base font-bold text-gray-900">Course Curriculum</h3>
            <span className="text-xs text-gray-500">
              {courseOverview?.completedLecturesCount || 0}/{totalLecturesCount} completed
            </span>
          </div>

          <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
            {courseOverview?.modules?.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5 text-brand-navy" />
                  <span>{mod.title}</span>
                </div>

                <div className="space-y-1.5 pl-2">
                  {mod.lectures?.map((lec) => {
                    const isCurrent = lec.id === lessonId;

                    return (
                      <Link
                        key={lec.id}
                        to={`/learn/${courseId}/lesson/${lec.id}`}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                          isCurrent
                            ? 'bg-brand-crimson/10 text-brand-crimson font-bold border border-brand-crimson/30 shadow-sm'
                            : lec.isCompleted
                            ? 'hover:bg-gray-50 text-gray-800 font-medium'
                            : 'hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {lec.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : isCurrent ? (
                            <PlayCircle className="h-4 w-4 text-brand-crimson flex-shrink-0" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className="truncate">{lec.title}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">
                          {lec.durationMinutes ? `${lec.durationMinutes}m` : '10m'}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
