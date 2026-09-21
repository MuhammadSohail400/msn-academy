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
  console.log('🧪 Starting Phase 4 (Enrollments, Learning Hub & LMS Player Context) Verification...\n');

  // 1. Health check
  console.log('1️⃣ Checking API Health...');
  const health = await request('/health');
  assert.strictEqual(health.status, 200, 'Health check should return 200');
  console.log('   ✅ Health endpoint is UP and healthy.\n');

  // 2. Fetch courses
  console.log('2️⃣ Fetching courses from master catalog...');
  const coursesRes = await request('/courses?limit=5');
  assert.strictEqual(coursesRes.status, 200);
  const courses = Array.isArray(coursesRes.data.data) ? coursesRes.data.data : coursesRes.data.data.items;
  assert.ok(courses && courses.length >= 2, 'Need at least 2 courses in catalog');
  const targetCourse = courses[0];
  const otherCourse = courses[1];
  console.log(`   ✅ Target Course for Enrollment: "${targetCourse.title}" (ID: ${targetCourse.id})`);
  console.log(`   ✅ Unenrolled Benchmark Course: "${otherCourse.title}" (ID: ${otherCourse.id})\n`);

  // 3. Student Setup & Authentication
  console.log('3️⃣ Setting up Student Authentication...');
  const studentEmail = `student.phase4.${Date.now()}@msnacademy.pk`;
  const studentPassword = 'Password@123';

  let studentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: studentEmail, password: studentPassword }),
  });

  if (studentLogin.status !== 200) {
    console.log('   Registering test student for Phase 4...');
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Bilal Farooq',
        email: studentEmail,
        password: studentPassword,
        confirmPassword: studentPassword,
        phoneNumber: '+923009988776',
      }),
    });
    assert.strictEqual(regRes.status, 201);
    studentLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: studentEmail, password: studentPassword }),
    });
  }

  assert.strictEqual(studentLogin.status, 200);
  const studentToken = extractAccessToken(studentLogin.headers);
  assert.ok(studentToken, 'Student access token must be in Set-Cookie header');
  const studentHeaders = { Authorization: `Bearer ${studentToken}` };
  console.log('   ✅ Student authenticated. Bearer token acquired.\n');

  // 4. Commercial Order & Auto-Enrollment Provisioning Flow
  console.log('4️⃣ Testing Commercial Fulfillment & Auto-Enrollment Trigger...');
  // Clear cart and add course
  await request(`/cart/items/${targetCourse.id}`, { method: 'DELETE', headers: studentHeaders });
  await request('/cart/items', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ courseId: targetCourse.id }),
  });

  // Checkout order
  const checkoutRes = await request('/orders/checkout', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      paymentMethod: 'BANK_TRANSFER',
      billingInfo: { firstName: 'Bilal', lastName: 'Farooq', email: studentEmail },
    }),
  });
  assert.strictEqual(checkoutRes.status, 201);
  const orderId = checkoutRes.data.data.order.id;

  // Initialize & verify payment
  const paymentRes = await request('/payments/create', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ orderId }),
  });
  const paymentId = paymentRes.data.data.paymentId;

  await request(`/payments/${paymentId}/verify`, {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ transactionReference: 'TID-ENROLL-PROV-1122' }),
  });

  // Admin approves payment ➔ triggers automatic Enrollment provisioning!
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@msnacademy.pk', password: 'Pakistan@12345' }),
  });
  const adminToken = extractAccessToken(adminLogin.headers);
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  const approvalRes = await request(`/payments/${paymentId}/admin-review`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'APPROVED', verificationNotes: 'Auto-provisioning test approved' }),
  });
  assert.strictEqual(approvalRes.status, 200);
  console.log(`   ✅ Payment approved by Admin. Order [${orderId}] completed & enrollment auto-provisioned.\n`);

  // 5. Student Enrollments List (GET /api/v1/student/enrollments)
  console.log('5️⃣ Testing Student Enrolled Courses (GET /api/v1/student/enrollments)...');
  const myEnrollmentsRes = await request('/student/enrollments?status=ALL&page=1&limit=10', {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(myEnrollmentsRes.status, 200);
  const enrollmentsList = myEnrollmentsRes.data.data;
  assert.ok(Array.isArray(enrollmentsList), 'Enrollments response data must be an array');
  const targetEnrollment = enrollmentsList.find((e: any) => e.courseId === targetCourse.id);
  assert.ok(targetEnrollment, 'Newly provisioned course must exist in student enrollments');
  assert.strictEqual(targetEnrollment.title, targetCourse.title);
  assert.strictEqual(targetEnrollment.progressPercentage, 0, 'Initial course progress must be 0%');
  assert.strictEqual(targetEnrollment.isCompleted, false);
  assert.ok(targetEnrollment.lastAccessedLesson, 'Default lastAccessedLesson must be populated');
  console.log(`   ✅ Enrollment Verified: [${targetEnrollment.title}] (ID: ${targetEnrollment.enrollmentId})`);
  console.log(`   ✅ Next up: "${targetEnrollment.lastAccessedLesson.title}" (ID: ${targetEnrollment.lastAccessedLesson.id})\n`);

  // 6. Student Dashboard Summary (GET /api/v1/student/dashboard-summary)
  console.log('6️⃣ Testing Student Dashboard Summary (GET /api/v1/student/dashboard-summary)...');
  const summaryRes = await request('/student/dashboard-summary', {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(summaryRes.status, 200);
  const summary = summaryRes.data.data;
  assert.ok(summary.enrolledCoursesCount >= 1, 'Enrolled courses count must be at least 1');
  assert.ok(summary.activeCoursesCount >= 1, 'Active courses count must be at least 1');
  assert.strictEqual(typeof summary.completedCoursesCount, 'number');
  assert.strictEqual(typeof summary.certificatesEarnedCount, 'number');
  assert.ok(Array.isArray(summary.recentActivity), 'recentActivity must be an array');
  console.log(`   ✅ Dashboard KPIs: ${summary.enrolledCoursesCount} Enrolled, ${summary.activeCoursesCount} Active.`);
  console.log(`   ✅ Recent Activity contains: "${summary.recentActivity[0]?.courseTitle}"\n`);

  // 7. Security: Unenrolled Course Access Guard
  console.log('7️⃣ Testing Authorization Guard for Unenrolled Course...');
  const unenrolledAccess = await request(`/learning/${otherCourse.id}/overview`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(unenrolledAccess.status, 403, 'Unenrolled student access to course must return 403 Forbidden');
  assert.strictEqual(unenrolledAccess.data.message, 'Access denied. Active enrollment required.');
  console.log('   ✅ 403 Forbidden enforced strictly for unenrolled course access.\n');

  // 8. Enrolled Course Overview (GET /api/v1/learning/:courseId/overview)
  console.log('8️⃣ Testing Enrolled Course Overview Hub (GET /api/v1/learning/:courseId/overview)...');
  const overviewRes = await request(`/learning/${targetCourse.id}/overview`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(overviewRes.status, 200);
  const overview = overviewRes.data.data;
  assert.strictEqual(overview.courseId, targetCourse.id);
  assert.strictEqual(overview.canTakeAssessment, false, 'Assessment must be locked initially');
  assert.ok(Array.isArray(overview.modules), 'Modules must be an array');
  assert.ok(overview.modules.length > 0, 'Course must contain modules');

  // Collect all lectures for testing
  const allLectures: Array<{ id: string; title: string; isCompleted: boolean }> = [];
  for (const mod of overview.modules) {
    for (const lec of mod.lectures) {
      allLectures.push(lec);
    }
  }
  assert.ok(allLectures.length > 0, 'Course must have lectures');
  const firstLecture = allLectures[0];
  console.log(`   ✅ Curriculum loaded: ${overview.modules.length} modules, ${allLectures.length} total lectures.`);
  console.log(`   ✅ Initial Lecture 1: "${firstLecture.title}" (Completed: ${firstLecture.isCompleted})\n`);

  // 9. Lesson Video Player Context (GET /api/v1/learning/:courseId/lessons/:lessonId)
  console.log('9️⃣ Testing LMS Lesson Player Streaming Context...');
  const lessonRes = await request(`/learning/${targetCourse.id}/lessons/${firstLecture.id}`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(lessonRes.status, 200);
  const lessonData = lessonRes.data.data;
  assert.strictEqual(lessonData.lessonId, firstLecture.id);
  assert.strictEqual(lessonData.title, firstLecture.title);
  assert.ok(lessonData.videoStreamUrl, 'Must return videoStreamUrl');
  assert.ok(lessonData.videoStreamUrl.includes('token='), 'Streaming URL must be protected with expiring token');
  assert.strictEqual(lessonData.isCompleted, false);
  if (allLectures.length > 1) {
    assert.strictEqual(lessonData.nextLessonId, allLectures[1].id, 'Next lesson ID must match subsequent lecture');
  }
  console.log(`   ✅ Video Player Context Verified for Lesson: "${lessonData.title}"`);
  console.log(`   ✅ Secure Streaming URL: ${lessonData.videoStreamUrl.slice(0, 55)}...`);
  console.log(`   ✅ Navigation Next: ${lessonData.nextLessonId}\n`);

  // 10. Atomic Lesson Completion (POST /api/v1/learning/:courseId/lessons/:lessonId/complete)
  console.log('🔟 Testing Atomic Lesson Progress Completion...');
  const completeRes = await request(`/learning/${targetCourse.id}/lessons/${firstLecture.id}/complete`, {
    method: 'POST',
    headers: studentHeaders,
  });
  assert.strictEqual(completeRes.status, 200);
  const completeData = completeRes.data.data;
  assert.strictEqual(completeData.lessonId, firstLecture.id);
  assert.strictEqual(completeData.completedLecturesCount, 1);
  assert.ok(completeData.progressPercentage > 0, 'Progress percentage must be greater than 0');
  console.log(`   ✅ Marked Lesson 1 Complete! Progress: ${completeData.progressPercentage}% (${completeData.completedLecturesCount}/${completeData.totalLectures} lectures).\n`);

  // 11. Granular Progress Polling (GET /api/v1/learning/:courseId/progress)
  console.log('1️⃣1️⃣ Testing Course Progress Polling (GET /api/v1/learning/:courseId/progress)...');
  const progressRes = await request(`/learning/${targetCourse.id}/progress`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(progressRes.status, 200);
  const progressData = progressRes.data.data;
  assert.strictEqual(progressData.completedLecturesCount, 1);
  assert.ok(progressData.completedLessonIds.includes(firstLecture.id), 'completedLessonIds must contain firstLecture.id');
  console.log('   ✅ Progress telemetry confirmed via polling endpoint.\n');

  // 12. 100% Completion & Assessment Unlock Journey
  console.log('1️⃣2️⃣ Testing 100% Completion Journey & Final Assessment Unlock...');
  for (let i = 1; i < allLectures.length; i++) {
    const lec = allLectures[i];
    await request(`/learning/${targetCourse.id}/lessons/${lec.id}/complete`, {
      method: 'POST',
      headers: studentHeaders,
    });
  }

  // Final check on course overview
  const finalOverview = await request(`/learning/${targetCourse.id}/overview`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(finalOverview.status, 200);
  const finalData = finalOverview.data.data;
  assert.strictEqual(finalData.progressPercentage, 100, 'Course progress must be 100%');
  assert.strictEqual(finalData.completedLecturesCount, finalData.totalLectures);
  assert.strictEqual(finalData.canTakeAssessment, true, 'canTakeAssessment MUST unlock upon 100% lesson completion');
  console.log(`   ✅ All ${finalData.totalLectures} lectures completed! Overall Progress: 100%`);
  console.log(`   🏆 canTakeAssessment is now: ${finalData.canTakeAssessment} (Unlocked for Phase 5 Examination!)\n`);

  console.log('========================================================================');
  console.log('🎉 ALL 12 PHASE 4 INTEGRATION TESTS PASSED WITH 100% ACCURACY & FIDELITY!');
  console.log('========================================================================');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Phase 4 Verification FAILED:', err);
  process.exit(1);
});
