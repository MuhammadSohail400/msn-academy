import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Target, Users, Award, BookOpen } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: 'Practical Focus',
    description:
      'Every course is built around real-world projects, tools, and outcomes — not theory for its own sake.',
  },
  {
    icon: Users,
    title: 'Community-First',
    description:
      'We invest in our learners beyond the classroom, supporting career growth and professional connections.',
  },
  {
    icon: Award,
    title: 'Verified Excellence',
    description:
      'Our certificates are verifiable and built to be recognised by employers and industry partners.',
  },
  {
    icon: BookOpen,
    title: 'Accessible Education',
    description:
      'Self-paced, affordable courses that fit around your work, family, and life commitments.',
  },
];

const MISSION_CHECKS = [
  'Practical, project-based learning',
  'Industry-relevant curriculum',
  'Verifiable certificate system',
  'Self-paced for working professionals',
];

export default function About() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Our Story
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            About MSN Academy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            A technology education platform built to give every motivated learner access to practical, career-ready digital skills.
          </p>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
              Mission
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Equipping Learners with Skills That Matter
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              MSN Academy was founded on a simple belief: education should be practical, accessible, and directly connected to real career outcomes. We saw a gap between traditional education and the fast-moving demands of the technology industry — and we set out to close it.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every course at MSN Academy is designed with the end goal in mind: producing graduates who can immediately apply their knowledge, build real projects, and demonstrate verifiable skills to employers.
            </p>

            <div className="pt-2 space-y-2.5">
              {MISSION_CHECKS.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-crimson shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Illustration Graphic */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Equipping learners with practical skills"
                className="h-[360px] sm:h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      <section className="bg-slate-50/70 py-16 lg:py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            What We Stand For
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-slate-900">
            Our Core Values
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-crimson mb-5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Our Impact Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy p-10 sm:p-14 text-white text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-10">
            Our Impact
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">20+</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Courses Available</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">340+</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Students Enrolled</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">34+</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Certificates Issued</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">4.9/5</div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Start Learning Today CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900">
          Start Learning Today
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-slate-600">
          Browse our industry-focused courses and take the first step towards a career in tech.
        </p>

        <div className="mt-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors"
          >
            <span>Explore Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
