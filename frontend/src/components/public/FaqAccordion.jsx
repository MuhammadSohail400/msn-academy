import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import Badge from '../ui/Badge';

export default function FaqAccordion({ faqs = [], showCategories = true }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = ['All', ...new Set(faqs.map((f) => f.category).filter(Boolean))];

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleIndex = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs & Search */}
      {showCategories && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accordion Container */}
      {filteredFaqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          No questions matched your search query.
        </div>
      ) : (
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.id || faq.question || index} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-display font-medium text-brand-navy transition-colors hover:text-brand-crimson sm:p-6"
                >
                  <span className="flex items-center gap-3 pr-4 text-base font-semibold sm:text-lg">
                    <HelpCircle className="h-5 w-5 shrink-0 text-brand-crimson opacity-80" />
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {faq.category && (
                      <Badge variant="navy" className="hidden sm:inline-flex text-[11px]">
                        {faq.category}
                      </Badge>
                    )}
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-crimson' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 text-sm text-gray-600 leading-relaxed sm:px-6 sm:pl-14">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

FaqAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  showCategories: PropTypes.bool,
};
