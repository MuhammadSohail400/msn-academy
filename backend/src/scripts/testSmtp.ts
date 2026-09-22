import { emailService } from '../modules/email/email.service';
import { env } from '../config/environment';

async function testGmailSmtp() {
  console.log('\n======================================================');
  console.log('🔍 Testing Gmail SMTP Connection for MSN Academy');
  console.log('======================================================');
  console.log(`SMTP_USER: ${env.SMTP_USER || '(Not set)'}`);
  console.log(`SMTP_PASS: ${env.SMTP_PASS ? '******** (configured)' : '(Not set)'}`);

  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.error('\n❌ ERROR: SMTP_USER or SMTP_PASS is missing in your .env.development file!');
    console.log('👉 Please add your Gmail address and 16-character App Password to backend/.env.development:');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASS=xxxx xxxx xxxx xxxx\n');
    process.exit(1);
  }

  const targetEmail = process.argv[2] || env.SMTP_USER;
  console.log(`\n📨 Dispatching test verification email to: ${targetEmail} ...`);

  try {
    const result = await emailService.sendVerificationEmail(
      targetEmail,
      'MSN Student',
      '123456',
      'http://localhost:5173/verify-email?code=123456'
    );

    if (result.success) {
      console.log('\n🎉 SUCCESS: Test email successfully sent!');
      console.log(`Message ID: ${result.messageId}`);
      console.log(`Check the inbox for ${targetEmail}!\n`);
    } else {
      console.error('\n❌ FAILED to send email:', result.error);
    }
  } catch (err: any) {
    console.error('\n❌ Unexpected error during SMTP test:', err.message);
  }
}

testGmailSmtp();
