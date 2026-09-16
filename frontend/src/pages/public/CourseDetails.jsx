import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Award,
  PlayCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import StickyEnrollCard from '../../components/public/StickyEnrollCard';
import CourseCard from '../../components/public/CourseCard';
import courseService from '../../services/courseService';

export default function CourseDetails() {
  const { slug } = useParams();
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadCourse() {
      setIsLoading(true);
      setError('');
      try {
        const res = await courseService.getCourseBySlug(slug);
        if (!cancelled) {
          setCourse(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Course not found');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadCourse();
    return () => { cancelled = true; };
  }, [slug]);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-crimson" />
          <p className="text-sm text-slate-500">Loading course…</p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error || !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-400 mb-4" />
        <h1 className="font-display text-2xl font-bold text-slate-900">Course Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'This course does not exist or is not published.'}</p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover"
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  // ── Derived data (API response fields) ────────────────────────────────────
  const modules = course.modules || [];
  const learningOutcomes = course.learningOutcomes || [];
  const prerequisites = course.prerequisites || [];
  const instructor = course.instructor || { name: 'MSN Academy Instructor', title: '' };

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Dark Navy Hero Header */}
      <section className="bg-brand-navy text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-200 font-medium">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Category & Badge Pills */}
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 border border-sky-500/30">
                  {course.category}
                </span>
                {course.level && (
                  <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                    {course.level}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {course.title}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle || course.description}
              </p>

              {/* Meta Stats Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
                {course.averageRating != null && (
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-white">{Number(course.averageRating).toFixed(1)}</span>
                  </div>
                )}
                {course.enrolledStudentsCount != null && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{course.enrolledStudentsCount}+ enrolled</span>
                  </div>
                )}
                {course.totalLectures != null && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>{course.totalLectures} lessons</span>
                  </div>
                )}
                {course.durationHours != null && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{course.durationHours} hours</span>
                  </div>
                )}
              </div>

              {/* Instructor Subtitle */}
              {instructor.name && (
                <p className="text-xs sm:text-sm text-slate-400 pt-1">
                  Instructor: <strong className="text-slate-200">{instructor.name}</strong>
                  {instructor.title && <> · <span>{instructor.title}</span></>}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* What You'll Learn Card */}
            {learningOutcomes.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-5">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {learningOutcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum Accordion */}
            {modules.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Course Curriculum
                </h3>

                <div className="space-y-3">
                  {modules.map((mod, idx) => {
                    const isOpen = openModuleIndex === idx;
                    const lectures = mod.lectures || [];
                    return (
                      <div
                        key={mod.id || idx}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
                          className="flex w-full items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-slate-500 shrink-0" />
                            <span className="font-display text-sm font-bold text-slate-900">
                              {mod.title}
                            </span>
                            <span className="text-xs text-slate-400">
                              {lectures.length} lessons
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && lectures.length > 0 && (
                          <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                            {lectures.map((lecture, lIdx) => (
                              <div
                                key={lecture.id || lIdx}
                                className="flex items-center justify-between px-5 py-3.5 text-xs text-slate-700"
                              >
                                <div className="flex items-center gap-2.5">
                                  {lecture.isPreview ? (
                                    <PlayCircle className="h-4 w-4 text-brand-crimson" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                                  )}
                                  <span>{lecture.title}</span>
                                  {lecture.isPreview && (
                                    <span className="text-[10px] font-bold text-brand-crimson uppercase">Preview</span>
                                  )}
                                </div>
                                {lecture.durationMinutes != null && (
                                  <span className="text-slate-400">{lecture.durationMinutes} min</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prerequisites / Requirements */}
            {prerequisites.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Requirements
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Your Instructor Card */}
            {instructor.name && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="font-display text-base font-bold text-slate-900 mb-4">
                  Your Instructor
                </h3>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-white font-display text-lg font-bold shrink-0">
                    {instructor.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-900">
                      {instructor.name}
                    </h4>
                    {instructor.title && (
                      <p className="text-xs font-semibold text-brand-crimson mt-0.5">
                        {instructor.title}
                      </p>
                    )}
                    {instructor.bio && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Certificate of Completion Banner */}
            <div className="rounded-2xl bg-brand-navy p-6 text-white flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-crimson text-white shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold text-white">
                  Certificate of Completion
                </h4>
                <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                  After passing the final assessment (70% or above), you receive a verifiable certificate with a unique ID and QR code.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-28">
            <StickyEnrollCard course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
