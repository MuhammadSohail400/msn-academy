import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import contactService from '../../services/contactService';

// Helper to convert the API errors array [ { field, message } ] into a map { fieldName: message }
function buildFieldErrors(errorsArray = []) {
  return errorsArray.reduce((acc, e) => {
    if (e.field) acc[e.field] = e.message;
    return acc;
  }, {});
}

// Reusable input-error helper component
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});  // { fullName: '…', email: '…', … }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the per-field error as the user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    // Client-side quick checks before hitting the server
    const clientErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      clientErrors.fullName = 'Full name must be at least 3 characters';
    }
    if (!formData.email.trim()) {
      clientErrors.email = 'Email address is required';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      clientErrors.subject = 'Subject must be at least 5 characters';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      clientErrors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    try {
      setSubmitting(true);
      await contactService.submitInquiry(formData);
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      // err.errors = [ { field: 'fullName', message: '…' }, … ]  (from apiClient interceptor)
      if (err.errors && err.errors.length > 0) {
        setFieldErrors(buildFieldErrors(err.errors));
        setGlobalError('Please fix the highlighted fields below.');
      } else {
        setGlobalError(err.message || 'Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: highlight the input border red if that field has an error
  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
      fieldErrors[field]
        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-400'
        : 'border-slate-200 bg-white focus:border-brand-crimson focus:ring-brand-crimson'
    }`;

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-navy text-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Get In Touch
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-white">
            Contact MSN Academy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Have a question? Our team is here to help.
          </p>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Form */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-6">
              Send Us a Message
            </h2>

            {/* Success Banner */}
            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Message sent successfully!</strong>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Global Error Banner — only shown when there's no field-level errors to point to */}
            {globalError && Object.keys(fieldErrors).length === 0 && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>{globalError}</div>
              </div>
            )}

            {/* Subtle top banner when field errors exist */}
            {Object.keys(fieldErrors).length > 0 && !success && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Please fix the highlighted fields below.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass('fullName')}
                  />
                  <FieldError message={fieldErrors.fullName} />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass('email')}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
              </div>

              {/* Phone (optional) */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className={inputClass('phone')}
                />
                <FieldError message={fieldErrors.phone} />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                  className={inputClass('subject')}
                />
                <FieldError message={fieldErrors.subject} />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here…"
                  className={`${inputClass('message')} resize-none`}
                />
                <FieldError message={fieldErrors.message} />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-crimson-hover transition-colors disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Contact Information & Response Time Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-display text-base font-bold text-slate-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Email</span>
                    <a href="mailto:info@msnacademy.com" className="font-semibold text-slate-800 hover:text-brand-crimson transition-colors">
                      info@msnacademy.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-800">+92 XXX XXX XXXX</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Location</span>
                    <span className="font-semibold text-slate-800">Pakistan</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-crimson shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">WhatsApp</span>
                    <a
                      href="https://wa.me/923000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 hover:text-brand-crimson transition-colors"
                    >
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Navy Response Time Card */}
            <div className="rounded-2xl bg-brand-navy p-6 sm:p-7 text-white">
              <h4 className="font-display text-sm font-bold text-white mb-2">
                Response Time
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We typically respond to all enquiries within 24 hours on business days. For urgent matters, please reach out via WhatsApp.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
