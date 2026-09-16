import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  if (!course) return null;

  const {
    slug = '',
    title = 'Untitled Course',
    category = 'General',
    thumbnail,
    price = 0,
    averageRating = 4.8,
    durationHours = 0,
    totalLectures = 0,
    badge,
    badgeColor = 'amber',
    categoryColor = 'blue',
    description = '',
    isComingSoon = false,
  } = course;

  const ratingVal = typeof averageRating === 'number' ? averageRating.toFixed(1) : '4.8';
  const formattedPrice = `PKR ${price.toLocaleString()}`;

  // Badge background class map
  const badgeClasses = {
    amber: 'bg-amber-500 text-slate-950',
    pink: 'bg-pink-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    purple: 'bg-purple-600 text-white',
    red: 'bg-brand-red text-white',
  }[badgeColor] || 'bg-amber-500 text-slate-950';

  // Category pill style map
  const categoryClasses = {
    blue: 'text-blue-600 bg-blue-50',
    rose: 'text-rose-600 bg-rose-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    purple: 'text-purple-600 bg-purple-50',
  }[categoryColor] || 'text-blue-600 bg-blue-50';

  return (
    <article className={`bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md ${isComingSoon ? 'opacity-95' : ''}`}>
      {/* Card Header / Image */}
      <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            alt={title}
            src={thumbnail}
            className={`w-full h-full object-cover ${isComingSoon ? 'opacity-60' : ''}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
            MSN Academy
          </div>
        )}

        {isComingSoon && (
          <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
            <span className="bg-slate-900/90 text-white border border-slate-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Coming Soon
            </span>
          </div>
        )}

        {badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded ${categoryClasses}`}>
            {category}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <span className="text-amber-500">★</span> {ratingVal}
          </div>
        </div>

        <Link to={isComingSoon ? '#' : `/courses/${slug}`} className="hover:text-brand-red transition-colors">
          <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">{title}</h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 border-t border-b border-slate-100 py-2.5 mb-4">
          <span>📖 {totalLectures} lessons</span>
          <span>⏱ {durationHours} hours</span>
          <span>👥 100+</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Price</span>
            <span className="text-base font-extrabold text-slate-900">{formattedPrice}</span>
          </div>

          {isComingSoon ? (
            <button className="bg-slate-100 text-slate-400 font-bold text-xs px-5 py-2.5 rounded-lg cursor-not-allowed" disabled>
              Coming Soon
            </button>
          ) : (
            <Link
              className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors inline-block"
              to={`/courses/${slug}`}
            >
              View Course
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
    price: PropTypes.number.isRequired,
    averageRating: PropTypes.number,
    durationHours: PropTypes.number,
    totalLectures: PropTypes.number,
    badge: PropTypes.string,
    badgeColor: PropTypes.string,
    categoryColor: PropTypes.string,
    description: PropTypes.string,
    isComingSoon: PropTypes.bool,
  }).isRequired,
};

