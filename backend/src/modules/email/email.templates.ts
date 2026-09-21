/**
 * Shared layout wrapper for MSN Academy branded transactional emails.
 */
function wrapInLayout(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header span {
      color: #ef4444;
    }
    .header p {
      margin: 6px 0 0 0;
      color: #94a3b8;
      font-size: 13px;
    }
    .body {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
    }
    .body h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    .button-container {
      margin: 28px 0;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #dc2626;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
    }
    .code-box {
      margin: 24px 0;
      padding: 18px 24px;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      text-align: center;
    }
    .code-box .code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #dc2626;
    }
    .code-box .expiry {
      margin-top: 8px;
      font-size: 12px;
      color: #64748b;
    }
    .info-box {
      margin: 20px 0;
      padding: 16px;
      background: #f8fafc;
      border-radius: 10px;
      border-left: 4px solid #dc2626;
      font-size: 14px;
      color: #475569;
    }
    .footer {
      padding: 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>MSN <span>Academy</span></h1>
        <p>Vocational & Technology Skills Platform</p>
      </div>
      <div class="body">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} MSN Academy (Pvt) Ltd. All rights reserved.</p>
        <p>Lahore, Pakistan • <a href="mailto:support@msnacademy.pk">support@msnacademy.pk</a></p>
        <p>This is an automated operational notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Email Verification Template (6-Digit OTP)
 */
export function getVerificationEmailHtml(fullName: string, code: string, verifyUrl?: string): string {
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Assalam o Alaikum <strong>${fullName}</strong>,</p>
    <p>Welcome to <strong>MSN Academy</strong>! Please use the 6-digit verification code below to confirm your student account and activate your learning portal:</p>
    
    <div class="code-box">
      <div class="code">${code}</div>
      <div class="expiry">This verification code expires in <strong>24 hours</strong>.</div>
    </div>

    ${
      verifyUrl
        ? `
    <div class="button-container">
      <a href="${verifyUrl}" class="button" target="_blank">Verify Email Directly</a>
    </div>`
        : ''
    }

    <div class="info-box">
      <strong>Security Notice:</strong> If you did not create an account on MSN Academy, please disregard this email. Your email address will remain untouched.
    </div>
  `;
  return wrapInLayout('Verify Your MSN Academy Account', content);
}

/**
 * 2. Password Reset Template
 */
export function getPasswordResetEmailHtml(fullName: string, resetUrl: string): string {
  const content = `
    <h2>Reset Your Password</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>We received a request to reset the password associated with your MSN Academy account. Click the secure button below to set a new password:</p>
    
    <div class="button-container">
      <a href="${resetUrl}" class="button" target="_blank">Reset My Password</a>
    </div>

    <div class="info-box">
      <strong>Important:</strong> This password reset link is valid for <strong>15 minutes</strong> and can only be used once.
    </div>

    <p style="font-size: 13px; color: #64748b;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
    </p>

    <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
      If you did not request a password reset, you can safely ignore this email — your account remains completely secure.
    </p>
  `;
  return wrapInLayout('Reset Your Password - MSN Academy', content);
}

/**
 * 3. Welcome / Onboarding Template
 */
export function getWelcomeEmailHtml(fullName: string, dashboardUrl: string): string {
  const content = `
    <h2>Welcome to MSN Academy! 🚀</h2>
    <p>Assalam o Alaikum <strong>${fullName}</strong>,</p>
    <p>Your account is now fully verified and active. You are now part of Pakistan's fastest-growing community of career-driven tech learners.</p>
    
    <div class="info-box">
      <strong>What's waiting for you:</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Hands-on, project-based video curriculums</li>
        <li>Timed final competency assessments</li>
        <li>Verifiable digital credentials & QR-coded certificates</li>
        <li>Lifetime access with zero recurring subscription fees</li>
      </ul>
    </div>

    <div class="button-container">
      <a href="${dashboardUrl}" class="button" target="_blank">Go to Student Dashboard</a>
    </div>
  `;
  return wrapInLayout('Welcome to MSN Academy', content);
}

/**
 * 4. Contact Us Visitor Auto-Reply
 */
export function getInquiryAutoReplyHtml(fullName: string, subject: string): string {
  const content = `
    <h2>Message Received! 📬</h2>
    <p>Dear <strong>${fullName}</strong>,</p>
    <p>Thank you for reaching out to <strong>MSN Academy</strong> regarding:</p>
    
    <div class="info-box">
      <strong>Subject:</strong> ${subject}
    </div>

    <p>Our admissions and student support team has received your message. A representative will review your inquiry and get back to you within <strong>24 business hours</strong>.</p>
    
    <p>In the meantime, feel free to explore our featured programs and syllabi on our official platform.</p>

    <div class="button-container">
      <a href="https://msnacademy.pk/courses" class="button" target="_blank">Browse Programs</a>
    </div>
  `;
  return wrapInLayout('We received your message - MSN Academy', content);
}

/**
 * 5. Contact Us Admin Lead Alert
 */
export function getInquiryAdminAlertHtml(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  receivedAt: string;
}): string {
  const content = `
    <h2>New Inbound Contact Inquiry 🔥</h2>
    <p>A new prospective student or visitor has submitted the contact form on MSN Academy:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 120px;">Full Name:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">${data.fullName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email:</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone:</td>
        <td style="padding: 10px 0; color: #0f172a;">${data.phone || 'Not provided'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Subject:</td>
        <td style="padding: 10px 0; color: #0f172a;">${data.subject}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Received At:</td>
        <td style="padding: 10px 0; color: #64748b;">${data.receivedAt}</td>
      </tr>
    </table>

    <div style="background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 10px;">
      <strong style="color: #0f172a; display: block; margin-bottom: 8px;">Message Content:</strong>
      <p style="margin: 0; white-space: pre-wrap; color: #334155; line-height: 1.6;">${data.message}</p>
    </div>

    <div class="button-container">
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="button" target="_blank">Reply to ${data.fullName}</a>
    </div>
  `;
  return wrapInLayout(`[New Inquiry] ${data.subject}`, content);
}

/**
 * 6. Order Receipt / Payment Confirmation Template
 */
export function getOrderReceiptHtml(data: {
  fullName: string;
  orderId: string;
  courses: Array<{ title: string; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  lmsUrl: string;
}): string {
  const courseRows = data.courses
    .map(
      (c) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #0f172a; font-weight: 500;">${c.title}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">PKR ${c.price.toLocaleString()}</td>
      </tr>`
    )
    .join('');

  const content = `
    <h2>Payment Receipt & Enrollment Confirmed! 🎉</h2>
    <p>Dear <strong>${data.fullName}</strong>,</p>
    <p>Thank you for enrolling in MSN Academy. Your payment has been confirmed and your courses are now unlocked with lifetime access.</p>
    
    <div style="background: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #64748b;">
        <span>Order ID: <strong>#${data.orderId}</strong></span>
        <span>Method: <strong>${data.paymentMethod}</strong></span>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${courseRows}
        <tr style="border-top: 2px solid #e2e8f0;">
          <td style="padding: 14px 0 0 0; font-weight: 700; color: #0f172a; font-size: 16px;">Total Paid:</td>
          <td style="padding: 14px 0 0 0; text-align: right; font-weight: 800; color: #dc2626; font-size: 17px;">PKR ${data.totalAmount.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <div class="button-container">
      <a href="${data.lmsUrl}" class="button" target="_blank">Start Learning Now</a>
    </div>
  `;
  return wrapInLayout(`Order Receipt #${data.orderId} - MSN Academy`, content);
}
