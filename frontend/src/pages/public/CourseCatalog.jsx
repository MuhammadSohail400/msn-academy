import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseCard from '../../components/public/CourseCard';
import CourseFilterBar from '../../components/public/CourseFilterBar';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import courseService from '../../services/courseService';

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL query parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    courseService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch course list based on query params
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await courseService.getCourses({
        page,
        limit: 9,
        search,
        category,
        level,
        sort,
      });

      setCourses(res.data || []);
      if (res.meta?.pagination) {
        setPagination(res.meta.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, level, sort]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Update query params in URL
  const handleFilterChange = (newParams) => {
    const updated = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });

    // Reset to page 1 on filter change if page wasn't explicitly changed
    if (!newParams.page) {
      updated.set('page', '1');
    }

    setSearchParams(updated);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    handleFilterChange({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-brand-navy p-6 sm:p-10 text-white shadow-card">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Course Catalog & Discovery
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Explore Vocational & Tech Programs
          </h1>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">
            Find hands-on courses in Web Development, Data Science, AI, and Design. Certified by MSN Academy with live 120m exam evaluation.
          </p>
        </div>
      </div>

      {/* Filter Bar (Desktop) */}
      <div className="hidden lg:block">
        <CourseFilterBar
          categories={categories}
          selectedCategory={category}
          selectedLevel={level}
          selectedSort={sort}
          searchTerm={search}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Mobile Filter Trigger Button */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          size="sm"
          icon={SlidersHorizontal}
          onClick={() => setMobileFilterOpen(true)}
        >
          Filters & Sort
        </Button>
        <span className="text-xs text-gray-500 font-medium">
          Showing {courses.length} of {pagination.total} results
        </span>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="font-display text-lg font-bold text-brand-navy">
          {category ? `${category} Courses` : 'All Available Courses'}
        </h2>
        <span className="hidden lg:inline-block text-xs font-medium text-gray-500">
          Showing {courses.length} of {pagination.total} total courses
        </span>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4 space-y-4 bg-white">
              <Skeleton className="h-44 w-full" rounded="rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-24" rounded="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={fetchCourses} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No courses found"
          description="No course matched your selected category, search keywords, or filter options."
          actionLabel="Reset All Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id || course.slug} course={course} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <Button
            variant="outline"
            size="sm"
            icon={ChevronLeft}
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>

          <span className="text-xs font-medium text-gray-600">
            Page <span className="font-bold text-brand-navy">{pagination.page}</span> of{' '}
            <span className="font-bold text-brand-navy">{pagination.totalPages}</span>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter & Sort Courses"
        size="md"
      >
        <div className="space-y-4 pt-2">
          <CourseFilterBar
            categories={categories}
            selectedCategory={category}
            selectedLevel={level}
            selectedSort={sort}
            searchTerm={search}
            onFilterChange={(params) => {
              handleFilterChange(params);
              setMobileFilterOpen(false);
            }}
            onReset={() => {
              handleReset();
              setMobileFilterOpen(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
