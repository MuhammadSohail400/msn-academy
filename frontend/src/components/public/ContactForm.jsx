import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import contactService from '../../services/contactService';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Your message should be at least 10 characters long'),
});

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError('');
      await contactService.submitInquiry(data);
      setSubmittedSuccess(true);
      reset();
    } catch (err) {
      setServerError(err?.message || 'Failed to submit inquiry. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
        Send Us a Message
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        Have questions about admissions, fees, or course curriculum? Our admissions counselors reply within 2 business hours.
      </p>

      {submittedSuccess && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Message sent successfully!</strong>
            <p className="text-xs text-emerald-700 mt-1">
              Thank you for reaching out. An MSN Academy academic counselor will contact you via email shortly.
            </p>
          </div>
        </div>
      )}

      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-brand-crimson">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Muhammad Bilal"
            {...register('fullName')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                : 'border-slate-200 bg-slate-50/50 focus:border-brand-crimson focus:bg-white focus:ring-brand-crimson/10'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-brand-crimson">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g., bilal.farooq@example.pk"
            {...register('email')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                : 'border-slate-200 bg-slate-50/50 focus:border-brand-crimson focus:bg-white focus:ring-brand-crimson/10'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Subject <span className="text-brand-crimson">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Inquiry regarding Web Development installment plan"
            {...register('subject')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.subject
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                : 'border-slate-200 bg-slate-50/50 focus:border-brand-crimson focus:bg-white focus:ring-brand-crimson/10'
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-rose-600">{errors.subject.message}</p>
          )}
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Message <span className="text-brand-crimson">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your background, goals, or any specific questions..."
            {...register('message')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.message
                ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                : 'border-slate-200 bg-slate-50/50 focus:border-brand-crimson focus:bg-white focus:ring-brand-crimson/10'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-rose-600">{errors.message.message}</p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 px-6 text-sm font-bold text-white shadow-lg shadow-brand-crimson/25 hover:bg-brand-crimson-hover transition-all disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
