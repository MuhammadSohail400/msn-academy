import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  User,
  Globe,
  CheckCircle2,
  Award,
  ArrowLeft,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import SyllabusAccordion from '../../components/public/SyllabusAccordion';
import StickyEnrollCard from '../../components/public/StickyEnrollCard';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import courseService from '../../services/courseService';

export default function CourseDetails() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await courseService.getCourseBySlug(slug);
      const courseData = res.data;
      setCourse(courseData);

      // Fetch syllabus if course ID is available
      if (courseData?._id) {
        try {
          const syllabusRes = await courseService.getCourseSyllabus(courseData._id);
          setSyllabus(syllabusRes.data?.modules || courseData.modules || []);
        } catch {
          setSyllabus(courseData.modules || []);
        }
      } else {
        setSyllabus(courseData.modules || []);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCourseData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-64 w-full" rounded="rounded-2xl" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-40 w-full" rounded="rounded-xl" />
            <Skeleton className="h-64 w-full" rounded="rounded-xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 w-full" rounded="rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Course Not Found"
          description="The requested course could not be found or has been moved."
          onRetry={fetchCourseData}
        />
        <div className="mt-6 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-crimson"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Course Directory
          </Link>
        </div>
      </div>
    );
  }

  const {
    title = '',
    subtitle = '',
    description = '',
    category = 'Technology',
    level = 'All Levels',
    badge,
    language = 'English / Urdu',
    price = 0,
    originalPrice,
    averageRating = 4.8,
    totalReviews = 0,
    enrolledStudentsCount = 0,
    durationHours = 0,
    totalLectures = 0,
    instructor = {},
    learningOutcomes = [],
    prerequisites = [],
  } = course;

  const instructorName = typeof instructor === 'object' ? instructor?.name : instructor || 'MSN Faculty';
  const instructorTitle = typeof instructor === 'object' ? instructor?.title : 'Senior Technology Lead';
  const instructorBio = typeof instructor === 'object' ? instructor?.bio : 'Experienced software architect and mentor in Pakistan.';
  const instructorAvatar = typeof instructor === 'object' ? instructor?.avatarUrl : null;

  return (
    <div className="pb-16">
      {/* Course Hero Banner */}
      <section className="bg-brand-navy-dark text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Back link */}
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
              </Link>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {badge && <Badge variant="crimson">{badge}</Badge>}
                <Badge variant="navy" className="bg-white/10 text-white">
                  {category}
                </Badge>
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
                  {level}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-display text-2xl font-extrabold sm:text-4xl text-white">
                {title}
              </h1>

              {subtitle && <p className="text-sm sm:text-base text-gray-300">{subtitle}</p>}

              {/* Ratings & Meta */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({totalReviews} ratings)</span>
                </div>

                <span>•</span>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-brand-crimson" />
                  <span>{enrolledStudentsCount.toLocaleString()} students enrolled</span>
                </div>

                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>{durationHours} hours total</span>
                </div>

                <span>•</span>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span>{language}</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3">
                {instructorAvatar ? (
                  <img
                    src={instructorAvatar}
                    alt={instructorName}
                    className="h-10 w-10 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-400">Instructed by</div>
                  <div className="text-sm font-semibold text-white">{instructorName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body & Sticky Sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* What You'll Learn */}
            {learningOutcomes.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-brand-navy">
                  What You Will Learn
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {learningOutcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Description */}
            <div>
              <h3 className="font-display text-xl font-bold text-brand-navy">Course Overview</h3>
              <div className="mt-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line space-y-3">
                {description ||
                  'This comprehensive vocational training program equips students with real-world skills, live coding projects, and industry best practices. Designed specifically for the Pakistani job market and remote freelance careers.'}
              </div>
            </div>

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-brand-navy">Prerequisites</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
                  {prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div>
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">
                Course Content & Syllabus
              </h3>
              <SyllabusAccordion modules={syllabus} />
            </div>

            {/* Instructor Profile Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="font-display text-xl font-bold text-brand-navy mb-4">
                About the Instructor
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {instructorAvatar ? (
                  <img
                    src={instructorAvatar}
                    alt={instructorName}
                    className="h-16 w-16 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy font-bold text-xl">
                    {instructorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-lg font-bold text-brand-navy">{instructorName}</h4>
                  <p className="text-xs font-semibold text-brand-crimson">{instructorTitle}</p>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">{instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <StickyEnrollCard course={course} />
          </div>
        </div>
      </section>
    </div>
  );
}
