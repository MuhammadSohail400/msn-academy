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

async function runAdminVerification() {
  console.log('🧪 Starting Phase 1 Admin REST Endpoints Automated Verification...\n');

  // 1. Health check
  console.log('1️⃣ Checking API Health...');
  const health = await request('/health');
  assert.strictEqual(health.status, 200, 'Health check should return 200');
  console.log('   ✅ Health endpoint is UP and healthy.\n');

  // 2. Student RBAC Deny Test
  console.log('2️⃣ Testing RBAC Security Guard: Student Access Denied...');
  const studentEmail = `teststudent_${Date.now()}@example.com`;
  const registerRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Regular Student',
      email: studentEmail,
      password: 'Password@123',
      phoneNumber: '+923009999999',
    }),
  });
  assert.strictEqual(registerRes.status, 201, 'Student registration should succeed');
  const studentToken = extractAccessToken(registerRes.headers) || registerRes.data.data.accessToken;
  const studentHeaders = { Authorization: `Bearer ${studentToken}` };

  const denyStats = await request('/admin/stats', { headers: studentHeaders });
  assert.strictEqual(denyStats.status, 403, 'Student should be forbidden from accessing /admin/stats');
  console.log('   ✅ Verified: roleGuard("ADMIN") correctly denied student access with HTTP 403 Forbidden.\n');

  // 3. Super Admin Authentication
  console.log('3️⃣ Authenticating Super Admin...');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@msnacademy.pk',
      password: 'Pakistan@12345',
    }),
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login must succeed');
  assert.strictEqual(adminLogin.data.data.user.role, 'ADMIN', 'Role must be ADMIN');
  const adminToken = extractAccessToken(adminLogin.headers) || adminLogin.data.data.accessToken;
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  console.log('   ✅ Super Admin authenticated successfully (Role: ADMIN).\n');

  // 4. Test GET /admin/stats
  console.log('4️⃣ Testing GET /api/v1/admin/stats (Overview KPIs)...');
  const statsRes = await request('/admin/stats', { headers: adminHeaders });
  assert.strictEqual(statsRes.status, 200, 'Admin stats should return 200');
  const stats = statsRes.data.data;
  assert.ok(typeof stats.grossRevenuePKR === 'number', 'grossRevenuePKR must be a number');
  assert.ok(typeof stats.totalStudents === 'number', 'totalStudents must be a number');
  assert.ok(typeof stats.activeCourses === 'number', 'activeCourses must be a number');
  assert.ok(typeof stats.pendingPaymentReviews === 'number', 'pendingPaymentReviews must be a number');
  assert.ok(typeof stats.openInquiries === 'number', 'openInquiries must be a number');
  assert.ok(Array.isArray(stats.recentOrders), 'recentOrders must be an array');
  console.log(`   ✅ Live Metrics: Gross Revenue: PKR ${stats.grossRevenuePKR} | Students: ${stats.totalStudents} | Courses: ${stats.activeCourses} | Pending Reviews: ${stats.pendingPaymentReviews}`);
  console.log('   ✅ GET /admin/stats verified.\n');

  // 5. Test Course Management CRUD (POST, PUT, DELETE)
  console.log('5️⃣ Testing Admin Course Management (Create, Update, Delete)...');
  const testCourseSlug = `docker-k8s-mastery-${Date.now()}`;
  const createCourseRes = await request('/courses', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Docker & Kubernetes Cloud Engineering',
      slug: testCourseSlug,
      subtitle: 'Deploy scalable microservices with Docker and Kubernetes in production.',
      description: 'Master containerization, container orchestration, multi-stage Docker builds, Pod deployments, Helm charts, and continuous deployment.',
      category: 'Web Development',
      level: 'Advanced',
      price: 9500,
      originalPrice: 14000,
      durationHours: 35,
      totalLectures: 40,
      status: 'PUBLISHED',
    }),
  });
  assert.strictEqual(createCourseRes.status, 201, 'Course creation should return 201');
  const createdCourse = createCourseRes.data.data;
  const courseId = createdCourse._id || createdCourse.id;
  console.log(`   ✅ Created course [${createdCourse.title}] with ID: ${courseId}`);

  // Update course
  const updateCourseRes = await request(`/courses/${courseId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      price: 11000,
      badge: 'Bestseller',
    }),
  });
  assert.strictEqual(updateCourseRes.status, 200, 'Course update should return 200');
  assert.strictEqual(updateCourseRes.data.data.price, 11000, 'Updated price should be 11000');
  console.log('   ✅ Updated course price to PKR 11,000 and set badge to Bestseller.');

  // Delete course
  const deleteCourseRes = await request(`/courses/${courseId}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  assert.strictEqual(deleteCourseRes.status, 200, 'Course deletion should return 200');
  console.log('   ✅ Soft-deleted test course.\n');

  // 6. Test GET /payments/admin/all
  console.log('6️⃣ Testing GET /api/v1/payments/admin/all (Verification Desk)...');
  const paymentsRes = await request('/payments/admin/all', { headers: adminHeaders });
  assert.strictEqual(paymentsRes.status, 200, 'Payments list should return 200');
  assert.ok(Array.isArray(paymentsRes.data.data.payments), 'Payments should be an array');
  console.log(`   ✅ Retrieved ${paymentsRes.data.data.payments.length} payment records in desk.\n`);

  // 7. Test GET /orders/admin/all
  console.log('7️⃣ Testing GET /api/v1/orders/admin/all (Orders Ledger)...');
  const ordersRes = await request('/orders/admin/all', { headers: adminHeaders });
  assert.strictEqual(ordersRes.status, 200, 'Orders list should return 200');
  assert.ok(Array.isArray(ordersRes.data.data), 'Orders should be an array');
  console.log(`   ✅ Retrieved ${ordersRes.data.data.length} commercial orders in master ledger.\n`);

  // 8. Test GET /admin/users
  console.log('8️⃣ Testing GET /api/v1/admin/users (Users Directory)...');
  const usersRes = await request('/admin/users', { headers: adminHeaders });
  assert.strictEqual(usersRes.status, 200, 'Users directory should return 200');
  assert.ok(Array.isArray(usersRes.data.data), 'Users should be an array');
  console.log(`   ✅ Retrieved ${usersRes.data.data.length} registered students & administrators in directory.\n`);

  // 9. Test GET /inquiries/admin/all
  console.log('9️⃣ Testing GET /api/v1/contact/admin/all (Contact Leads CRM)...');
  const inquiriesRes = await request('/contact/admin/all', { headers: adminHeaders });
  assert.strictEqual(inquiriesRes.status, 200, 'Inquiries list should return 200');
  assert.ok(Array.isArray(inquiriesRes.data.data), 'Inquiries should be an array');
  console.log(`   ✅ Retrieved ${inquiriesRes.data.data.length} contact inquiry leads.\n`);

  console.log('========================================================================');
  console.log('🎉 ALL PHASE 1 ADMIN BACKEND REST APIS VERIFIED AND PASSING 100%!');
  console.log('========================================================================\n');
}

runAdminVerification().catch((err) => {
  console.error('\n❌ Phase 1 Admin Verification FAILED:\n', err);
  process.exit(1);
});
