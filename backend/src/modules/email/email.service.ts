import nodemailer, { Transporter } from 'nodemailer';
import { Resend } from 'resend';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';
import { SendEmailOptions, SendEmailResult } from './email.types';
import {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getWelcomeEmailHtml,
  getInquiryAutoReplyHtml,
  getInquiryAdminAlertHtml,
  getOrderReceiptHtml,
} from './email.templates';

class EmailService {
  private resend: Resend | null = null;
  private transporter: Transporter | null = null;
  private readonly defaultFrom: string;

  constructor() {
    this.defaultFrom = env.EMAIL_FROM || 'MSN Academy <onboarding@resend.dev>';

    // Priority 1: Nodemailer Gmail SMTP (supports sending to ANY email address)
    if (env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS.replace(/\s+/g, ''), // clean any accidental whitespace from app password
        },
      });
      logger.info(`📧 Nodemailer Gmail SMTP Client initialized for ${env.SMTP_USER}`);
    } else if (env.RESEND_API_KEY) {
      // Priority 2: Resend API
      this.resend = new Resend(env.RESEND_API_KEY);
      logger.info('📧 Resend Email Client initialized successfully.');
    } else {
      logger.warn(
        '⚠️ Neither SMTP nor RESEND_API_KEY is configured. Running in Local Development Logging Mode (Emails will print to console).'
      );
    }
  }

  /**
   * Send email using Gmail SMTP or Resend API with local development console fallback.
   */
  public async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    // Case 1: Send via Nodemailer Gmail SMTP
    if (this.transporter && env.SMTP_USER) {
      try {
        const fromAddress = options.from || `MSN Academy <${env.SMTP_USER}>`;
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: recipients.join(', '),
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: options.replyTo,
        });

        logger.info({ messageId: info.messageId, to: recipients }, '✅ Email dispatched successfully via Gmail SMTP');
        return { success: true, messageId: info.messageId };
      } catch (err: any) {
        logger.error({ err: err.message, to: recipients }, '❌ Error sending email via Gmail SMTP');
        return { success: false, error: err.message };
      }
    }

    // Case 2: Send via Resend API
    if (this.resend && env.RESEND_API_KEY) {
      const fromAddress = options.from || this.defaultFrom;
      try {
        const response = await this.resend.emails.send({
          from: fromAddress,
          to: recipients,
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: options.replyTo,
        });

        if (response.error) {
          logger.error({ error: response.error, to: recipients }, '❌ Resend delivery error');
          return { success: false, error: response.error.message };
        }

        logger.info({ messageId: response.data?.id, to: recipients }, '✅ Email dispatched successfully via Resend');
        return { success: true, messageId: response.data?.id };
      } catch (err: any) {
        logger.error({ err: err.message, to: recipients }, '❌ Unexpected error in Resend EmailService');
        return { success: false, error: err.message };
      }
    }

    // Case 3: Local Simulation Fallback
    const fromAddress = options.from || this.defaultFrom;
    logger.info(
      {
        to: recipients,
        subject: options.subject,
        from: fromAddress,
      },
      '📨 [LOCAL EMAIL SIMULATION] Email dispatched'
    );
    console.log('------------------ 📧 EMAIL SIMULATION ------------------');
    console.log(`To: ${recipients.join(', ')}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`From: ${fromAddress}`);
    console.log('---------------------------------------------------------');
    return { success: true, messageId: 'simulated-dev-msg-id' };
  }

  /**
   * Dispatches student account verification code (OTP).
   */
  public async sendVerificationEmail(
    to: string,
    fullName: string,
    code: string,
    verifyUrl?: string
  ): Promise<SendEmailResult> {
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=============================================================');
      console.log(`🔑 [MSN ACADEMY VERIFICATION CODE] For: ${to}`);
      console.log(`👉 6-Digit OTP: [ ${code} ]`);
      if (verifyUrl) {
        console.log(`🔗 Direct Auto-Verify Link: ${verifyUrl}`);
      }
      console.log('=============================================================\n');
    }

    const html = getVerificationEmailHtml(fullName, code, verifyUrl);
    return this.sendEmail({
      to,
      subject: `${code} is your MSN Academy verification code`,
      html,
      text: `Your MSN Academy verification code is: ${code}. Valid for 24 hours.`,
    });
  }

  /**
   * Dispatches password recovery link.
   */
  public async sendPasswordResetEmail(
    to: string,
    fullName: string,
    resetUrl: string
  ): Promise<SendEmailResult> {
    const html = getPasswordResetEmailHtml(fullName, resetUrl);
    return this.sendEmail({
      to,
      subject: 'Reset your MSN Academy password',
      html,
      text: `Click the link to reset your password: ${resetUrl}. Valid for 15 minutes.`,
    });
  }

  /**
   * Dispatches welcome onboarding packet.
   */
  public async sendWelcomeEmail(to: string, fullName: string, dashboardUrl: string): Promise<SendEmailResult> {
    const html = getWelcomeEmailHtml(fullName, dashboardUrl);
    return this.sendEmail({
      to,
      subject: 'Welcome to MSN Academy! 🚀',
      html,
      text: `Welcome to MSN Academy, ${fullName}! Access your student portal at: ${dashboardUrl}`,
    });
  }

  /**
   * Handles Contact Us form submissions:
   * 1. Sends Auto-reply confirmation to the inquirer.
   * 2. Sends Admin lead notification to admissions team.
   */
  public async handleContactInquiry(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    subject: string;
    message: string;
  }): Promise<{ autoReply: SendEmailResult; adminAlert: SendEmailResult }> {
    const autoReplyHtml = getInquiryAutoReplyHtml(data.fullName, data.subject);
    const autoReplyPromise = this.sendEmail({
      to: data.email,
      subject: `We have received your message: ${data.subject}`,
      html: autoReplyHtml,
    });

    const adminEmail = env.ADMIN_EMAIL || 'admissions@msnacademy.pk';
    const adminAlertHtml = getInquiryAdminAlertHtml({
      ...data,
      receivedAt: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    });
    const adminAlertPromise = this.sendEmail({
      to: adminEmail,
      replyTo: data.email,
      subject: `[New Inquiry] ${data.subject} - ${data.fullName}`,
      html: adminAlertHtml,
    });

    const [autoReply, adminAlert] = await Promise.all([autoReplyPromise, adminAlertPromise]);
    return { autoReply, adminAlert };
  }

  /**
   * Dispatches order receipt & enrollment invoice.
   */
  public async sendOrderReceiptEmail(data: {
    to: string;
    fullName: string;
    orderId: string;
    courses: Array<{ title: string; price: number }>;
    totalAmount: number;
    paymentMethod: string;
    lmsUrl: string;
  }): Promise<SendEmailResult> {
    const html = getOrderReceiptHtml(data);
    return this.sendEmail({
      to: data.to,
      subject: `Enrollment Confirmed & Invoice #${data.orderId} - MSN Academy`,
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
