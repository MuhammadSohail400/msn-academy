import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from 'lucide-react';
import HeroSection from '../../components/public/HeroSection';
import CourseCard from '../../components/public/CourseCard';
import courseService from '../../services/courseService';

const TESTIMONIALS = [
  {
    name: 'Fatima M.',
    role: 'UI/UX Designer',
    initial: 'F',
    comment:
      '"I completed the UI/UX Design course and immediately started applying the skills in my work. The Figma training alone was worth the entire course fee."',
  },
  {
    name: 'Usman T.',
    role: 'Business Analyst',
    initial: 'U',
    comment:
      '"The Data Analytics course exceeded my expectations. Real datasets, real tools, and real scenarios. I would highly recommend MSN Academy to anyone serious about upskilling."',
  },
  {
    name: 'Hira B.',
    role: 'Marketing Executive',
    initial: 'H',
    comment:
      '"The Digital Marketing course was exactly what I needed to grow our brand online. Clear instructions, practical assignments, and a team that truly cares about your success."',
  },
];

const HOME_FAQS = [
  {
    q: 'What courses does MSN Academy offer?',
    a: 'MSN Academy offers industry-focused technology courses including Data Analytics, AI Automation, UI/UX Design, Frontend Development, Digital Marketing, and MS Office & Productivity. New courses are added regularly.',
  },
  {
    q: 'Are the courses self-paced?',
    a: 'Yes, all our lecture content is on-demand and self-paced. You can watch anytime, anywhere, and take the 120-minute assessment exam whenever you are prepared.',
  },
  {
    q: 'How do I enroll in a course?',
    a: 'Browse our course catalog, choose your desired course, and click "Enroll Now". You can checkout as a guest or with a student account via bank transfer or card.',
  },
  {
    q: 'Do I need to create an account to purchase?',
    a: 'No! Guest checkout is fully supported. An account will be automatically configured for you so you can access your learning portal immediately.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept local direct bank transfers (HBL, Meezan, Allied), JazzCash, EasyPaisa, and major debit/credit cards across Pakistan.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [certInput, setCertInput] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadFeatured() {
      try {
        const res = await courseService.getCourses({ limit: 4, sort: 'popular' });
        if (!cancelled) {
          setFeaturedCourses(res.data || []);
        }
      } catch {
        // silently ignore — UI will show empty state
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    }
    loadFeatured();
    return () => { cancelled = true; };
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify?certId=${encodeURIComponent(certInput.trim())}`);
    } else {
      navigate('/verify');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Courses Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
              Our Programs
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-crimson hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesLoading ? (
            // Loading skeleton placeholders
            [...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-8 bg-slate-200 rounded-xl mt-2" />
                </div>
              </div>
            ))
          ) : featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm text-slate-500">No featured courses available right now.</p>
              <Link to="/courses" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-crimson hover:underline">
                Browse All Courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
                Why Choose Us
              </span>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                Why MSN Academy?
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                MSN Academy is built around one principle: learning should translate directly into real skills you can apply. We cut out the filler and focus on what matters — practical knowledge, professional tools, and a clear path to certification.
              </p>
            </div>

            {/* 2x2 Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">Practical Learning</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Every course is built around real-world projects, tools, and industry scenarios — not theory for its own sake.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">Verifiable Certificates</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Earn a certificate with a unique ID that employers and clients can verify online in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">Expert Instructors</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Learn directly from practitioners working in the tech industry — people who have done what they teach.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">Self-Paced Access</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Study on your own schedule. Lifetime access means you can revisit content whenever you need a refresh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image with Floating Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop"
                alt="Student studying on laptop"
                className="h-[380px] sm:h-[440px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Glass/White Card at bottom */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 backdrop-blur p-4 sm:p-5 shadow-lg flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-crimson text-white shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-display text-sm sm:text-base font-bold text-slate-900">
                    Verifiable Certificates
                  </h5>
                  <p className="text-xs text-slate-500">
                    Every certificate has a unique ID & QR code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section ("Your Learning Journey") */}
      <section className="bg-brand-navy py-16 lg:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            How It Works
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
            Your Learning Journey
          </h2>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson font-display text-xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">Browse</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                Explore our catalog and find the course that matches your goals.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson font-display text-xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">Enroll</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                Purchase your course and get instant access to all materials.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson font-display text-xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">Learn</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                Watch lessons at your own pace, download resources, and build skills.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson font-display text-xl font-bold text-white shadow-lg">
                4
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">Assess</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                Complete the final MCQ assessment after finishing all lessons.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson font-display text-xl font-bold text-white shadow-lg">
                5
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">Certify</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                Pass the assessment and earn your verifiable certificate.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-brand-crimson-hover transition-all"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Verify a Certificate Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-white shadow-md">
          <ShieldCheck className="h-7 w-7 text-brand-crimson" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
          Trust & Integrity
        </span>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Verify a Certificate
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Every MSN Academy certificate carries a unique Certificate ID. Enter it below to instantly verify its authenticity.
        </p>

        <form onSubmit={handleVerify} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder="Enter Certificate ID (e.g. MSN-XXXX-XXXX)"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson"
          />
          <button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-brand-crimson px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors shrink-0"
          >
            Verify
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-400">
          Or{' '}
          <Link to="/verify" className="font-semibold text-slate-600 hover:text-brand-crimson underline">
            visit the full verification page
          </Link>
        </p>
      </section>

      {/* 6. What Our Students Say (Testimonials) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Student Stories
          </span>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Our Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, starIdx) => (
                    <span key={starIdx} className="text-base font-bold">★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  {item.comment}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm">
                  {item.initial}
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator controls */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-brand-crimson" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (Split Section) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
              Support
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Find quick answers to the most common questions about MSN Academy courses, enrollment, payments, and certificates.
            </p>
            <div className="pt-2">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-colors"
              >
                <span>View All FAQs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 5 Accordion Questions */}
          <div className="lg:col-span-7 space-y-3">
            {HOME_FAQS.map((faq, idx) => {
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
        </div>
      </section>

      {/* 8. Ready to Build Your Career CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy px-6 py-14 sm:py-16 text-center text-white relative overflow-hidden">
          <div className="relative mx-auto max-w-2xl space-y-4">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Build Your Career?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join hundreds of students already learning with MSN Academy. Start today and earn your first certificate.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/courses"
                className="w-full sm:w-auto rounded-xl bg-brand-crimson px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-crimson-hover transition-colors"
              >
                Browse All Courses
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
