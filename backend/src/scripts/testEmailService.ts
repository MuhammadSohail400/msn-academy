import { emailService } from '../modules/email/email.service';
import {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getWelcomeEmailHtml,
  getInquiryAutoReplyHtml,
  getInquiryAdminAlertHtml,
  getOrderReceiptHtml,
} from '../modules/email/email.templates';

async function runEmailTests() {
  console.log('🧪 Starting MSN Academy Email Service Verification...\n');

  // 1. Test HTML Template Compilation
  console.log('1️⃣ Testing HTML Template Rendering:');
  const verifyHtml = getVerificationEmailHtml('Hamza Ali', '839201', 'http://localhost:5173/verify-email');
  const resetHtml = getPasswordResetEmailHtml('Hamza Ali', 'http://localhost:5173/reset-password?token=mocktoken123');
  const welcomeHtml = getWelcomeEmailHtml('Hamza Ali', 'http://localhost:5173/dashboard');
  const inquiryReplyHtml = getInquiryAutoReplyHtml('Hamza Ali', 'Course timings inquiry');
  const inquiryAdminHtml = getInquiryAdminAlertHtml({
    fullName: 'Hamza Ali',
    email: 'hamza.ali@example.com',
    phone: '03001234567',
    subject: 'Course timings inquiry',
    message: 'When does the next Data Analytics cohort start?',
    receivedAt: new Date().toLocaleString(),
  });
  const receiptHtml = getOrderReceiptHtml({
    fullName: 'Hamza Ali',
    orderId: 'ORD-2026-9481',
    courses: [{ title: 'Practical Data Analytics', price: 15000 }],
    totalAmount: 15000,
    paymentMethod: 'Easypaisa',
    lmsUrl: 'http://localhost:5173/dashboard',
  });

  const allRendered =
    verifyHtml.includes('839201') &&
    resetHtml.includes('mocktoken123') &&
    welcomeHtml.includes('Student Dashboard') &&
    inquiryReplyHtml.includes('Course timings inquiry') &&
    inquiryAdminHtml.includes('03001234567') &&
    receiptHtml.includes('ORD-2026-9481');

  if (allRendered) {
    console.log('   ✅ All 6 HTML templates rendered with valid dynamic interpolation.\n');
  } else {
    throw new Error('Template rendering validation failed!');
  }

  // 2. Test Verification Email Dispatch (Live Resend / Dev Simulation)
  const testRecipient = process.env.ADMIN_EMAIL || 'msohailg211@gmail.com';
  console.log(`2️⃣ Testing Email Service Dispatch to ${testRecipient}:`);

  const verifyResult = await emailService.sendVerificationEmail(
    testRecipient,
    'Sohail',
    '482910',
    'http://localhost:5173/verify-email?code=482910'
  );
  console.log('   Verification Dispatch Result:', verifyResult);

  // 3. Test Password Reset Dispatch
  console.log(`\n3️⃣ Testing Password Reset Dispatch to ${testRecipient}:`);
  const resetResult = await emailService.sendPasswordResetEmail(
    testRecipient,
    'Sohail',
    'http://localhost:5173/reset-password?token=live_test_token'
  );
  console.log('   Password Reset Dispatch Result:', resetResult);

  // 4. Test Contact Inquiry Dual Dispatch
  console.log('\n4️⃣ Testing Contact Inquiry Flow (Auto-reply + Admin alert):');
  const inquiryResults = await emailService.handleContactInquiry({
    fullName: 'Sohail',
    email: testRecipient,
    phone: '03219876543',
    subject: 'UI/UX Design Certification inquiry',
    message: 'Testing live Resend email integration for MSN Academy!',
  });
  console.log('   Visitor Auto-Reply:', inquiryResults.autoReply);
  console.log('   Admin Alert:', inquiryResults.adminAlert);

  console.log('\n🎉 Email Service verification completed successfully!');
  process.exit(0);
}

runEmailTests().catch((err) => {
  console.error('❌ Email service verification failed:', err);
  process.exit(1);
});
