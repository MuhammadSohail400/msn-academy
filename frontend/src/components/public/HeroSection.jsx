import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Star, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background subtle dark radial blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tag / Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 mb-6 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
            <span>Pakistan's Growing Tech Academy</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Learn Tech Skills.<br />
            <span className="text-brand-crimson">Build Your Career</span><br />
            with MSN Academy.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Gain in-demand tech skills with practical training, live projects, and industry-focused learning. Earn verifiable certificates recognised by employers.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-brand-crimson/25 hover:bg-brand-crimson-hover transition-all"
            >
              <span>Explore Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/verify"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:bg-white/10 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-slate-300" />
              <span>Verify a Certificate</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Bar in card */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                <BookOpen className="h-5 w-5 text-brand-crimson" />
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">10+</div>
                <div className="text-xs sm:text-sm text-slate-400">Courses</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                <Users className="h-5 w-5 text-brand-crimson" />
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">1000+</div>
                <div className="text-xs sm:text-sm text-slate-400">Students</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                <Award className="h-5 w-5 text-brand-crimson" />
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">34+</div>
                <div className="text-xs sm:text-sm text-slate-400">Certificates Issued</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">4.9/5</div>
                <div className="text-xs sm:text-sm text-slate-400">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
