import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../../components/public/HeroSection';
import CourseCard from '../../components/public/CourseCard';
import courseService from '../../services/courseService';

const DEMO_FEATURED_COURSES = [
  {
    _id: '1',
    slug: 'data-analytics',
    title: 'Data Analytics',
    category: 'Data Science',
    categoryColor: 'blue',
    badge: 'Bestseller',
    badgeColor: 'amber',
    description: 'Transform raw data into meaningful business stories using professional analytical tools and SQL.',
    price: 15000,
    averageRating: 4.8,
    durationHours: 38,
    totalLectures: 42,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  },
  {
    _id: '2',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Design',
    categoryColor: 'rose',
    badge: 'Design',
    badgeColor: 'pink',
    description: 'Design professional interfaces and user experiences using industry-standard design thinking & Figma.',
    price: 14000,
    averageRating: 5.0,
    durationHours: 34,
    totalLectures: 38,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
  },
  {
    _id: '3',
    slug: 'frontend-development',
    title: 'Frontend Development',
    category: 'Web Development',
    categoryColor: 'emerald',
    badge: 'Job Ready',
    badgeColor: 'emerald',
    description: 'Build modern, responsive web applications using HTML, CSS, modern JavaScript, and React frameworks.',
    price: 16000,
    averageRating: 4.8,
    durationHours: 48,
    totalLectures: 55,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    _id: '4',
    slug: 'ai-automation',
    title: 'AI Automation',
    category: 'Artificial Intelligence',
    categoryColor: 'purple',
    badge: 'Advanced',
    badgeColor: 'purple',
    isComingSoon: true,
    description: 'Automate complex business workflows using modern LLMs and N8N intelligent agent architectures.',
    price: 18000,
    averageRating: 4.9,
    durationHours: 32,
    totalLectures: 36,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
  },
];

