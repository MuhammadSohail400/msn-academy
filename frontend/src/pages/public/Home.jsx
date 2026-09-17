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
    <div className="bg-[#0e1e45] text-slate-200 antialiased overflow-x-hidden selection:bg-[#c41230] selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Courses Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-slate-200" id="courses">
        <div className="max-w-md md:max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[#c41230] uppercase text-xs tracking-wider font-extrabold block">Our Programs</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0f1e45] tracking-tight">Featured Courses</h2>
            </div>
            <Link className="text-[#c41230] hover:text-[#a00e26] text-xs font-bold flex items-center gap-1 group" to="/courses">
              <span>View All</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCourses.map((course) => (
              <CourseCard key={course._id || course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-md md:max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              <span className="text-[#c41230] uppercase text-xs tracking-wider font-extrabold block mb-1">Why Choose Us</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0e1e45] tracking-tight mb-3">Why MSN Academy?</h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-8">
                MSN Academy is built around one principle: learning should translate directly into real skills you can apply. We cut out the filler and focus on what matters — practical knowledge, professional tools, and a clear path to certification.
              </p>

              {/* Value Props List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/10 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#c41230]/10 text-[#c41230] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Practical Learning</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Every course is built around real-world projects, tools, and industry scenarios — not theory for its own sake.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/10 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#c41230]/10 text-[#c41230] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Verifiable Certificates</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Earn a certificate with a unique ID that employers and clients can verify online in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/10 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#c41230]/10 text-[#c41230] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Expert Instructors</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Learn directly from practitioners working in the tech industry — people who have done what they teach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-blue-900/10 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-[#c41230]/10 text-[#c41230] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f1e45] mb-0.5">Self-Paced Access</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Study on your own schedule. Lifetime access means you can revisit content whenever you need a refresh.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Feature Card Image */}
            <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-slate-200 shadow-md">
              <img
                alt="Student studying with MSN Academy online courses"
                className="w-full h-48 md:h-80 object-cover"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c41230] text-white flex items-center justify-center shrink-0">
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
      <section className="py-12 px-4 md:py-14 md:px-8 bg-[#0b1736] text-white">
        <div className="max-w-5xl mx-auto text-center">
          {/* Header */}
          <span className="text-[#c41230] uppercase text-[11px] md:text-xs tracking-widest font-bold block mb-1">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-10 text-white">
            Your Learning Journey
          </h2>

          {/* Steps Container */}
          <div className="relative mb-10">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-6 left-[8%] right-[8%] h-[1px] bg-slate-700/80 z-0" />

            {/* Mobile Vertical Line */}
            <div className="md:hidden absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-[1px] bg-slate-700/80 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c41230] text-white font-extrabold text-sm md:text-base flex items-center justify-center shadow-md mb-3 ring-4 ring-[#0b1736]">
                  1
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Browse</h3>
                <p className="text-[11px] md:text-xs text-slate-300 leading-snug max-w-[160px]">
                  Explore our catalog and find the right course.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c41230] text-white font-extrabold text-sm md:text-base flex items-center justify-center shadow-md mb-3 ring-4 ring-[#0b1736]">
                  2
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Enroll</h3>
                <p className="text-[11px] md:text-xs text-slate-300 leading-snug max-w-[160px]">
                  Purchase your course and get instant access.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c41230] text-white font-extrabold text-sm md:text-base flex items-center justify-center shadow-md mb-3 ring-4 ring-[#0b1736]">
                  3
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Learn</h3>
                <p className="text-[11px] md:text-xs text-slate-300 leading-snug max-w-[160px]">
                  Watch lessons at your pace and build skills.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c41230] text-white font-extrabold text-sm md:text-base flex items-center justify-center shadow-md mb-3 ring-4 ring-[#0b1736]">
                  4
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Assess</h3>
                <p className="text-[11px] md:text-xs text-slate-300 leading-snug max-w-[160px]">
                  Complete the assessment after lessons.
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c41230] text-white font-extrabold text-sm md:text-base flex items-center justify-center shadow-md mb-3 ring-4 ring-[#0b1736]">
                  5
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Certify</h3>
                <p className="text-[11px] md:text-xs text-slate-300 leading-snug max-w-[160px]">
                  Pass the test and earn your certificate.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-[#c41230] hover:bg-[#a00e26] text-white text-xs md:text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all"
            >
              <span>Start Your Journey</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Verify Certificate Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-b border-slate-200" id="verify">
        <div className="max-w-md md:max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0e1e45] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[#c41230] uppercase text-[11px] tracking-wider font-extrabold block mb-1">Trust & Integrity</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0e1e45] tracking-tight mb-2">Verify a Certificate</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Every MSN Academy certificate carries a unique Certificate ID. Enter it below to instantly verify its authenticity.
          </p>

          <form className="flex flex-col sm:flex-row gap-2 mb-3" onSubmit={handleVerifySubmit}>
            <input
              className="flex-1 text-xs px-3.5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c41230] focus:border-[#c41230] text-slate-900 bg-white placeholder:text-slate-400"
              placeholder="Enter Certificate ID (e.g. MSN-XXXX-XXXX)"
              required
              type="text"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
            />
            <button className="bg-[#c41230] hover:bg-[#a00e26] text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-colors" type="submit">
              Verify
            </button>
          </form>
          <Link className="text-xs text-slate-500 hover:text-[#c41230] underline font-medium" to="/verify">
            Or visit the full verification page
          </Link>
        </div>
      </section>

      {/* 6. Student Testimonials Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white border-t border-b border-slate-200">
        <div className="max-w-md md:max-w-5xl mx-auto text-center">
          <span className="text-[#c41230] uppercase text-xs tracking-wider font-extrabold block mb-1">Student Stories</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-7">What Our Students Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
            <article className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">★★★★★</div>
                <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                  "I completed the UI/UX Design course and immediately started applying the skills in my work. The Figma training alone was worth the entire course fee."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  F
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Fatima M.</h5>
                  <span className="text-[10px] text-slate-500">UI/UX Designer</span>
                </div>
              </div>
            </article>

            <article className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">★★★★★</div>
                <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                  "The Data Analytics course exceeded my expectations. Real datasets, real tools, and real scenarios. I would highly recommend MSN Academy to anyone serious about upskilling."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  U
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Usman T.</h5>
                  <span className="text-[10px] text-slate-500">Business Analyst</span>
                </div>
              </div>
            </article>

            <article className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 text-xs mb-2.5">★★★★★</div>
                <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                  "The Digital Marketing course was exactly what I needed to grow our brand online. Clear instructions, practical assignments, and a team that truly cares about your success."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  H
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Hira B.</h5>
                  <span className="text-[10px] text-slate-500">Marketing Executive</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-[#f5f6f8] border-t border-slate-200">
        <div className="max-w-md md:max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className="text-[#c41230] uppercase text-xs tracking-wider font-extrabold block mb-1">Support</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0f1e45] tracking-tight mb-2">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Find quick answers to the most common questions about MSN Academy courses, enrollment, payments, and certificates.
              </p>
              <Link className="inline-flex items-center gap-1.5 border border-slate-300 px-3.5 py-1.5 rounded-md text-xs font-bold text-slate-700 hover:border-slate-400 transition-colors bg-white" to="/faq">
                <span>View All FAQs</span>
                <span>→</span>
              </Link>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {FAQS_LIST.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-colors shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between p-3.5 cursor-pointer font-bold text-xs text-slate-900 text-left"
                    >
                      <span>{faq.q}</span>
                      <span className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
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
            <Link className="bg-[#c41230] hover:bg-[#a00e26] text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md transition-colors" to="/courses">
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