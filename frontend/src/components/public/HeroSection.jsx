import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="w-full">
      {/* Hero Content Section */}
      <section className="bg-[#0e1e45] hero-glow text-white pt-16 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl w-full mx-auto">
          <div className="max-w-2xl text-left">
            {/* Growth Badge / Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c41230]/20 border border-[#c41230]/40 mb-6 text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-[#c41230] animate-pulse" />
              <span className="font-medium text-[12px] tracking-wide text-slate-200">
                Pakistan's Growing Tech Academy
              </span>
            </div>

            {/* Main Catchphrase Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-left">
              Learn Tech Skills.<br />
              <span className="text-[#c41230]">Build Your Career</span><br />
              with MSN Academy.
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 font-normal max-w-xl text-left">
              Gain in-demand tech skills with practical training, live projects, and industry-focused learning. Earn verifiable certificates recognised by employers.
            </p>

            {/* CTAs in Hero */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-start">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c41230] hover:bg-[#a00e26] text-white text-sm font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-[#c41230]/20 transition-all"
                href="#courses"
              >
                <span>Explore Courses</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#162858] hover:bg-[#1c3370] text-slate-200 border border-blue-800/60 text-sm font-semibold px-6 py-3.5 rounded-lg transition-all"
                to="/verify"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Verify a Certificate</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enlarged & Formatted Metrics Section with Blue Background */}
      <section className="bg-[#0c1a3e] text-white py-10 px-6 sm:px-8 lg:px-12 border-t border-b border-blue-900/40 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-between">

            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#c41230]/10 border border-[#c41230]/30 text-[#c41230] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl leading-tight text-white tracking-tight">10+</span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">Courses</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#c41230]/10 border border-[#c41230]/30 text-[#c41230] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl leading-tight text-white tracking-tight">1000+</span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">Students</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#c41230]/10 border border-[#c41230]/30 text-[#c41230] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl leading-tight text-white tracking-tight">34+</span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">Certificates Issued</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#c41230]/10 border border-[#c41230]/30 text-[#c41230] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl leading-tight text-white tracking-tight">4.9/5</span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">Average Rating</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}