const FAQS_LIST = [
  {
    q: 'What courses does MSN Academy offer?',
    a: 'MSN Academy offers industry-focused technology courses including Data Analytics, AI Automation, UI/UX Design, Frontend Development, Digital Marketing, and MS Office & Productivity. New courses are added regularly.',
  },
  {
    q: 'Are the courses self-paced?',
    a: 'Yes, all our courses are 100% self-paced with lifetime access, so you can learn according to your own timeline and schedule.',
  },
  {
    q: 'How do I enroll in a course?',
    a: 'Simply choose your preferred course, click "View Course", proceed to checkout, and complete the payment using credit card, debit card, or local bank transfer.',
  },
  {
    q: 'Do I need to create an account to purchase?',
    a: 'Yes, creating an account helps you save course progress, submit assessments, and download your accredited certificates.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept Visa, Mastercard, JazzCash, EasyPaisa, and Direct Bank Transfers in PKR.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [certIdInput, setCertIdInput] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses({ limit: 4 });
        if (res.data && res.data.length > 0) {
          setCourses(res.data);
        }
      } catch (err) {
        console.warn('Using demo featured courses fallback:', err);
      }
    };
    fetchCourses();
  }, []);

  const displayCourses = courses.length > 0 ? courses : DEMO_FEATURED_COURSES;

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certIdInput.trim()) {
      navigate(`/verify?id=${encodeURIComponent(certIdInput.trim())}`);
    }
  };

  return (
    <div className="bg-[#0e1e45] text-slate-200 antialiased overflow-x-hidden selection:bg-brand-red selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Courses Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-slate-200" id="courses">        <div className="max-w-md md:max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-brand-red uppercase text-xs tracking-wider font-extrabold block">Our Programs</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0f1e45] tracking-tight">Featured Courses</h2>
          </div>
          <Link className="text-brand-red hover:text-brand-red-dark text-xs font-bold flex items-center gap-1 group" to="/courses">
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Course Cards Vertical Stack for Mobile / Grid for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCourses.map((course) => (
            <CourseCard key={course._id || course.slug} course={course} />
          ))}
        </div>
      </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white border-t border-slate-200">        <div className="max-w-md md:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6">
            <span className="text-brand-red uppercase text-xs tracking-wider font-extrabold block mb-1">Why Choose Us</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0e1e45] tracking-tight mb-3">Why MSN Academy?</h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-8">
              MSN Academy is built around one principle: learning should translate directly into real skills you can apply. We cut out the filler and focus on what matters — practical knowledge, professional tools, and a clear path to certification.
            </p>

            {/* Value Props List */}
            <div className="space-y-4 mb-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/40">
                <div className="w-8 h-8 rounded-md bg-red-900/30 text-brand-red flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Practical Learning</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Every course is built around real-world projects, tools, and industry scenarios — not theory for its own sake.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/40">
                <div className="w-8 h-8 rounded-md bg-red-900/30 text-brand-red flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Verifiable Certificates</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Earn a certificate with a unique ID that employers and clients can verify online in seconds.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/40">
                <div className="w-8 h-8 rounded-md bg-red-900/30 text-brand-red flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Expert Instructors</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Learn directly from practitioners working in the tech industry — people who have done what they teach.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/40">
                <div className="w-8 h-8 rounded-md bg-red-900/30 text-brand-red flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Self-Paced Access</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Study on your own schedule. Lifetime access means you can revisit content whenever you need a refresh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Feature Card Image with Badge */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-blue-900/40 shadow-md">
            <img
              alt="Student studying with MSN Academy online courses"
              className="w-full h-48 md:h-80 object-cover"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute bottom-3 left-3 right-3 bg-white backdrop-blur-sm p-3 rounded-lg border border-blue-800/60 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-[#0f1e45] leading-tight">Verifiable Certificates</div>
                <div className="text-[10px] text-slate-500">Every certificate has a unique ID & QR code</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#0e1e45] text-white border-t border-b border-blue-900/50">
        <div className="max-w-md md:max-w-5xl mx-auto text-center">
          <span className="text-brand-red uppercase text-xs tracking-wider font-extrabold block mb-1">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8">Your Learning Journey</h2>

          {/* Stepper 1-5 vertical flow with connecting line for mobile, grid for desktop */}
          <div className="relative flex flex-col md:grid md:grid-cols-5 items-center gap-6 mb-10 text-left">
            <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-blue-900/50 -z-0 md:hidden" />
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-blue-900/50 -z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex md:flex-col items-start md:items-center gap-4 w-full bg-[#162858]/80 p-3 md:p-4 rounded-xl border border-[#213b7d] md:text-center h-full">
              <div className="w-10 h-10 rounded-full bg-brand-red text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Browse</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Explore our catalog and find the course that matches your goals.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex md:flex-col items-start md:items-center gap-4 w-full bg-[#162858]/80 p-3 md:p-4 rounded-xl border border-[#213b7d] md:text-center h-full">
              <div className="w-10 h-10 rounded-full bg-brand-red text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Enroll</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Purchase your course and get instant access to all materials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex md:flex-col items-start md:items-center gap-4 w-full bg-[#162858]/80 p-3 md:p-4 rounded-xl border border-[#213b7d] md:text-center h-full">
              <div className="w-10 h-10 rounded-full bg-brand-red text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Learn</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Watch lessons at your own pace, download resources, and build skills.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex md:flex-col items-start md:items-center gap-4 w-full bg-[#162858]/80 p-3 md:p-4 rounded-xl border border-[#213b7d] md:text-center h-full">
              <div className="w-10 h-10 rounded-full bg-brand-red text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Assess</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete the final MCQ assessment after finishing all lessons.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative z-10 flex md:flex-col items-start md:items-center gap-4 w-full bg-[#162858]/80 p-3 md:p-4 rounded-xl border border-[#213b7d] md:text-center h-full">
              <div className="w-10 h-10 rounded-full bg-brand-red text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                5
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Certify</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pass the assessment and earn your verifiable certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold px-7 py-3 rounded-lg shadow-md transition-all" to="/courses">
            <span>Start Your Journey</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 5. Verify Certificate Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-b border-blue-900/30" id="verify">
        <div className="max-w-md md:max-w-xl mx-auto text-center">
          {/* Shield Icon Badge */}
          <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-brand-red uppercase text-[11px] tracking-wider font-extrabold block mb-1">Trust & Integrity</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0e1e45] tracking-tight mb-2">Verify a Certificate</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Every MSN Academy certificate carries a unique Certificate ID. Enter it below to instantly verify its authenticity.
          </p>

          {/* Verification Input Box */}
          <form className="flex flex-col sm:flex-row gap-2 mb-3" onSubmit={handleVerifySubmit}>
            <input
              className="flex-1 text-xs px-3.5 py-3 border border-blue-800/60 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 bg-white placeholder:text-slate-500"
              placeholder="Enter Certificate ID (e.g. MSN-XXXX-XXXX)"
              required
              type="text"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
            />
            <button className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-colors" type="submit">
              Verify
            </button>
          </form>
          <Link className="text-xs text-slate-400 hover:text-brand-red underline font-medium" to="/verify">
            Or visit the full verification page
          </Link>
        </div>
      </section>

      {/* 6. Student Testimonials Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white border-t border-b border-blue-900/30">
        <div className="max-w-md md:max-w-5xl mx-auto text-center">
          <span className="text-brand-red uppercase text-xs tracking-wider font-extrabold block mb-1">Student Stories</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-7">What Our Students Say</h2>

          {/* Testimonial Cards Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
            {/* Card 1 */}
            <article className="bg-[#f1f3f5] p-5 rounded-xl border border-gray-800/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-900 italic leading-relaxed mb-4">
                  "I completed the UI/UX Design course and immediately started applying the skills in my work. The Figma training alone was worth the entire course fee."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-gray-800/40">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  F
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Fatima M.</h5>
                  <span className="text-[10px] text-slate-400">UI/UX Designer</span>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-[#f1f3f5] p-5 rounded-xl border border-blue-900/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-900 italic leading-relaxed mb-4">
                  "The Data Analytics course exceeded my expectations. Real datasets, real tools, and real scenarios. I would highly recommend MSN Academy to anyone serious about upskilling."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  U
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Usman T.</h5>
                  <span className="text-[10px] text-slate-400">Business Analyst</span>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-[#f1f3f5] p-5 rounded-xl border border-blue-900/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-900 italic leading-relaxed mb-4">
                  "The Digital Marketing course was exactly what I needed to grow our brand online. Clear instructions, practical assignments, and a team that truly cares about your success."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  H
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Hira B.</h5>
                  <span className="text-[10px] text-slate-400">Marketing Executive</span>
                </div>
              </div>
            </article>
          </div>

          {/* Testimonial Carousel Controls / Dots */}
          <div className="flex items-center justify-center gap-3">
            <button aria-label="Previous story" className="w-7 h-7 rounded-full border border-blue-800/50 text-slate-300 flex items-center justify-center text-xs hover:bg-blue-900/40 transition-colors">
              ‹
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="w-2 h-2 rounded-full bg-blue-800" />
            </div>
            <button aria-label="Next story" className="w-7 h-7 rounded-full border border-blue-800/50 text-slate-300 flex items-center justify-center text-xs hover:bg-blue-900/40 transition-colors">
              ›
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-slate-200">        <div className="max-w-md md:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Header Column */}
          <div className="lg:col-span-4">
            <span className="text-brand-red uppercase text-xs tracking-wider font-extrabold block mb-1">Support</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0f1e45] tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Find quick answers to the most common questions about MSN Academy courses, enrollment, payments, and certificates.
            </p>
            <Link className="inline-flex items-center gap-1.5 border border-blue-800/60 px-3.5 py-1.5 rounded-md text-xs font-bold text-slate-300 hover:border-blue-600 transition-colors" to="/faq">
              <span>View All FAQs</span>
              <span>→</span>
            </Link>
          </div>

          {/* FAQ Accordion Container */}
          <div className="lg:col-span-8 space-y-3">
            {FAQS_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-blue-900/40 rounded-lg overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-3.5 cursor-pointer font-bold text-xs text-slate-900 text-left"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-blue-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-900 leading-relaxed border-t border-blue-900/40 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="py-14 px-4 md:py-16 md:px-8 bg-[#0e1e45] text-white text-center border-t border-blue-900/50">
        <div className="max-w-md md:max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Ready to Build Your Career?</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
            Join hundreds of students already learning with MSN Academy. Start today and earn your first certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md transition-colors" to="/courses">
              Browse All Courses
            </Link>
            <Link className="bg-[#162858] hover:bg-[#1c3370] text-white text-xs font-bold px-6 py-3 rounded-lg border border-blue-800/60 transition-colors" to="/register">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
