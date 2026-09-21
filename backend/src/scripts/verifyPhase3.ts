import assert from 'assert';
import crypto from 'crypto';

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
  const setCookies = (resHeaders as any).getSetCookie ? (resHeaders as any).getSetCookie() : [resHeaders.get('set-cookie') || ''];
  for (const cookie of setCookies) {
    const match = cookie.match(/access_token=([^;]+)/);
    if (match) {
      return match[1];
    }
  }
  return '';
}

async function runVerification() {
  console.log('🧪 Starting Phase 3 (Commerce, Hybrid Cart & Pakistani Payments) Verification...\n');

  // 1. Health check
  console.log('1️⃣ Checking API Health...');
  const health = await request('/health');
  assert.strictEqual(health.status, 200, 'Health check should return 200');
  console.log('   ✅ Health endpoint is UP and healthy.\n');

  // 2. Fetch courses to get valid courseId
  console.log('2️⃣ Fetching vocational courses for cart testing...');
  const coursesRes = await request('/courses?limit=2');
  assert.strictEqual(coursesRes.status, 200);
  const courses = Array.isArray(coursesRes.data.data) ? coursesRes.data.data : coursesRes.data.data.items;
  assert.ok(courses && courses.length >= 1, 'At least 1 course must exist in database');
  const testCourse = courses[0];
  console.log(`   ✅ Selected Course: "${testCourse.title}" (PKR ${testCourse.price}, ID: ${testCourse.id})\n`);

  // 3. Guest Cart Flow
  console.log('3️⃣ Testing Guest Cart Flow (Dual Hybrid Identification)...');
  const guestSessionId = crypto.randomUUID();
  const guestHeaders = { 'x-guest-session-id': guestSessionId };

  // Add item to guest cart
  const addGuestItem = await request('/cart/items', {
    method: 'POST',
    headers: guestHeaders,
    body: JSON.stringify({ courseId: testCourse.id }),
  });
  assert.strictEqual(addGuestItem.status, 200, 'Add guest cart item should return 200');
  assert.strictEqual(addGuestItem.data.data.totalItems, 1);
  console.log('   ✅ Added item to Guest Cart with UUID session.');

  // Apply promo code MSN10 (10% off)
  const applyPromo = await request('/cart/promo', {
    method: 'POST',
    headers: guestHeaders,
    body: JSON.stringify({ code: 'MSN10' }),
  });
  assert.strictEqual(applyPromo.status, 200, 'Apply promo should return 200');
  assert.strictEqual(applyPromo.data.data.code, 'MSN10');
  assert.strictEqual(applyPromo.data.data.discountPercentage, 10);
  const expectedDiscount = Math.round(testCourse.price * 0.1);
  assert.strictEqual(applyPromo.data.data.discountAmount, expectedDiscount);
  assert.strictEqual(applyPromo.data.data.newTotal, testCourse.price - expectedDiscount);
  console.log(`   ✅ Promo [MSN10] applied successfully: -PKR ${expectedDiscount} (New Total: PKR ${applyPromo.data.data.newTotal})`);

  // Retrieve guest cart
  const getGuestCart = await request('/cart', {
    method: 'GET',
    headers: guestHeaders,
  });
  assert.strictEqual(getGuestCart.status, 200);
  assert.strictEqual(getGuestCart.data.data.items.length, 1);
  console.log('   ✅ Guest Cart successfully retrieved via x-guest-session-id header.');

  // Remove item from guest cart
  const removeGuestItem = await request(`/cart/items/${testCourse.id}`, {
    method: 'DELETE',
    headers: guestHeaders,
  });
  assert.strictEqual(removeGuestItem.status, 200);
  assert.strictEqual(removeGuestItem.data.data.totalItems, 0);
  assert.strictEqual(removeGuestItem.data.data.total, 0);
  console.log('   ✅ Removed item from guest cart. Cart total reset to PKR 0.\n');

  // 4. Authenticated Student Account
  console.log('4️⃣ Setting up Student Authentication...');
  const studentEmail = 'student.phase3@msnacademy.pk';
  const studentPassword = 'Password@123';

  // Register or Login
  let studentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: studentEmail, password: studentPassword }),
  });

  if (studentLogin.status !== 200) {
    console.log('   Registering new test student...');
    const registerRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Hamza Khan',
        email: studentEmail,
        password: studentPassword,
        confirmPassword: studentPassword,
        phoneNumber: '+923001122334',
      }),
    });
    assert.strictEqual(registerRes.status, 201, 'Student registration should succeed');
    studentLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: studentEmail, password: studentPassword }),
    });
  }

  assert.strictEqual(studentLogin.status, 200, 'Student login should succeed');
  const studentToken = extractAccessToken(studentLogin.headers);
  assert.ok(studentToken, 'Student access token must be present in Set-Cookie');
  const studentHeaders = { Authorization: `Bearer ${studentToken}` };
  console.log('   ✅ Student authenticated. JWT AccessToken acquired from auth cookie.\n');

  // 5. Authenticated Cart Flow
  console.log('5️⃣ Testing Authenticated Cart Flow...');
  // Clear any existing cart items first
  await request(`/cart/items/${testCourse.id}`, { method: 'DELETE', headers: studentHeaders });

  // Add course to student cart
  const addStudentItem = await request('/cart/items', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ courseId: testCourse.id }),
  });
  assert.strictEqual(addStudentItem.status, 200);
  console.log(`   ✅ Added "${testCourse.title}" to student cart.`);

  // Apply LAUNCH20 (20% off)
  const applyLaunchPromo = await request('/cart/promo', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ code: 'LAUNCH20' }),
  });
  if (applyLaunchPromo.status !== 200) {
    console.error('applyLaunchPromo error details:', applyLaunchPromo.data);
  }
  assert.strictEqual(applyLaunchPromo.status, 200);
  assert.strictEqual(applyLaunchPromo.data.data.code, 'LAUNCH20');
  const discount20 = Math.round(testCourse.price * 0.2);
  const totalAfterDiscount = testCourse.price - discount20;
  assert.strictEqual(applyLaunchPromo.data.data.newTotal, totalAfterDiscount);
  console.log(`   ✅ Promo [LAUNCH20] applied: 20% off (-PKR ${discount20}), Final: PKR ${totalAfterDiscount}.\n`);

  // 6. Checkout Flow (Pakistani Payment Method: BANK_TRANSFER)
  console.log('6️⃣ Testing Order Checkout Flow (BANK_TRANSFER)...');
  const checkoutRes = await request('/orders/checkout', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      paymentMethod: 'BANK_TRANSFER',
      notes: 'Please activate quickly upon Meezan IBAN verification',
      billingInfo: {
        firstName: 'Hamza',
        lastName: 'Khan',
        email: studentEmail,
        phoneNumber: '+923001122334',
      },
    }),
  });

  assert.strictEqual(checkoutRes.status, 201, 'Checkout should return 201 Created');
  const checkoutData = checkoutRes.data.data;
  const order = checkoutData.order;
  assert.ok(order.orderNumber.startsWith('MSN-ORD-'), 'Order number must start with MSN-ORD-');
  assert.strictEqual(order.status, 'PENDING');
  assert.strictEqual(order.totalAmount, totalAfterDiscount);
  assert.strictEqual(order.paymentMethod, 'BANK_TRANSFER');
  assert.strictEqual(order.items[0].title, testCourse.title);

  // Validate Meezan Bank Details
  const bankDetails = checkoutData.paymentDetails;
  assert.strictEqual(bankDetails.method, 'BANK_TRANSFER');
  assert.ok(bankDetails.iban.startsWith('PK'), 'Meezan Bank IBAN must start with PK');
  console.log(`   ✅ Order Created: [${order.orderNumber}] (ID: ${order.id})`);
  console.log(`   ✅ Bank Details: ${bankDetails.bankName} | IBAN: ${bankDetails.iban}`);

  // Verify Cart is emptied after checkout
  const cartAfterCheckout = await request('/cart', {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(cartAfterCheckout.data.data.items.length, 0, 'Cart must be cleared after checkout');
  console.log('   ✅ Cart successfully cleared after checkout.\n');

  // 7. Payment Initialization & Proof Submission
  console.log('7️⃣ Testing Payment Generation & Proof Submission...');
  const createPaymentRes = await request('/payments/create', {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({ orderId: order.id }),
  });
  assert.strictEqual(createPaymentRes.status, 201);
  const paymentId = createPaymentRes.data.data.paymentId;
  assert.strictEqual(createPaymentRes.data.data.amount, totalAfterDiscount);
  console.log(`   ✅ Payment Record Verified (ID: ${paymentId})`);

  // Submit payment proof (TID + Screenshot)
  const tid = 'FT-MEEZAN-99882233';
  const screenshot = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c';
  const verifyRes = await request(`/payments/${paymentId}/verify`, {
    method: 'POST',
    headers: studentHeaders,
    body: JSON.stringify({
      transactionReference: tid,
      receiptScreenshotUrl: screenshot,
    }),
  });
  assert.strictEqual(verifyRes.status, 200);
  assert.strictEqual(verifyRes.data.data.status, 'UNDER_REVIEW');
  console.log(`   ✅ Proof submitted with TID [${tid}]. Payment status moved to UNDER_REVIEW.`);

  // Check Payment Status via GET
  const paymentStatusRes = await request(`/payments/${paymentId}`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(paymentStatusRes.status, 200);
  assert.strictEqual(paymentStatusRes.data.data.status, 'UNDER_REVIEW');
  assert.strictEqual(paymentStatusRes.data.data.transactionReference, tid);
  console.log('   ✅ GET /api/v1/payments/:id reflects UNDER_REVIEW with TID.\n');

  // 8. Admin Audit & Manual Settlement Flow
  console.log('8️⃣ Testing Admin Settlement Audit Flow...');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@msnacademy.pk',
      password: 'Pakistan@12345',
    }),
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login must succeed');
  assert.strictEqual(adminLogin.data.data.user.role, 'ADMIN');
  const adminToken = extractAccessToken(adminLogin.headers);
  assert.ok(adminToken, 'Admin access token must be present in Set-Cookie');
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  console.log('   ✅ Super Admin authenticated (Role: ADMIN).');

  // Admin approves payment
  const auditRes = await request(`/payments/${paymentId}/admin-review`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      status: 'APPROVED',
      verificationNotes: 'Meezan Bank statement verified: PKR credited at 10:15 AM.',
    }),
  });
  assert.strictEqual(auditRes.status, 200);
  assert.strictEqual(auditRes.data.data.status, 'APPROVED');
  assert.strictEqual(auditRes.data.data.verificationNotes, 'Meezan Bank statement verified: PKR credited at 10:15 AM.');
  console.log('   ✅ Admin approved payment. Verification notes persisted.');

  // 9. Verify Order Transition to COMPLETED
  console.log('9️⃣ Verifying Order Status Auto-Sync to COMPLETED...');
  const getOrderRes = await request(`/orders/${order.id}`, {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(getOrderRes.status, 200);
  assert.strictEqual(getOrderRes.data.data.status, 'COMPLETED', 'Order status must transition to COMPLETED upon payment approval');
  console.log(`   ✅ Order [${order.orderNumber}] automatically transitioned to COMPLETED!`);

  // 10. Student Order History
  console.log('🔟 Verifying Student Order History (GET /api/v1/orders/my-orders)...');
  const myOrdersRes = await request('/orders/my-orders?page=1&limit=5', {
    method: 'GET',
    headers: studentHeaders,
  });
  assert.strictEqual(myOrdersRes.status, 200);
  const myOrdersList = Array.isArray(myOrdersRes.data.data) ? myOrdersRes.data.data : myOrdersRes.data.data.orders;
  const foundOrder = myOrdersList.find((o: any) => o.id === order.id);
  assert.ok(foundOrder, 'Recently completed order must be present in student order history');
  assert.strictEqual(foundOrder.status, 'COMPLETED');
  const totalCount = myOrdersRes.data.meta?.total || myOrdersList.length;
  console.log(`   ✅ Order history successfully retrieved (${totalCount} orders total).\n`);

  console.log('===============================================================');
  console.log('🎉 ALL 10 PHASE 3 INTEGRATION TESTS PASSED WITH 100% ACCURACY!');
  console.log('===============================================================');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Phase 3 Verification FAILED:', err);
  process.exit(1);
});
