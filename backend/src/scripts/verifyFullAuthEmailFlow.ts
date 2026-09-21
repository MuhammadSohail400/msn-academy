import mongoose from 'mongoose';
import { env } from '../config/environment';
import { User } from '../modules/users/user.model';
import { AuthService } from '../modules/auth/auth.service';
import { InquiryService } from '../modules/inquiries/inquiry.service';

async function runEndToEndVerification() {
  console.log('🚀 Starting MSN Academy Auth & Email Integration Test...\n');

  try {
    // 1. Connect to MongoDB
    console.log('1️⃣ Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('   ✅ Connected to database successfully.\n');

    // 2. Test User Registration Flow
    const testEmail = `test.student.${Date.now()}@example.com`;
    console.log(`2️⃣ Testing Registration with email: ${testEmail}`);
    const regResult = await AuthService.register({
      fullName: 'Test Student MSN',
      email: testEmail,
      password: 'SecurePassword123!',
      phoneNumber: '+923001234567',
    });

    console.log('   ✅ Registration completed. User ID:', regResult.user._id);
    console.log('   ✅ Initial isEmailVerified:', regResult.user.isEmailVerified);

    // Fetch user from DB to verify hashed verification code was set
    const savedUser = await User.findOne({ email: testEmail }).select('+emailVerificationCode +emailVerificationExpires');
    if (!savedUser?.emailVerificationCode || !savedUser?.emailVerificationExpires) {
      throw new Error('Verification code was not properly generated on registration!');
    }
    console.log('   ✅ Stored verification hash exists:', savedUser.emailVerificationCode.substring(0, 10) + '...');
    console.log('   ✅ Verification expires at:', savedUser.emailVerificationExpires);

    // 3. Test Resending Verification Code
    console.log('\n3️⃣ Testing Resend Verification Code...');
    await AuthService.resendVerification(testEmail);
    console.log('   ✅ Resend verification dispatched successfully.');

    // 4. Test Email Verification
    // Retrieve the updated code or verify by updating the code to a known code
    console.log('\n4️⃣ Testing Email Verification using valid OTP...');
    const knownOtp = '654321';
    const crypto = await import('crypto');
    savedUser.emailVerificationCode = crypto.createHash('sha256').update(knownOtp).digest('hex');
    savedUser.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60);
    await savedUser.save();

    await AuthService.verifyEmail(testEmail, knownOtp);
    const verifiedUser = await User.findOne({ email: testEmail });
    if (!verifiedUser?.isEmailVerified) {
      throw new Error('User isEmailVerified should be true after successful verification!');
    }
    console.log('   ✅ User successfully verified! isEmailVerified:', verifiedUser.isEmailVerified);

    // 5. Test Contact Inquiry Flow
    console.log('\n5️⃣ Testing Contact Us Inquiry submission with Email Dispatch...');
    const inquiryResult = await InquiryService.createInquiry({
      fullName: 'Prospective Student',
      email: 'student.inquiry@example.com',
      phone: '03123456789',
      subject: 'Inquiry regarding Full Stack Cohort',
      message: 'Hello, what are the class timings and certificate details for MSN Academy?',
    });
    console.log('   ✅ Inquiry created successfully. Inquiry ID:', inquiryResult.inquiryId);

    // Clean up test user
    await User.deleteOne({ email: testEmail });
    console.log(`\n🧹 Cleaned up test user ${testEmail}`);

    console.log('\n========================================');
    console.log('🎉 ALL AUTH & EMAIL INTEGRATION TESTS PASSED!');
    console.log('========================================\n');
  } catch (err: any) {
    console.error('❌ Integration test failed:', err.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runEndToEndVerification();
