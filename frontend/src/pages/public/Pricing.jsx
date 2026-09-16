import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import CourseCard from '../../components/public/CourseCard';

const PRICING_COURSES = [
  {
    id: 'course-da',
    slug: 'data-analytics',
    title: 'Data Analytics',
    subtitle: 'Transform raw data into meaningful business stories using professional visualization tools.',
    category: 'Data Science',
    badge: 'Bestseller',
    price: 15000,
    averageRating: 4.8,
    durationHours: 38,
    totalLectures: 42,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    isComingSoon: false,
  },
  {
    id: 'course-ai',
    slug: 'ai-automation',
    title: 'AI Automation',
    subtitle: 'Automate complex business workflows using modern LLMs and N8N agent frameworks.',
    category: 'Artificial Intelligence',
    badge: 'Advanced',
    price: 18000,
    averageRating: 4.9,
    durationHours: 32,
    totalLectures: 36,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    isComingSoon: true,
  },
  {
    id: 'course-uiux',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    subtitle: 'Design professional interfaces and user experiences using industry-standard tools.',
    category: 'Design',
    badge: 'Design',
    price: 14000,
    averageRating: 5.0,
    durationHours: 34,
    totalLectures: 38,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    isComingSoon: false,
  },
  {
    id: 'course-frontend',
    slug: 'frontend-development',
    title: 'Frontend Development',
    subtitle: 'Build modern, responsive web applications using HTML, CSS, JavaScript, and React.',
    category: 'Web Development',
    badge: 'Job Ready',
    price: 16000,
    averageRating: 4.8,
    durationHours: 48,
    totalLectures: 55,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800&auto=format&fit=crop',
    isComingSoon: false,
  },
  {
    id: 'course-dm',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    subtitle: 'Master digital marketing channels, SEO, paid ads, and content strategy to grow brands online.',
    category: 'Marketing',
    badge: 'Beginner',
    price: 12000,
    averageRating: 4.7,
    durationHours: 28,
    totalLectures: 32,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop',
    isComingSoon: false,
  },
  {
    id: 'course-office',
    slug: 'ms-office-productivity',
    title: 'MS Office & Productivity',
    subtitle: 'Master Microsoft Office tools and professional productivity skills for the modern workplace.',
    category: 'Productivity',
    badge: 'Beginner',
    price: 8000,
    averageRating: 4.6,
    durationHours: 22,
    totalLectures: 28,
    enrolledCount: '100+',
    thumbnail: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=800&auto=format&fit=crop',
    isComingSoon: false,
  },
];

const PRICING_CHECKLIST = [
  'Full on-demand video content',
  'Downloadable course resources',
  'Self-paced learning — no deadlines',
  'Lifetime access to course material',
  'Final MCQ assessment',
  'Verifiable Certificate of Completion',
  'Certificate QR code for instant verification',
];

const PRICING_FAQS = [
  {
    q: 'How do I enroll in a course?',
    a: 'Browse our course catalog, select a course, and click Enroll Now. You can checkout as a guest or create a student account. Once payment is confirmed, you gain immediate access to your course.',
  },
  {
    q: 'Do I need to create an account to purchase?',
    a: 'No! You can complete your purchase using Guest Checkout. An account is automatically created for you with your email address so you can access the lectures immediately.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept local direct bank transfers (HBL, Meezan, Allied Bank), JazzCash, EasyPaisa, and major debit/credit cards across Pakistan.',
  },
  {
    q: 'How do I get my certificate?',
    a: 'Once you complete the course modules and pass the 120-minute timed MCQ assessment with 70% or higher, your digital certificate is instantly generated with a unique verification ID and QR code.',
  },
  {
    q: 'How can someone verify my certificate?',
    a: 'Anyone or any employer can visit /verify on MSN Academy and enter your Certificate ID or scan the embedded QR code to view authenticated student credentials.',
  },
];

export default function Pricing() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Transparent Pricing
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Pricing
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            MSN Academy courses are individually priced. Pay once, learn for life.
          </p>
        </div>
      </section>

      {/* 2. Top Section: Pay Per Course — No Subscriptions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pay Per Course — No Subscriptions
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At MSN Academy, we keep pricing simple. Each course is priced individually. You pay once and get lifetime access — no monthly fees, no renewals, no surprises.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every course purchase includes everything you need to go from enrolment to a verifiable certificate. Guest checkout is available — you don't need to create an account to purchase.
            </p>

            {/* Checklist */}
            <div className="pt-2 space-y-2.5">
              {PRICING_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: What's Included Box */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
              <h3 className="font-display text-base font-bold text-slate-900 mb-4">
                What's Included
              </h3>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-4">
                <span className="text-xs text-slate-400 font-medium">Course Price Range</span>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  PKR 8,000 – 18,000
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  per course · one-time payment
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Exact pricing is shown on each individual course page. Visit the course catalog to see all available courses and their current prices.
              </p>

              <Link
                to="/courses"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-crimson py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
              >
                <span>Browse Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Middle Section: Available Courses & Prices */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
          Available Courses & Prices
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRICING_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 4. Bottom Section: Pricing FAQs */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
          Pricing FAQs
        </h2>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-display text-sm font-bold text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-crimson' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
