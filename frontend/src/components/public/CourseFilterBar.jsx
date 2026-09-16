import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Design',
  'Digital Marketing',
  'Freelancing',
];

export default function CourseFilterBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  selectedLevel,
  setSelectedLevel,
  totalResults = 0,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm mb-8 space-y-4">
      {/* Top Search Bar & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vocational courses (e.g., React, Python, UI/UX, Freelancing)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-crimson/10 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-crimson focus:bg-white focus:outline-none transition-all"
          >
            <option value="ALL">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-crimson focus:bg-white focus:outline-none transition-all"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-1 hidden sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Category:</span>
        </div>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat || (cat === 'All' && selectedCategory === 'ALL');
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? 'ALL' : cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-brand-navy text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count Header */}
      <div className="text-xs text-slate-500 pt-1 flex justify-between items-center">
        <span>Showing <strong className="text-slate-800">{totalResults}</strong> professional vocational courses</span>
        {(searchTerm || selectedCategory !== 'ALL' || selectedLevel !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedLevel('ALL');
            }}
            className="text-brand-crimson hover:underline font-medium text-xs"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
