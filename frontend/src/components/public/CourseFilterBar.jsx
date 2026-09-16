import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter, RotateCcw } from 'lucide-react';
import Select from '../ui/Select';
import useDebounce from '../../hooks/useDebounce';

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function CourseFilterBar({
  categories = [],
  selectedCategory = '',
  selectedLevel = '',
  selectedSort = 'newest',
  searchTerm = '',
  onFilterChange,
  onReset,
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 350);

  // Sync internal search input if external prop changes
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Trigger search filter update when debounced search term changes
  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, searchTerm, onFilterChange]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedLevel ? 1 : 0) +
    (selectedSort !== 'newest' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search courses, skills, technologies..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onFilterChange({ search: '' });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Filters & Sort */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="w-full sm:w-44">
            <Select
              value={selectedLevel}
              onChange={(e) => onFilterChange({ level: e.target.value })}
              options={LEVEL_OPTIONS}
              placeholder="Level"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={selectedSort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              options={SORT_OPTIONS}
              placeholder="Sort By"
            />
          </div>

          {activeFiltersCount > 0 && onReset && (
            <button
              onClick={onReset}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-100 sm:col-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      {categories.length > 0 && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3 no-scrollbar">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 whitespace-nowrap">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          <button
            onClick={() => onFilterChange({ category: '' })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
              !selectedCategory
                ? 'bg-brand-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          {categories.map((catObj) => {
            const catName = typeof catObj === 'string' ? catObj : catObj.category || catObj.name;
            const count = typeof catObj === 'object' ? catObj.count : null;
            const isSelected = selectedCategory === catName;
            return (
              <button
                key={catName}
                onClick={() => onFilterChange({ category: catName })}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {catName} {count !== null && count !== undefined ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

CourseFilterBar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        category: PropTypes.string,
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ])
  ),
  selectedCategory: PropTypes.string,
  selectedLevel: PropTypes.string,
  selectedSort: PropTypes.string,
  searchTerm: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
};
