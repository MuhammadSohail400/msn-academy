import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseCard from '../../components/public/CourseCard';
import courseService from '../../services/courseService';

const CATEGORIES = [
  'All',
  'Data Science',
  'Artificial Intelligence',
  'Design',
  'Web Development',
  'Marketing',
  'Productivity',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const SORT_MAP = {
  popular: 'popular',
  rating: 'rating',
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
  newest: 'newest',
};

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounced search input (400ms delay)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 9,
        sort: SORT_MAP[sortBy] || 'popular',
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel !== 'All Levels') params.level = selectedLevel;

      const res = await courseService.getCourses(params);
      setCourses(res.data || []);
      setMeta(res.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCategory, selectedLevel, sortBy]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedLevel, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel('All Levels');
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Our Programs
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Course Catalog
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Filter through our world-class vocational training programs.
          </p>
        </div>
      </section>

      {/* 2. Top Search & Controls Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-crimson"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* 3. Main Grid Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter By */}
          <aside
            className={`lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <h3 className="font-display text-base font-bold text-slate-900 mb-6">
              Filter By
            </h3>

            {/* Category Filter */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                Category
              </h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategory === cat;
                  return (
                    <label
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                          isChecked
                            ? 'border-brand-crimson bg-brand-crimson'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3 py-6 border-b border-slate-100">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                Level
              </h4>
              <div className="space-y-2">
                {LEVELS.map((lvl) => {
                  const isChecked = selectedLevel === lvl;
                  return (
                    <label
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                          isChecked
                            ? 'border-brand-crimson bg-brand-crimson'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{lvl}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="pt-6">
              <button
                onClick={clearFilters}
                className="w-full rounded-xl border border-brand-crimson py-2.5 text-center text-xs font-bold text-brand-crimson hover:bg-brand-crimson hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Right Courses Grid */}
          <main className="lg:col-span-9 space-y-6">
            <div className="text-xs text-slate-500 font-medium">
              {isLoading ? (
                <span className="text-slate-400">Loading courses…</span>
              ) : (
                <>Showing <strong className="text-slate-900">{meta.total}</strong> courses</>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {error}
                <button
                  onClick={loadCourses}
                  className="ml-3 text-xs font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                    <div className="h-40 bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-8 bg-slate-200 rounded-xl mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && courses.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <h4 className="font-display text-base font-bold text-slate-800">No courses found</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Try adjusting your search query or clear your filters to view all courses.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-brand-crimson px-5 py-2 text-xs font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Courses grid */}
            {!isLoading && !error && courses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {[...Array(meta.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-brand-crimson text-white shadow-sm'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage >= meta.totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
