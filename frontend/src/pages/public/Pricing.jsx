import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Zap, HelpCircle, ArrowRight, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import FaqAccordion from '../../components/public/FaqAccordion';

const PRICING_TIERS = [
  {
    name: 'Single Skill Course',
    price: 8000,
    period: 'one-time fee',
    badge: 'Popular',
    description: 'Master a single core skill with hands-on projects and certification.',
    features: [
      'Full Lifetime Access to Course Videos',
      'Downloadable Code & Starter Kits',
      '120-Minute Timed Assessment Exam',
      'Verified Digital Certificate',
      'Community Q&A Support',
    ],
    ctaText: 'Browse Courses',
    ctaLink: '/courses',
    highlighted: false,
  },
  {
    name: 'Career Track Bundle',
    price: 14000,
    originalPrice: 18000,
    period: 'one-time fee',
    badge: 'Best Value',
    description: 'Complete multi-course specialization for full career readiness.',
    features: [
      'Access to 3+ Related Specialized Courses',
      'Includes All Starter Kits & Repositories',
      'Priority 120-Minute Exam Attempts',
      'QR-Code Verified Digital Certificate',
      'Direct Mentor Review & Feedback',
      'Resume & Portfolio Audit',
    ],
    ctaText: 'Enroll Career Bundle',
    ctaLink: '/courses',
    highlighted: true,
  },
  {
    name: 'Master Professional',
    price: 18000,
    period: 'one-time fee',
    description: 'All-access pass with 1-on-1 mentorship for serious developers.',
    features: [
      'All Current & Upcoming Tech Courses',
      '1-on-1 Mentorship Code Reviews',
      'Unlimited Assessment Exam Retakes',
      'Official Verified Master Certificate',
      'Job Placement & Referral Network',
      'Dedicated Career Counselor',
    ],
    ctaText: 'Contact Admissions',
    ctaLink: '/contact',
    highlighted: false,
  },
];

const PRICING_FAQS = [
  {
    question: 'Are there any recurring monthly charges or subscription fees?',
    answer:
      'No! All course prices at MSN Academy are one-time payments in Pakistani Rupees (PKR). Once enrolled, you get full lifetime access with no hidden charges.',
  },
  {
    question: 'What payment methods do you accept in Pakistan?',
    answer:
      'We accept all local payment options: Direct Bank Transfers (HBL, Meezan, Allied), JazzCash, EasyPaisa, and Credit/Debit cards.',
  },
  {
    question: 'What is the 7-day money-back guarantee policy?',
    answer:
      'If you are not satisfied with your course within the first 7 days of enrollment, simply submit a request and we will issue a full refund.',
  },
  {
    question: 'Is the 120-minute assessment exam included in the course fee?',
    answer:
      'Yes, the 120-minute exam attempt and your official digital certificate generation are fully included in the course fee.',
  },
];

export default function Pricing() {
  return (
    <div className="space-y-16 pb-16">
      {/* Page Hero Header */}
      <section className="bg-brand-navy text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Transparent Pricing in PKR
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            Affordable Skill Investment for Pakistan
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-base text-gray-300 sm:text-lg">
            No hidden fees or monthly subscriptions. Pay once in PKR and gain lifetime access with full exam evaluation and digital certification.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-3xl p-8 transition-all ${
                tier.highlighted
                  ? 'border-2 border-brand-crimson bg-white shadow-2xl relative ring-4 ring-brand-crimson/10 lg:-translate-y-2'
                  : 'border border-gray-200 bg-white shadow-sm hover:shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-brand-navy">{tier.name}</h3>
                  {tier.badge && (
                    <Badge variant={tier.highlighted ? 'crimson' : 'navy'}>{tier.badge}</Badge>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{tier.description}</p>

                <div className="mt-6 border-y border-gray-100 py-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-brand-navy">
                      PKR {tier.price.toLocaleString()}
                    </span>
                    {tier.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        PKR {tier.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-400">{tier.period}</span>
                </div>

                {/* Features Checklist */}
                <ul className="mt-6 space-y-3.5 text-xs text-gray-600">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link to={tier.ctaLink}>
                  <Button
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    size="lg"
                    className="w-full"
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee & Local Payment Notice */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-brand-navy">
                7-Day Money Back Guarantee
              </h4>
              <p className="mt-0.5 text-xs text-gray-600">
                Enroll with full confidence. If you're not satisfied, request a full refund within 7 days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-gray-500">Accepted:</span>
            <Badge variant="navy">Bank Transfer</Badge>
            <Badge variant="warning">JazzCash</Badge>
            <Badge variant="success">EasyPaisa</Badge>
          </div>
        </div>
      </section>

      {/* Pricing FAQs Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Pricing Questions
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-brand-navy sm:text-3xl">
            Frequently Asked Pricing Questions
          </h2>
        </div>

        <FaqAccordion faqs={PRICING_FAQS} showCategories={false} />
      </section>
    </div>
  );
}
