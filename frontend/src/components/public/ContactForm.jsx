import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import contactService from '../../services/contactService';
import { PK_PHONE_REGEX } from '../../utils/validators';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => PK_PHONE_REGEX.test(val), {
      message: 'Please enter a valid Pakistani phone number (e.g., 03001234567)',
    }),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export default function ContactForm({ onSuccess }) {
  const [serverSuccess, setServerSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setServerSuccess('');
    setServerError('');
    try {
      const response = await contactService.submitContact(data);
      setServerSuccess(response?.message || 'Thank you! Your inquiry has been sent successfully.');
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(
        err?.message || 'Failed to send inquiry. Please check your details and try again.'
      );
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-bold text-brand-navy">Send Us a Message</h3>
      <p className="mt-1 text-sm text-gray-500">
        Have questions about courses, admissions, or corporate training? Fill out the form below.
      </p>

      {/* Success Notification Banner */}
      {serverSuccess && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold">Message Sent!</p>
            <p className="mt-0.5 text-xs text-emerald-700">{serverSuccess}</p>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {serverError && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Submission Error</p>
            <p className="mt-0.5 text-xs text-red-700">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Muhammad Ali"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="ali@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone Number (Pakistani)"
            type="tel"
            placeholder="03001234567"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Subject"
            placeholder="Course Inquiry / Admissions"
            {...register('subject')}
            error={errors.subject?.message}
          />
        </div>

        <Textarea
          label="Your Message"
          rows={5}
          placeholder="Describe how we can help you or what course you're interested in..."
          {...register('message')}
          error={errors.message?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          icon={Send}
          className="w-full sm:w-auto"
        >
          Send Inquiry
        </Button>
      </form>
    </div>
  );
}

ContactForm.propTypes = {
  onSuccess: PropTypes.func,
};
