import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api/v1';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from [${options.method || 'GET'} ${endpoint}]: ${text}`);
  }

  return { status: response.status, data: json, headers: response.headers };
}

function extractAccessToken(resHeaders: Headers): string {
  const setCookies = (resHeaders as any).getSetCookie
    ? (resHeaders as any).getSetCookie()
    : [resHeaders.get('set-cookie') || ''];
  for (const cookie of setCookies) {
    const match = cookie.match(/access_token=([^;]+)/);
    if (match) {
      return match[1];
    }
  }
  return '';
}

async function runVerification() {
  console.log('🧪 Starting Phase 5 (120m Assessment Engine & QR Certificate Verification) Verification...\n');

  // 1. Health check
  console.log('1️⃣ Checking API Health...');
  const health = await request('/health');
  assert.strictEqual(health.status, 200, 'Health check should return 200');
  console.log('   ✅ Health endpoint is UP and healthy.\n');

  // 2. Fetch Course Catalog
  console.log('2️⃣ Fetching courses from master catalog...');
  const coursesRes = await request('/courses?limit=2');
  assert.strictEqual(coursesRes.status, 200);
  const courses = Array.isArray(coursesRes.data.data) ? coursesRes.data.data : coursesRes.data.data.items;
  assert.ok(courses && courses.length >= 1, 'Need at least 1 course in catalog');
  const targetCourse = courses[0];
  console.log(`   ✅ Selected Course: "${targetCourse.title}" (ID: ${targetCourse.id})\n`);

  // 3. Student Setup & Authentication
  console.log('3️⃣ Setting up Student Authentication...');
  const studentEmail = `student.phase5.${Date.now()}@msnacademy.pk`;
  const studentPassword = 'Password@123';

  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Muhammad Daniyal',
      email: studentEmail,
      password: studentPassword,
      confirmPassword: studentPassword,
      phoneNumber: '+923004455667',
    }),
  });
  assert.strictEqual(regRes.status, 201);

  const studentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: studentEmail, password: studentPassword }),
  });
  assert.strictEqual(studentLogin.status, 200);
  const studentToken = extractAccessToken(studentLogin.headers);
  assert.ok(studentToken, 'Student access token must be present');
  const studentHeaders = { Authorization: `Bearer ${studentToken}` };
  console.log(`   ✅ Student authenticated: [Muhammad Daniyal] (${studentEmail}).\n`);

  // 4. Test Unenrolled Access Gate (403 Forbidden)
  console.log('4️⃣ Testing Pre-Enrollment Eligibility Gate...');
  const unenrolledBriefing = await request(`/assessments/${targetCourse.id}/briefing`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(unenrolledBriefing.status, 403, 'Unenrolled student must be rejected with 403');
  console.log('   ✅ 403 Forbidden strictly enforced: Unenrolled student blocked from exam briefing.\n');

  // 5. Commercial Enrollment & Admin Fulfillment
  console.log('5️⃣ Provisioning Enrollment via Commercial Order...');
  await request('/cart/items', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ courseId: targetCourse.id }),
  });

  const checkoutRes = await request('/orders/checkout', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      paymentMethod: 'BANK_TRANSFER',
      billingInfo: { firstName: 'Muhammad', lastName: 'Daniyal', email: studentEmail },
    }),
  });
  assert.strictEqual(checkoutRes.status, 201);
  const orderId = checkoutRes.data.data.order.id;

  const paymentRes = await request('/payments/create', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ orderId }),
  });
  assert.strictEqual(paymentRes.status, 201);
  const paymentId = paymentRes.data.data.paymentId;

  await request(`/payments/${paymentId}/verify`, {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ transactionReference: 'TID-EXAM-PROV-9988' }),
  });

  // Admin Approval
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@msnacademy.pk', password: 'Pakistan@12345' }),
  });
  assert.strictEqual(adminLogin.status, 200);
  const adminToken = extractAccessToken(adminLogin.headers);
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  const approvalRes = await request(`/payments/${paymentId}/admin-review`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'APPROVED', verificationNotes: 'Phase 5 auto-enrollment approved' }),
  });
  assert.strictEqual(approvalRes.status, 200);
  console.log(`   ✅ Order [${orderId}] approved & active enrollment provisioned.\n`);

  // 6. Test Partial Completion Gate (403 Forbidden when progress < 100%)
  console.log('6️⃣ Testing Partial Course Completion Gate (progress < 100%)...');
  const partialBriefing = await request(`/assessments/${targetCourse.id}/briefing`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(partialBriefing.status, 403, 'Enrolled student with 0% progress must receive 403');
  console.log('   ✅ 403 Forbidden strictly enforced: Cannot take assessment before completing all lessons.\n');

  // 7. Complete Course Curriculum (Bring progress to 100%)
  console.log('7️⃣ Completing all course lectures to unlock examination...');
  const overviewRes = await request(`/learning/${targetCourse.id}/overview`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(overviewRes.status, 200);
  const modules = overviewRes.data.data.modules;

  for (const mod of modules) {
    for (const lec of mod.lectures) {
      if (!lec.isCompleted) {
        await request(`/learning/${targetCourse.id}/lessons/${lec.id}/complete`, {
          method: 'POST',
          headers: studentHeaders,
        });
      }
    }
  }

  const progressRes = await request(`/learning/${targetCourse.id}/progress`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(progressRes.status, 200);
  assert.strictEqual(progressRes.data.data.progressPercentage, 100);
  assert.strictEqual(progressRes.data.data.canTakeAssessment, true);
  console.log('   ✅ All lectures completed! Progress: 100%, canTakeAssessment: true.\n');

  // 8. Test Assessment Briefing (GET /api/v1/assessments/:courseId/briefing)
  console.log('8️⃣ Testing Assessment Briefing (GET /assessments/:courseId/briefing)...');
  const briefingRes = await request(`/assessments/${targetCourse.id}/briefing`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(briefingRes.status, 200);
  const briefing = briefingRes.data.data;
  assert.strictEqual(briefing.timeLimitMinutes, 120, 'Time limit must be 120 minutes');
  assert.strictEqual(briefing.passingPercentage, 70, 'Passing threshold must be 70%');
  assert.strictEqual(briefing.canAttempt, true);
  assert.ok(briefing.totalQuestions >= 10, 'Question bank must have at least 10 questions');
  console.log(`   ✅ Briefing Loaded: "${briefing.courseTitle}" (${briefing.totalQuestions} MCQs, ${briefing.timeLimitMinutes} min, ${briefing.passingPercentage}% to pass).\n`);

  // 9. Test Assessment Start & Secret Key Security (POST /api/v1/assessments/:courseId/start)
  console.log('9️⃣ Testing Assessment Session Start & Secret Key Security...');
  const startRes = await request(`/assessments/${targetCourse.id}/start`, {
    method: 'POST',
    headers: studentHeaders,
  });
  assert.strictEqual(startRes.status, 201);
  const session = startRes.data.data;
  assert.ok(session.attemptId, 'Attempt ID must be returned');
  assert.strictEqual(session.timeLimitMinutes, 120);
  assert.ok(session.expiresAt, 'Server-anchored expiresAt must be returned');
  assert.strictEqual(session.questions.length, briefing.totalQuestions);

  // CRITICAL SECURITY ASSERTION: Secret correctOptionKey must NEVER be sent to client
  for (const q of session.questions) {
    assert.strictEqual(
      (q as any).correctOptionKey,
      undefined,
      'SECURITY BREACH: correctOptionKey leaked in startAssessment payload!'
    );
    assert.strictEqual(q.options.length, 4, 'Each question must project exactly 4 options');
  }
  console.log('   ✅ Exam started. 120-minute countdown timer running.');
  console.log('   🔒 SECURITY VERIFIED: Zero answer keys leaked in client network projection.\n');

  const attemptId = session.attemptId;

  // 10. Test Answering Questions & Flagging (POST /api/v1/assessments/:attemptId/answer)
  console.log('🔟 Testing MCQ Answer Submission & Flagging...');
  // Answer question 1: 'B'
  const ans1 = await request(`/assessments/${attemptId}/answer`, {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      questionId: session.questions[0].questionId,
      selectedOptionKey: 'B',
      isFlagged: false,
    }),
  });
  assert.strictEqual(ans1.status, 200);
  assert.strictEqual(ans1.data.data.selectedOptionKey, 'B');

  // Answer question 2 with Flag for review: 'A'
  const ans2 = await request(`/assessments/${attemptId}/answer`, {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      questionId: session.questions[1].questionId,
      selectedOptionKey: 'A',
      isFlagged: true,
    }),
  });
  assert.strictEqual(ans2.status, 200);
  assert.strictEqual(ans2.data.data.isFlagged, true);

  // Answer questions 3 to 10 (80% score setup)
  const answerPattern: ('A' | 'B' | 'C' | 'D')[] = ['C', 'B', 'B', 'A', 'B', 'B', 'C', 'A'];
  for (let i = 2; i < session.questions.length; i++) {
    const key = answerPattern[i - 2] || 'A';
    await request(`/assessments/${attemptId}/answer`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        questionId: session.questions[i].questionId,
        selectedOptionKey: key,
      }),
    });
  }
  console.log('   ✅ Recorded answers for all questions. Flagged Question 2 for review.\n');

  // 11. Test Pre-Submission Review (GET /api/v1/assessments/:attemptId/review)
  console.log('1️⃣1️⃣ Testing Pre-Submission Review (GET /assessments/:attemptId/review)...');
  const reviewRes = await request(`/assessments/${attemptId}/review`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(reviewRes.status, 200);
  const review = reviewRes.data.data;
  assert.ok(review.remainingSeconds > 0, 'Remaining seconds must be positive');
  assert.strictEqual(review.answeredCount, session.questions.length);
  assert.strictEqual(review.unansweredCount, 0);
  assert.strictEqual(review.flaggedCount, 1);
  console.log(`   ✅ Review Summary: ${review.answeredCount} answered, ${review.flaggedCount} flagged, ${review.remainingSeconds}s remaining.\n`);

  // 12. Test Server-Side Grading & Submission (POST /api/v1/assessments/:attemptId/submit)
  console.log('1️⃣2️⃣ Testing Server-Side Evaluation & Certificate Issuance...');
  const submitRes = await request(`/assessments/${attemptId}/submit`, {
    method: 'POST',
    headers: studentHeaders,
  });
  assert.strictEqual(submitRes.status, 200);
  const result = submitRes.data.data;
  assert.strictEqual(result.isPassed, true, 'Student should pass assessment');
  assert.ok(result.scorePercentage >= 70, `Score (${result.scorePercentage}%) must meet 70% threshold`);
  assert.ok(result.certificateId, 'Official certificate ID must be generated upon passing');
  console.log(`   🏆 Passed Exam! Score: ${result.scorePercentage}% (Correct: ${result.correctAnswersCount}/${result.totalQuestions})`);
  console.log(`   📜 Certificate Granted: [ID: ${result.certificateId}]\n`);

  const certificateId = result.certificateId;

  // 13. Test Attempt Result View (GET /api/v1/assessments/:attemptId/result)
  console.log('1️⃣3️⃣ Testing Assessment Result Endpoint (GET /assessments/:attemptId/result)...');
  const resultView = await request(`/assessments/${attemptId}/result`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(resultView.status, 200);
  assert.strictEqual(resultView.data.data.isPassed, true);
  assert.strictEqual(resultView.data.data.certificateId, certificateId);
  console.log('   ✅ Candidate Result View retrieved successfully.\n');

  // 14. Test Student Certificate Retrieval & Download (GET /api/v1/certificates/:id)
  console.log('1️⃣4️⃣ Testing Student Certificate Retrieval & Download Links...');
  const certRes = await request(`/certificates/${certificateId}`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(certRes.status, 200);
  const certData = certRes.data.data;
  assert.strictEqual(certData.studentName, 'Muhammad Daniyal');
  assert.ok(certData.certificateNumber.startsWith('MSN-'), 'Certificate number must start with MSN-');
  assert.ok(certData.verificationUrl.includes('/verify/'));
  console.log(`   ✅ Certificate Verified: [${certData.certificateNumber}] issued to "${certData.studentName}" for "${certData.courseTitle}"`);

  const downloadRes = await request(`/certificates/${certificateId}/download`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(downloadRes.status, 200);
  assert.ok(downloadRes.data.data.downloadUrl.includes('.pdf'));
  assert.strictEqual(downloadRes.data.data.expiresInSeconds, 300);
  console.log('   ✅ PDF Download Link generated with 300s expiration.\n');

  // 15. Test Public Unauthenticated Verification (GET /api/v1/certificates/verify/:certificateNumber)
  console.log('1️⃣5️⃣ Testing Public Unauthenticated Verification (ZERO AUTH HEADERS)...');
  const publicVerify = await request(`/certificates/verify/${certData.certificateNumber}`);
  assert.strictEqual(publicVerify.status, 200);
  assert.strictEqual(publicVerify.data.data.isValid, true);
  assert.strictEqual(publicVerify.data.data.certificateNumber, certData.certificateNumber);
  assert.strictEqual(publicVerify.data.data.studentName, 'Muhammad Daniyal');
  assert.strictEqual(publicVerify.data.data.status, 'ACTIVE');
  console.log(`   🌐 Public Verification SUCCESS: [${certData.certificateNumber}] is valid and active.`);

  // 16. Test Invalid Certificate Verification (404 Not Found)
  console.log('1️⃣6️⃣ Testing Verification with Invalid Certificate Code...');
  const invalidVerify = await request('/certificates/verify/MSN-9999-99999');
  assert.strictEqual(invalidVerify.status, 404);
  console.log('   ✅ 404 Not Found cleanly returned for invalid certificate query.\n');

  console.log('========================================================================');
  console.log('🎉 ALL 16 PHASE 5 INTEGRATION TESTS PASSED WITH 100% ACCURACY & FIDELITY!');
  console.log('========================================================================\n');
}

runVerification().catch((error) => {
  console.error('❌ Phase 5 Verification FAILED:', error);
  process.exit(1);
});
