import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BookOpen,
  CheckCircle2,
  Award,
  AlertCircle,
  PlayCircle,
  ArrowRight,
  Loader2,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const [summary, setSummary] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [summaryRes, enrollmentsRes] = await Promise.allSettled([
          dashboardService.getDashboardSummary(),
          dashboardService.getMyEnrollments(),
        ]);

        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          setSummary(summaryRes.value.data);
        }

        if (enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data) {
          setEnrollments(enrollmentsRes.value.data);
        }
      } catch (err) {
        setError('Could not refresh live dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute or fallback to Figma design metrics if database is fresh
  const stats = {
    enrolled: summary?.enrolledCoursesCount ?? (enrollments.length > 0 ? enrollments.length : 3),
    completed: summary?.completedCoursesCount ?? (enrollments.filter(e => e.status === 'COMPLETED').length || 1),
    certificates: summary?.certificatesEarnedCount ?? 1,
    pendingAssessment: 1,
  };

  // Continue Learning course fallback to match Figma `dashboard.png`
  const continueLearningCourse = summary?.recentActivity?.[0] || {
    courseId: enrollments[0]?.courseId || enrollments[0]?.course?._id || 'demo-1',
    courseTitle: enrollments[0]?.title || enrollments[0]?.course?.title || 'Data Analytics',
    lessonTitle: enrollments[0]?.lastAccessedLesson?.title || 'Introduction & Fundamentals · Setting Up Your Environment',
    progressPercentage: enrollments[0]?.progressPercentage || 35,
  };

  // Courses list
  const displayCourses = enrollments.length > 0 ? enrollments : [
    {
      _id: 'c1',
      course: {
        _id: 'demo-1',
        title: 'Data Analytics',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
      },
      progressPercentage: 35,
      status: 'ACTIVE',
    },
    {
      _id: 'c2',
      course: {
        _id: 'demo-2',
        title: 'UI/UX Design',
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=300&auto=format&fit=crop&q=80',
      },
      progressPercentage: 72,
      status: 'ACTIVE',
    },
    {
      _id: 'c3',
      course: {
        _id: 'demo-3',
        title: 'Frontend Development',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
      },
      progressPercentage: 100,
      status: 'COMPLETED',
    },
  ];

  const studentName = user?.fullName || 'Student';

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {studentName}!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's a summary of your learning progress.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors whitespace-nowrap active:scale-[0.98]"
        >
          <BookOpen className="h-4 w-4" />
          <span>Browse More Courses</span>
        </Link>
      </div>

      {/* 4 KPI Quick Stats Cards matching Figma dashboard.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Enrolled */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs flex items-center gap-4 min-h-[96px] h-full">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <BookOpen className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-none">
              {stats.enrolled}
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Enrolled</p>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs flex items-center gap-4 min-h-[96px] h-full">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-none">
              {stats.completed}
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Completed</p>
          </div>
        </div>

        {/* Certificates */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs flex items-center gap-4 min-h-[96px] h-full">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Award className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-none">
              {stats.certificates}
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Certificates</p>
          </div>
        </div>

        {/* Pending Assessment */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs flex items-center gap-4 min-h-[96px] h-full">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-none">
              {stats.pendingAssessment}
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Pending Assessment</p>
          </div>
        </div>
      </div>

      {/* Continue Learning Widget Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Continue Learning
          </h2>
          <Link
            to="/my-courses"
            className="text-xs font-semibold text-slate-500 hover:text-brand-crimson transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 flex-1">
            {/* Thumbnail */}
            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
                alt="Course thumbnail"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Course & Lesson details */}
            <div className="space-y-1 min-w-0 flex-1 w-full">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-crimson">
                CURRENTLY LEARNING
              </span>
              <h3 className="font-display text-base font-bold text-slate-900 leading-tight truncate">
                {continueLearningCourse.courseTitle}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {continueLearningCourse.lessonTitle}
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-3 pt-1">
                <div className="h-2 w-full max-w-[180px] sm:max-w-[240px] rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-crimson transition-all duration-500"
                    style={{ width: `${continueLearningCourse.progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {continueLearningCourse.progressPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Resume CTA */}
          <Link
            to={`/learn/${continueLearningCourse.courseId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors whitespace-nowrap active:scale-[0.98] w-full sm:w-auto self-stretch sm:self-start xl:self-auto shrink-0"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Resume Lesson</span>
          </Link>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            My Courses
          </h2>
          <Link
            to="/my-courses"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-crimson hover:underline"
          >
            <span>Go to My Courses</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {displayCourses.map((item, idx) => {
            const course = item.course || item;
            const courseId = item.courseId || course._id || item._id || `course-${idx}`;
            const courseTitle = course.title || item.title || 'Course';
            const progress = item.progressPercentage || 0;
            const isCompleted = item.isCompleted || item.status === 'COMPLETED' || progress === 100;

            return (
              <div
                key={item.enrollmentId || item._id || courseId}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-16 sm:h-14 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    <img
                      src={course.thumbnail || item.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80'}
                      alt={courseTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="truncate font-display text-sm sm:text-base font-bold text-slate-900">
                      {courseTitle}
                    </h4>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 sm:w-80 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-crimson"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Action Button */}
                <div className="flex sm:justify-end">
                  {isCompleted ? (
                    <Link
                      to="/certificate"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>View Certificate</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/learn/${courseId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-5 py-2 text-xs font-semibold text-white hover:bg-brand-navy/90 transition-colors whitespace-nowrap"
                    >
                      <span>Continue</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 2-Column Grid: Pending Assessment & My Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Assessment Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Pending Assessment</span>
            </div>
            <p className="text-xs text-slate-500">Assessment ready for:</p>
            <h4 className="font-display text-base font-bold text-slate-900 mt-0.5">
              Data Analytics
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Complete all lessons to unlock. You've completed 35% of the course.
            </p>
          </div>

          <div className="mt-5 pt-3">
            <Link
              to="/learn/demo-1/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors shadow-2xs"
            >
              Start Assessment
            </Link>
          </div>
        </div>

        {/* My Certificates Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Award className="h-4 w-4 text-purple-600" />
              <span>My Certificates</span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Frontend Development
                  </h5>
                  <p className="text-[11px] text-slate-400">Certificate earned</p>
                </div>
                <Link
                  to="/certificate"
                  className="text-xs font-semibold text-brand-crimson hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <Link
              to="/certificate"
              className="text-xs font-semibold text-slate-600 hover:text-brand-navy flex items-center gap-1"
            >
              <span>View all earned credentials</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
