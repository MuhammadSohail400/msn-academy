import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const DEFAULT_FAQS = [
  {
    category: 'Admissions',
    question: 'Are there any coding prerequisites or degrees required to join MSN Academy?',
    answer:
      'No technical degree or prior programming experience is required. All vocational courses begin from fundamental ground zero concepts and scale to enterprise-grade software architecture.',
  },
  {
    category: 'Learning',
    question: 'What language are the lectures conducted in?',
    answer:
      'Lectures are delivered in bilingual Urdu/Hindi explanations with standard English technical terminology, ensuring conceptual clarity without language barriers.',
  },
  {
    category: 'Payments',
    question: 'What payment methods are supported in Pakistan?',
    answer:
      'We natively support direct Pakistani Bank Transfers (Meezan Bank Limited, HBL, Bank Alfalah), Easypaisa, JazzCash, and Visa/Mastercard debit cards with instant automated enrollment.',
  },
  {
    category: 'Certificates',
    question: 'Are MSN Academy certificates verifiable by employers?',
    answer:
      'Yes! Every graduate receives a high-resolution digital certificate with an immutable cryptographic ID and a public QR code that employers can scan at /verify to validate authenticity.',
  },
  {
    category: 'Learning',
    question: 'Can I study while working a full-time job or attending university?',
    answer:
      'Yes, 100%. All lectures and coding labs are self-paced with 24/7 lifetime access. You can watch lectures and submit exercises according to your personal schedule.',
  },
  {
    category: 'Payments',
    question: 'Is there a money-back satisfaction guarantee?',
    answer:
      'Yes. We offer an unconditional 7-day money-back guarantee. If you feel the course does not meet your expectations, simply reach out to admissions for a full refund.',
  },
];

export default function FaqAccordion({ faqs = DEFAULT_FAQS, showCategoryFilter = false }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', ...new Set(faqs.map((f) => f.category).filter(Boolean))];

  const filteredFaqs =
    activeCategory === 'ALL' ? faqs : faqs.filter((f) => f.category === activeCategory);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills if enabled */}
      {showCategoryFilter && categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-navy text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200/80 bg-slate-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <HelpCircle
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isOpen ? 'text-brand-crimson' : 'text-slate-400'
                    }`}
                  />
                  <span className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm sm:text-base text-slate-600 leading-relaxed bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
