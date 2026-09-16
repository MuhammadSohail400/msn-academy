import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageSquare } from 'lucide-react';
import FaqAccordion from '../../components/public/FaqAccordion';
import Button from '../../components/ui/Button';

const ALL_FAQS = [
  // General
  {
    id: 1,
    category: 'General',
    question: 'What is MSN Academy and how does it work?',
    answer:
      'MSN Academy is Pakistan’s leading vocational skills learning management system. Students enroll in structured tech & vocational programs, complete video modules, and take a 120-minute timed assessment exam to earn QR-code verifiable certificates.',
  },
  {
    id: 2,
    category: 'General',
    question: 'Who can enroll in MSN Academy courses?',
    answer:
      'Anyone! Our courses cater to university students, fresh graduates, working professionals, and freelancers seeking to upgrade their practical technology skills.',
  },

  // Admissions & Courses
  {
    id: 3,
    category: 'Admissions & Courses',
    question: 'Do I get lifetime access to the course content?',
    answer:
      'Yes. Once you purchase or enroll in a course, you maintain full lifetime access to all lecture videos, source code repositories, and downloadable materials.',
  },
  {
    id: 4,
    category: 'Admissions & Courses',
    question: 'Are the courses self-paced or do they have live classes?',
    answer:
      'Courses combine self-paced HD video lectures with scheduled live Q&A mentor sessions, enabling you to learn according to your own flexible schedule.',
  },

  // Payments & Billing
  {
    id: 5,
    category: 'Payments & Billing',
    question: 'How do I pay for a course in Pakistan?',
    answer:
      'We support Direct Bank Transfers (HBL, Meezan, Allied Bank), JazzCash, EasyPaisa, and Debit/Credit Card payments. Manual bank slip uploads are processed within 24 hours.',
  },
  {
    id: 6,
    category: 'Payments & Billing',
    question: 'Can I request a refund if I am not satisfied?',
    answer:
      'Yes, we offer a 7-day money-back guarantee. If you are unsatisfied within the first 7 days, contact our support team for a hassle-free refund.',
  },

  // LMS & 120m Assessment Engine
  {
    id: 7,
    category: 'LMS & Exams',
    question: 'How does the 120-minute timed assessment engine work?',
    answer:
      'After completing all module lectures, you unlock the 120-minute timed MCQ exam. The exam features 50 randomized questions, real-time countdown, question flagging, and instant score evaluation. A score of 70% or higher is required to pass.',
  },
  {
    id: 8,
    category: 'LMS & Exams',
    question: 'What happens if I fail the assessment exam?',
    answer:
      'Don’t worry! If you score below 70%, you can review module weak points and retake the assessment exam after a 24-hour cooling-off period.',
  },

  // Certificates & Verification
  {
    id: 9,
    category: 'Certificates',
    question: 'How does digital certificate verification work?',
    answer:
      'Each certificate features a unique Credential ID and embedded QR code. Employers and recruiters can visit /verify on MSN Academy to instantly confirm authentic student credentials.',
  },
  {
    id: 10,
    category: 'Certificates',
    question: 'Can I download a high-resolution PDF of my certificate?',
    answer:
      'Yes! Once passed, your certificate canvas generates a high-resolution print-ready PDF complete with digital seals and founder signatures.',
  },
];

export default function FAQ() {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Hero Header */}
      <section className="bg-brand-navy text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Help Center & Support
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-base text-gray-300">
            Find answers to common questions about course enrollments, payments, 120-minute exams, and certificate verification.
          </p>
        </div>
      </section>

      {/* Main FAQ Accordion Container */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FaqAccordion faqs={ALL_FAQS} showCategories={true} />
      </section>

      {/* Still Have Questions Banner */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-xl font-bold text-brand-navy">
              Still have questions?
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              Can’t find the answer you’re looking for? Reach out directly to our support team.
            </p>
          </div>
          <Link to="/contact" className="mt-4 inline-block sm:mt-0">
            <Button variant="primary" size="md" icon={MessageSquare}>
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
