import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users } from 'lucide-react';

const CATEGORY_STYLES = {
  'Data Science': 'bg-sky-100 text-sky-700',
  'Design': 'bg-pink-100 text-pink-700',
  'Web Development': 'bg-emerald-100 text-emerald-700',
  'Artificial Intelligence': 'bg-purple-100 text-purple-700',
  'Marketing': 'bg-amber-100 text-amber-700',
  'Productivity': 'bg-cyan-100 text-cyan-700',
};

const BADGE_STYLES = {
  'Bestseller': 'bg-amber-400 text-slate-900 font-extrabold',
  'Design': 'bg-pink-600 text-white font-bold',
  'Job Ready': 'bg-emerald-600 text-white font-bold',
  'Advanced': 'bg-purple-700 text-white font-bold',
  'Beginner': 'bg-slate-800 text-white font-bold',
};

export default function CourseCard({ course }) {
  if (!course) return null;

  const id = course.id || course._id;
  const slug = course.slug || id;
  const title = course.title || 'Course';
  const subtitle = course.subtitle || course.description || '';
  const thumbnail =
    course.thumbnail ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  const category = course.category || 'Data Science';
  const price = course.price ?? 15000;
  const rating = course.averageRating || 4.8;
  const durationHours = course.durationHours || 38;
  const totalLectures = course.totalLectures || 42;
  const studentsCount = course.enrolledCount || '100+';
  const badge = course.badge || 'Bestseller';
  const isComingSoon = course.isComingSoon || title.toLowerCase().includes('automation');

  const categoryClass = CATEGORY_STYLES[category] || 'bg-slate-100 text-slate-700';
  const badgeClass = BADGE_STYLES[badge] || 'bg-brand-navy text-white font-bold';

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Thumbnail + Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left Category/State Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className={`rounded px-2.5 py-0.5 text-xs tracking-tight shadow-sm ${badgeClass}`}>
              {badge}
            </span>
          </div>
        )}

        {/* Translucent Coming Soon overlay if applicable */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 shadow">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category Pill + Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${categoryClass}`}>
            {category}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/courses/${slug}`}
          className="font-display text-base sm:text-lg font-bold text-slate-900 hover:text-brand-crimson transition-colors line-clamp-1"
        >
          {title}
        </Link>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed h-10 overflow-hidden">
          {subtitle}
        </p>

        {/* Metrics Row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1 shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>{totalLectures} lessons</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{durationHours} hours</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{studentsCount}</span>
          </div>
        </div>

        {/* Price Row (anchored to bottom) */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-baseline justify-between gap-2">
          <div className="font-display text-base sm:text-lg font-extrabold text-slate-900 shrink-0">
            PKR {price.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 truncate text-right">
            by MSN Academy
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-3">
          {isComingSoon ? (
            <button
              disabled
              className="w-full h-11 flex items-center justify-center rounded-xl bg-slate-100 text-center text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          ) : (
            <Link
              to={`/courses/${slug}`}
              className="w-full h-11 flex items-center justify-center rounded-xl bg-brand-crimson text-center text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
            >
              View Course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
