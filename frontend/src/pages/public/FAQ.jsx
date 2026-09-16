import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_CATEGORIES = [
  'All',
  'Courses',
  'Enrollment',
  'Payments',
  'LMS Access',
  'Assessments',
  'Certificates',
];

const FAQS_DATA = [
  {
    id: 1,
    category: 'Courses',
    question: 'What courses does MSN Academy offer?',
    answer:
      'MSN Academy offers industry-focused technology courses including Data Analytics, AI Automation, UI/UX Design, Frontend Development, Digital Marketing, and MS Office & Productivity. New courses are added regularly.',
  },
  {
    id: 2,
    category: 'Courses',
    question: 'Are the courses self-paced?',
    answer:
      'Yes! All our video modules are 100% self-paced with lifetime access. You can watch anytime, anywhere, and advance at your own speed without rigid deadlines.',
  },
  {
    id: 3,
    category: 'Enrollment',
    question: 'How do I enroll in a course?',
    answer:
      'Browse our course catalog, select any course that fits your career goals, and click "Enroll Now" or "Add to Cart". You can checkout as a guest or with a registered student profile.',
  },
  {
    id: 4,
    category: 'Enrollment',
    question: 'Do I need to create an account to purchase?',
    answer:
      'No, guest checkout is fully supported. When you enter your email during checkout, an LMS account is automatically configured and login details are emailed to you immediately.',
  },
  {
    id: 5,
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer:
      'We accept local direct bank transfers (HBL, Meezan, Allied Bank), JazzCash, EasyPaisa, and major debit/credit cards across Pakistan. All transactions are billed in PKR with zero foreign exchange fees.',
  },
  {
    id: 6,
    category: 'LMS Access',
    question: 'How do I access my course after purchasing?',
    answer:
      'Once payment is verified, log in to your student dashboard. Your enrolled courses will appear under "My Courses" with immediate access to HD lectures, code starter files, and project guides.',
  },
  {
    id: 7,
    category: 'Assessments',
    question: 'How does the final assessment work?',
    answer:
      'Upon completing all course video lessons, you unlock the 120-minute timed MCQ exam. It features randomized questions, real-time countdown, and instant score calculation. Scoring 70% or higher grants certification.',
  },
  {
    id: 8,
    category: 'Certificates',
    question: 'How do I get my certificate?',
    answer:
      'Immediately upon passing the assessment, your digital certificate is generated with your full name, unique Credential ID, issue date, and an embedded QR code. You can download a high-res PDF or share your verification link.',
  },
  {
    id: 9,
    category: 'Certificates',
    question: 'How can someone verify my certificate?',
    answer:
      'Employers and recruiters can visit the /verify route on MSN Academy and enter your Certificate ID or scan the QR code to view authenticated student credentials and completion dates.',
  },
];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState(1);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'All') return FAQS_DATA;
    return FAQS_DATA.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-20 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Help Centre
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about MSN Academy — courses, enrollment, payments, and certificates.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-crimson text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3. FAQ Items List */}
        <div className="mt-10 space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-red-50 border border-red-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-crimson shrink-0">
                      {faq.category}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 ml-3 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-crimson' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
