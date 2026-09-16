import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Award, ShieldCheck, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

const CORE_VALUES = [
  {
    icon: Target,
    title: 'Practical Vocational Training',
    description:
      'We prioritize hands-on project experience over outdated theory, ensuring students build real portfolio pieces.',
  },
  {
    icon: Heart,
    title: 'Accessible & Affordable',
    description:
      'High-quality education priced fairly in PKR with transparent fee structures and zero hidden costs.',
  },
  {
    icon: Award,
    title: 'Rigorous Assessment',
    description:
      'Our 120-minute timed MCQ exam engine ensures that every certificate awarded represents genuine mastery.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Digital Credentials',
    description:
      'Every graduate receives a QR-code verifiable certificate that can be instantly validated by global employers.',
  },
];

const LEADERSHIP = [
  {
    name: 'Muhammad Sohail',
    role: 'Founder & Managing Director',
    bio: 'Tech visionary focused on building high-impact vocational education for Pakistani youth.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ayesha Malik',
    role: 'Head of Curriculum & Quality Assurance',
    bio: '10+ years shaping technology learning standards and university course alignment.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Usman Farooq',
    role: 'Lead Full-Stack Instructor',
    bio: 'Senior Software Architect passionate about mentoring next-gen Pakistani engineers.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
];

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Page Hero Header */}
      <section className="bg-brand-navy text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            About MSN Academy
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            Empowering Pakistan’s Next Generation of Tech Leaders
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-base text-gray-300 sm:text-lg">
            MSN Academy is a career-focused technology and vocational training institution dedicated to bridging the digital skills gap across Pakistan.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
              Our Mission
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy">
              Transforming Lives Through Relevant Industry Skills
            </h2>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Founded with a mission to make world-class tech education accessible to every student in Pakistan, MSN Academy offers structured learning paths in Full-Stack Web Development, Data Science, AI, and Product Design.
            </p>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              We combine self-paced video lectures, live mentorship sessions, and our proprietary 120-minute assessment engine to certify skill readiness for domestic and global tech careers.
            </p>
            <div className="mt-6 space-y-2 text-sm font-semibold text-brand-navy">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Over 15,000 students trained and certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>120+ Industry hiring partner networks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>100% QR-code digital certificate verification</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-brand-navy-dark p-8 text-white shadow-card border border-white/10">
            <h3 className="font-display text-2xl font-bold text-amber-400">Our Vision for 2030</h3>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              "To train 100,000 skilled software engineers, data professionals, and digital creators across Pakistan, driving economic independence and positioning the nation as a global tech outsourcing powerhouse."
            </p>
            <div className="mt-8 border-t border-white/10 pt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-crimson text-white font-bold text-lg">
                MSN
              </div>
              <div>
                <div className="font-display text-sm font-bold">MSN Academy Advisory Board</div>
                <div className="text-xs text-gray-400">Lahore & Karachi, Pakistan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
              Core Principles
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              What Sets Us Apart
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:shadow-card hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-brand-navy">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Leadership & Mentors
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            Meet the Minds Behind MSN Academy
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {LEADERSHIP.map((person, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-card"
            >
              <img
                src={person.avatar}
                alt={person.name}
                className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-brand-crimson/20"
              />
              <h3 className="mt-4 font-display text-lg font-bold text-brand-navy">{person.name}</h3>
              <p className="text-xs font-semibold text-brand-crimson">{person.role}</p>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-brand-navy p-8 sm:p-12 text-white">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Join Thousands of Successful Graduates
          </h2>
          <p className="mt-2 text-sm text-gray-300 max-w-xl mx-auto">
            Take the next step in your technology career with Pakistan’s leading vocational platform.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/courses">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
