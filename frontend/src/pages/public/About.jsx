import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Target,
  Users,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const CORE_VALUES = [
  {
    icon: Target,
    title: 'Practical Focus',
    description: 'Every course is built around real-world projects, tools, and outcomes — not theory for its own sake.',
  },
  {
    icon: Users,
    title: 'Community-First',
    description: 'We invest in our learners beyond the classroom, supporting career growth and professional connections.',
  },
  {
    icon: Award,
    title: 'Verified Excellence',
    description: 'Our certificates are verifiable and built to be recognised by employers and industry partners.',
  },
  {
    icon: BookOpen,
    title: 'Accessible Education',
    description: 'Self-paced, affordable courses that fit around your work, family, and life commitments.',
  },
];

const METRICS = [
  { number: '20+', label: 'Courses Available' },
  { number: '340+', label: 'Students Enrolled' },
  { number: '34+', label: 'Certificates Issued' },
  { number: '4.9/5', label: 'Average Rating' },
];

export default function About() {
  return (
    <div className="bg-white text-slate-800 antialiased selection:bg-red-500 selection:text-white">
      {/* Hero Banner Section */}
      <header className="bg-[#0e1e45]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-20">
          <span className="text-[#C8102E] font-bold text-xs tracking-wider uppercase block mb-3">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            About MSN Academy
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
            A technology education platform built to give every motivated learner access to practical, career-ready digital skills.
          </p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#C8102E] font-bold text-xs tracking-wider uppercase block">
                Mission
              </span>
              <h2 className="text-3xl lg:text-[34px] font-extrabold text-[#081325] leading-snug tracking-tight">
                Equipping Learners with Skills That Matter
              </h2>
              <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                <p>
                  MSN Academy was founded on a simple belief: education should be practical, accessible, and directly connected to real career outcomes. We saw a gap between traditional education and the fast-moving demands of the technology industry — and we set out to close it.
                </p>
                <p>
                  Every course at MSN Academy is designed with the end goal in mind: producing graduates who can immediately apply their knowledge, build real projects, and demonstrate verifiable skills to employers.
                </p>
              </div>

              {/* Checkpoint Highlights */}
              <ul className="pt-2 space-y-3.5 text-[14.5px] font-medium text-slate-700">
                {[
                  'Practical, project-based learning',
                  'Industry-relevant curriculum',
                  'Verifiable certificate system',
                  'Self-paced for working professionals',
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="text-[#C8102E] flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 fill-current text-[#C8102E]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right 3D Dashboard Image */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[530px] rounded-2xl bg-[#0f172a] p-3 shadow-2xl border border-slate-800 overflow-hidden">
                <img
                  src="/image.png"
                  alt="3D Data Analytics Dashboard Illustration"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[#C8102E] font-bold text-xs tracking-wider uppercase block mb-2">
              What We Stand For
            </span>
            <h2 className="text-3xl font-extrabold text-[#081325] tracking-tight">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-start hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-[#C8102E] mb-5">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#081325] mb-2.5">
                    {val.title}
                  </h3>
                  <p className="text-slate-500 text-[13.5px] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-[#0e1e45] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-center text-3xl font-extrabold mb-12 tracking-tight">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {METRICS.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                  {metric.number}
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-[34px] font-extrabold text-[#081325] tracking-tight mb-3">
            Start Learning Today
          </h2>
          <p className="text-slate-500 text-base mb-8">
            Browse our industry-focused courses and take the first step towards a career in tech.
          </p>
          <div>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 bg-[#C8102E] hover:bg-[#b00d27] text-white font-medium text-sm px-6 py-3 rounded-lg shadow-sm transition-colors"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}