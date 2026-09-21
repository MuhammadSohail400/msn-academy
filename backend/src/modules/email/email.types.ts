export type EmailJobType =
  | 'auth.verify-email'
  | 'auth.forgot-password'
  | 'auth.welcome'
  | 'inquiry.auto-reply'
  | 'inquiry.admin-alert'
  | 'order.receipt';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailJobData {
  jobType: EmailJobType;
  options: SendEmailOptions;
}
