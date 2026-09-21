/**
 * MSN Academy — Complete Browser-Driven API QA Verification Engine
 * Source of Truth: docs/05-API-Specification.md (All 43 Documented Endpoints + Certificates Collection)
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const capturedNetwork = [];
const verificationSummary = {
  testedEndpoints: new Set(),
  passedEndpoints: [],
  failedEndpoints: [],
  networkRecords: [],
  browserErrors: [],
  uiDefects: [],
};

function recordNetwork(req, res, resBody) {
  const record = {
    id: capturedNetwork.length + 1,
    timestamp: new Date().toISOString(),
    method: req.method(),
    url: req.url(),
    headers: req.headers(),
    postData: req.postData() ? safeParse(req.postData()) : null,
    status: res ? res.status() : null,
    responseHeaders: res ? res.headers() : null,
    responseBody: resBody,
  };
  capturedNetwork.push(record);
  verificationSummary.networkRecords.push(record);
  return record;
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearAndType(page, selector, text) {
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, selector);
  await page.focus(selector);
  await page.type(selector, text, { delay: 25 });
}

async function runApiVerification() {
  console.log('================================================================');
  console.log('🚀 Starting MSN Academy Comprehensive Browser API Verification Suite');
  console.log('📖 Source of Truth: docs/05-API-Specification.md');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--window-size=1366,768'
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' || text.includes('Error:') || text.includes('Uncaught')) {
      verificationSummary.browserErrors.push({
        url: page.url(),
        type: msg.type(),
        text: text
      });
    }
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/v1/')) {
      const request = response.request();
      let resBody = null;
      try {
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('application/json') || ct.includes('text/')) {
          resBody = await response.json().catch(async () => {
            const txt = await response.text().catch(() => null);
            return txt;
          });
        } else {
          resBody = '[Binary/Blob data: ' + ct + ']';
        }
      } catch (e) {
        resBody = '[Unable to read body: ' + e.message + ']';
      }

      const rec = recordNetwork(request, response, resBody);
      console.log(`[NET] ${rec.method} ${rec.url} -> ${rec.status}`);
    }
  });

  try {
    // =============================================================
    // 1. PUBLIC MARKETING, DISCOVERY & CATALOG
    // =============================================================
    console.log('\n--- 1. Testing Discovery, Catalog & Marketing ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(800);

    // Catalog page with search
    await page.goto(`${BASE_URL}/courses`, { waitUntil: 'networkidle0' });
    await sleep(800);
    const searchSel = 'input[placeholder*="Search"]';
    if (await page.$(searchSel)) {
      await clearAndType(page, searchSel, 'Analytics');
      await sleep(1000);
    }

    // Open Course Details
    const courseCard = await page.$('a[href^="/courses/"]');
    let courseSlug = 'applied-data-analytics-power-bi';
    let courseId = '6aa6409465a4d4b52ff7668f';
    if (courseCard) {
      const href = await page.evaluate(el => el.getAttribute('href'), courseCard);
      courseSlug = href.replace('/courses/', '');
    }
    console.log(`Navigating to course details: /courses/${courseSlug}`);
    await page.goto(`${BASE_URL}/courses/${courseSlug}`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // Check Syllabus and Categories via browser client context
    await page.evaluate(async (cid) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.get(`/courses/${cid}/syllabus`).catch(() => null);
        await client.get('/categories').catch(() => null);
      } catch (e) {}
    }, courseId);
    await sleep(800);

    // Contact Us Form
    console.log('Submitting Contact Us form (/contact)...');
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle0' });
    await sleep(600);
    await clearAndType(page, 'input[name="fullName"]', 'Taimur Raza');
    await clearAndType(page, 'input[name="email"]', 'taimur.raza@example.com');
    await clearAndType(page, 'input[name="subject"]', 'Inquiry regarding corporate training programs');
    await clearAndType(page, 'textarea[name="message"]', 'Inquiry regarding corporate training programs and assessment schedules.');
    await page.click('button[type="submit"]');
    await sleep(1500);

    // Public Certificate Verification with valid format regex
    console.log('Testing Certificate Verification (/verify)...');
    await page.goto(`${BASE_URL}/verify`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const certInput = await page.$('input[placeholder*="cert" i], input[type="text"]');
    const certSubmit = await page.$('button[type="submit"], form button');
    if (certInput && certSubmit) {
      await certInput.type('MSN-2024-00142');
      await certSubmit.click();
      await sleep(1200);
    }

    // =============================================================
    // 2. GUEST CART OPERATIONS
    // =============================================================
    console.log('\n--- 2. Testing Cart Operations ---');
    await page.goto(`${BASE_URL}/courses/${courseSlug}`, { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Add to Cart') || b.innerText.includes('Enroll'));
      if (btn) btn.click();
    });
    await sleep(1200);

    // Open /cart
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle0' });
    await sleep(1000);

    // Apply promo code (POST /cart/promo)
    const promoInput = await page.$('input[placeholder*="promo" i], input[placeholder*="coupon" i], input[name="promoCode"]');
    if (promoInput) {
      await promoInput.type('MSN10');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Apply'));
        if (btn) btn.click();
      });
      await sleep(1000);
    }

    // Test Remove Item and Clear Cart in browser client
    await page.evaluate(async (cid) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.post('/cart/items', { courseId: cid }).catch(() => null);
        await client.delete(`/cart/items/${cid}`).catch(() => null);
        await client.delete('/cart').catch(() => null);
      } catch (e) {}
    }, courseId);
    await sleep(800);

    // =============================================================
    // 3. AUTHENTICATION (REGISTER, FORGOT, RESET, LOGIN, LOGOUT)
    // =============================================================
    console.log('\n--- 3. Testing Authentication Flows ---');

    // 3A. Register Flow with full valid form inputs
    const uniqueEmail = `qa.student.${Date.now()}@msnacademy.pk`;
    console.log(`Registering new student: ${uniqueEmail}`);
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
    await sleep(800);

    await clearAndType(page, '#register-first-name', 'Hassan');
    await clearAndType(page, '#register-last-name', 'Raza');
    await clearAndType(page, '#register-email', uniqueEmail);
    await clearAndType(page, '#register-phone', '+923001234567');
    await clearAndType(page, '#register-password', 'SecurePass@123');
    await clearAndType(page, '#register-confirm-password', 'SecurePass@123');
    await page.click('#register-agree-terms');
    await sleep(400);

    await page.click('button[type="submit"]');
    await sleep(2500);

    // 3B. Logout newly registered user (POST /auth/logout)
    console.log('Testing Logout flow (/auth/logout)...');
    await page.evaluate(async () => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.post('/auth/logout').catch(() => null);
      } catch (e) {}
    });
    await sleep(800);

    // 3C. Forgot Password
    console.log('Testing Forgot Password (/auth/forgot-password)...');
    await page.goto(`${BASE_URL}/forgot-password`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const forgotEmail = await page.$('input[type="email"]');
    if (forgotEmail) {
      await forgotEmail.type('student.phase3@msnacademy.pk');
      await page.click('button[type="submit"]');
      await sleep(1200);
    }

    // 3D. Reset Password
    console.log('Testing Reset Password (/auth/reset-password)...');
    const forgotRecord = capturedNetwork.find(n => n.url.includes('/auth/forgot-password') && n.method === 'POST');
    const resetToken = forgotRecord?.responseBody?.data?.debugResetToken || 'mock_test_token_1234567890';
    await page.goto(`${BASE_URL}/reset-password?token=${resetToken}`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const passInputs = await page.$$('input[type="password"]');
    if (passInputs.length >= 2) {
      await passInputs[0].type('Password@123');
      await passInputs[1].type('Password@123');
      await page.click('button[type="submit"]');
      await sleep(1200);
    }

    // 3E. Google OAuth Endpoint (/auth/oauth/google)
    console.log('Testing Google OAuth Endpoint (/auth/oauth/google)...');
    await page.evaluate(async () => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.post('/auth/oauth/google', { idToken: 'mock_google_id_token_xyz' }).catch(() => null);
      } catch (e) {}
    });
    await sleep(600);

    // 3F. Login with Invalid Credentials (Verify 401 response)
    console.log('Testing Invalid Login (/login)...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await sleep(600);
    await clearAndType(page, '#login-email', 'unregistered.user@msnacademy.pk');
    await clearAndType(page, '#login-password', 'WrongPassword@999');
    await page.click('button[type="submit"]');
    await sleep(1200);

    // 3G. Login with Valid Credentials (student.phase3@msnacademy.pk)
    console.log('Logging in as student.phase3@msnacademy.pk...');
    await clearAndType(page, '#login-email', 'student.phase3@msnacademy.pk');
    await clearAndType(page, '#login-password', 'Password@123');
    await page.click('button[type="submit"]');
    await sleep(2500);

    // =============================================================
    // 4. STUDENT DASHBOARD & PROFILE MANAGEMENT
    // =============================================================
    console.log('\n--- 4. Testing Dashboard & Profile ---');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // Profile page
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // Test Profile Update (PUT /users/profile)
    console.log('Testing Profile Update (PUT /users/profile)...');
    await page.evaluate(async () => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.put('/users/profile', {
          fullName: 'Hamza Khan Updated',
          phoneNumber: '+923001234567'
        }).catch(() => null);
      } catch (e) {}
    });
    await sleep(800);

    // Test Password Change (PUT /users/password)
    console.log('Testing Password Change (PUT /users/password)...');
    await page.evaluate(async () => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.put('/users/password', {
          currentPassword: 'Password@123',
          newPassword: 'Password@123'
        }).catch(() => null);
      } catch (e) {}
    });
    await sleep(800);

    // =============================================================
    // 5. COMMERCE CHECKOUT, ORDERS & PAYMENTS (AUTHENTICATED)
    // =============================================================
    console.log('\n--- 5. Testing Checkout, Orders & Payments ---');

    // Add a course to student's cart first
    await page.evaluate(async (cid) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.post('/cart/items', { courseId: cid }).catch(() => null);
      } catch (e) {}
    }, courseId);
    await sleep(800);

    // Navigate to /checkout
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    // Trigger Checkout with valid BANK_TRANSFER method (POST /orders/checkout)
    console.log('Placing Order via Checkout...');
    let orderId = null;
    let paymentId = null;
    const checkoutRes = await page.evaluate(async () => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        const res = await client.post('/orders/checkout', {
          paymentMethod: 'BANK_TRANSFER',
          notes: 'Automated QA verification order'
        });
        return res.data;
      } catch (e) {
        return null;
      }
    });

    if (checkoutRes && checkoutRes.data && checkoutRes.data.order) {
      orderId = checkoutRes.data.order.id;
      paymentId = checkoutRes.data.paymentId || (checkoutRes.data.payment && checkoutRes.data.payment.id);
      console.log(`Created order: ${orderId}, paymentId: ${paymentId}`);
    }

    // GET /orders (Order History)
    await page.goto(`${BASE_URL}/orders`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // GET /orders/:orderId
    if (orderId) {
      console.log(`Fetching single order details: /orders/${orderId}`);
      await page.evaluate(async (oid) => {
        try {
          const client = (await import('/src/services/apiClient.js')).default;
          await client.get(`/orders/${oid}`).catch(() => null);
        } catch (e) {}
      }, orderId);
      await sleep(600);
    }

    // Payment Endpoints: POST /payments/create, POST /payments/:paymentId/verify, GET /payments/:paymentId, PATCH /payments/:paymentId/approve
    if (orderId) {
      console.log('Testing Payment Creation & Status endpoints...');
      await page.evaluate(async ({ oid, pid }) => {
        try {
          const client = (await import('/src/services/apiClient.js')).default;
          // POST /payments/create
          const pCreate = await client.post('/payments/create', { orderId: oid }).catch(() => null);
          const activePid = pid || (pCreate && pCreate.data && pCreate.data.data && pCreate.data.data.paymentId);
          if (activePid) {
            // POST /payments/:paymentId/verify
            await client.post(`/payments/${activePid}/verify`, {
              transactionReference: 'TRX-QA-987654',
              receiptScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'
            }).catch(() => null);

            // GET /payments/:paymentId
            await client.get(`/payments/${activePid}`).catch(() => null);

            // Authenticate as Admin to test admin-only payment review/approval endpoints
            const adminLoginRes = await client.post('/auth/login', {
              email: 'admin@msnacademy.pk',
              password: 'Pakistan@12345'
            }).catch(() => null);
            const adminToken = adminLoginRes?.data?.data?.accessToken;
            const adminHeaders = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

            // PATCH /payments/:paymentId/approve
            await client.patch(`/payments/${activePid}/approve`, { status: 'APPROVED' }, { headers: adminHeaders }).catch(() => null);
            // Also test /admin-review backend path
            await client.patch(`/payments/${activePid}/admin-review`, {
              status: 'APPROVED',
              verificationNotes: 'Payment verified by QA'
            }, { headers: adminHeaders }).catch(() => null);

            // Restore student session
            await client.post('/auth/login', {
              email: 'student.phase3@msnacademy.pk',
              password: 'Password@123'
            }).catch(() => null);
          }
        } catch (e) {}
      }, { oid: orderId, pid: paymentId });
      await sleep(800);
    }

    // Webhook Endpoint (POST /payments/webhook)
    console.log('Testing Payment Webhook (POST /payments/webhook)...');
    await page.evaluate(async (oid) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.post('/payments/webhook', {
          orderId: oid || '6aac2d0183286f6167872b3d',
          transactionId: 'TXN-WEBHOOK-9988',
          amount: 8500,
          status: 'PAID'
        }).catch(() => null);
      } catch (e) {}
    }, orderId);
    await sleep(600);

    // =============================================================
    // 6. LMS LEARNING PLAYER & PROGRESS
    // =============================================================
    console.log('\n--- 6. Testing LMS Learning & Progress ---');
    await page.goto(`${BASE_URL}/my-courses`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // Course Overview
    await page.goto(`${BASE_URL}/learn/${courseId}`, { waitUntil: 'networkidle0' });
    await sleep(1200);

    // Test Course Progress (GET /learning/:courseId/progress)
    await page.evaluate(async (cid) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        await client.get(`/learning/${cid}/progress`).catch(() => null);
      } catch (e) {}
    }, courseId);
    await sleep(600);

    // Lecture Player
    const lessonHref = await page.evaluate(() => {
      const a = document.querySelector('a[href*="/lesson/"]');
      return a ? a.getAttribute('href') : null;
    });

    if (lessonHref) {
      console.log(`Navigating to lecture player: ${lessonHref}`);
      await page.goto(`${BASE_URL}${lessonHref}`, { waitUntil: 'networkidle0' });
      await sleep(1500);

      // Trigger "Next Lesson" / Complete Lesson (POST /learning/:courseId/lessons/:lessonId/complete)
      console.log('Clicking Next Lesson / Complete in Lecture Player...');
      await page.evaluate(async (cid) => {
        try {
          const client = (await import('/src/services/apiClient.js')).default;
          // Extract lessonId from path
          const match = window.location.pathname.match(/\/lesson\/([^/]+)/);
          if (match) {
            await client.post(`/learning/${cid}/lessons/${match[1]}/complete`).catch(() => null);
          }
        } catch (e) {}
      }, courseId);
      await sleep(1500);
    }

    // =============================================================
    // 7. TIMED ASSESSMENT ENGINE
    // =============================================================
    console.log('\n--- 7. Testing Timed Assessment Engine ---');
    await page.goto(`${BASE_URL}/learn/${courseId}/assessment`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    // Start Assessment (POST /assessments/:courseId/start)
    console.log('Starting Assessment attempt...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Start Assessment') || b.innerText.includes('Retake Assessment'));
      if (startBtn) startBtn.click();
    });
    await sleep(2500);

    // Extract active attemptId
    let attemptId = null;
    const startRecord = capturedNetwork.find(n => n.url.includes('/assessments/') && n.url.includes('/start') && n.method === 'POST');
    if (startRecord && startRecord.responseBody && startRecord.responseBody.data) {
      attemptId = startRecord.responseBody.data.attemptId;
      console.log(`Active assessment attemptId: ${attemptId}`);
    }

    // In assessment questions page
    // 7A. Answer Option via UI click (exercises frontend flow)
    await page.waitForSelector('[data-testid="question-option"]', { timeout: 8000 }).catch(() => null);
    await page.evaluate(() => {
      const opt = document.querySelector('[data-testid="question-option"]');
      if (opt) opt.click();
    });
    await sleep(1000);

    // 7B. Test Answer with valid questionId contract & correct answers for certificate issuance
    let issuedCertId = null;
    if (attemptId && startRecord.responseBody.data.questions) {
      const questions = startRecord.responseBody.data.questions;
      const answerPattern = ['B', 'A', 'C', 'B', 'B', 'A', 'B', 'B', 'C', 'A'];
      console.log(`Submitting answers for ${questions.length} questions to achieve certificate threshold...`);
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qId = q.questionId || q.id || q._id;
        const optKey = answerPattern[i] || 'A';
        await page.evaluate(async ({ attId, questionId, key }) => {
          try {
            const client = (await import('/src/services/apiClient.js')).default;
            await client.post(`/assessments/${attId}/answer`, {
              questionId: questionId,
              selectedOptionKey: key,
              isFlagged: false
            });
          } catch (e) {}
        }, { attId: attemptId, questionId: qId, key: optKey });
      }
      await sleep(800);
    }

    // 7C. Test Review Endpoint (GET /assessments/:attemptId/review)
    if (attemptId) {
      console.log(`Testing GET /assessments/${attemptId}/review...`);
      await page.evaluate(async (attId) => {
        try {
          const client = (await import('/src/services/apiClient.js')).default;
          await client.get(`/assessments/${attId}/review`).catch(() => null);
        } catch (e) {}
      }, attemptId);
      await sleep(600);
    }

    // 7D. Submit Assessment via UI Safeguard Modal
    console.log('Submitting Assessment via Safeguard Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const r = btns.find(b => b.innerText.includes('Review & Submit'));
      if (r) r.click();
    });
    await sleep(1000);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const s = btns.find(b => b.innerText.includes('Submit Assessment'));
      if (s) s.click();
    });
    await sleep(800);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const c = btns.find(b => b.innerText.includes('Yes, Submit Now'));
      if (c) c.click();
    });
    await sleep(2500);

    // Capture issued certificate ID from submit response
    const submitRecord = capturedNetwork.find(n => n.url.includes(`/assessments/${attemptId}/submit`) && n.method === 'POST');
    if (submitRecord && submitRecord.responseBody && submitRecord.responseBody.data) {
      issuedCertId = submitRecord.responseBody.data.certificateId;
      console.log(`Certificate granted: ${issuedCertId}`);
    }

    // 7E. Test Result Scorecard Endpoint (GET /assessments/:attemptId/result)
    if (attemptId) {
      console.log(`Testing GET /assessments/${attemptId}/result...`);
      await page.goto(`${BASE_URL}/learn/${courseId}/assessment/result?attemptId=${attemptId}`, { waitUntil: 'networkidle0' });
      await sleep(1500);
    }

    // =============================================================
    // 8. CERTIFICATES MANAGEMENT
    // =============================================================
    console.log('\n--- 8. Testing Certificates Management ---');
    await page.goto(`${BASE_URL}/certificate`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    // Test GET /certificates, /certificates/:certificateId, /download, and /verify/:certificateNumber
    await page.evaluate(async (issuedId) => {
      try {
        const client = (await import('/src/services/apiClient.js')).default;
        const certListRes = await client.get('/certificates').catch(() => null);
        const certs = certListRes?.data?.data || [];
        const activeCert = (issuedId ? certs.find(c => (c.id || c._id) === issuedId) : null) || certs[0];
        if (activeCert) {
          const certId = activeCert.id || activeCert._id;
          const certNum = activeCert.certNumber || activeCert.certificateNumber;
          await client.get(`/certificates/${certId}`).catch(() => null);
          await client.get(`/certificates/${certId}/download`).catch(() => null);
          if (certNum) {
            await client.get(`/certificates/verify/${certNum}`).catch(() => null);
          }
        }
      } catch (e) {}
    }, issuedCertId);
    await sleep(1000);

  } catch (error) {
    console.error('Error during API verification:', error);
  } finally {
    await browser.close();

    fs.writeFileSync(
      path.join(__dirname, 'qaNetworkLog.json'),
      JSON.stringify(capturedNetwork, null, 2)
    );
    console.log(`\n✅ Saved ${capturedNetwork.length} captured network transactions to qaNetworkLog.json`);

    generateFinalReport();
  }
}

function generateFinalReport() {
  const documentedEndpoints = [
    { method: 'POST', path: '/auth/register', section: 'Authentication', description: 'Student account registration' },
    { method: 'POST', path: '/auth/login', section: 'Authentication', description: 'Student & admin login' },
    { method: 'POST', path: '/auth/logout', section: 'Authentication', description: 'Student session logout' },
    { method: 'GET', path: '/auth/me', section: 'Authentication', description: 'Active session validation' },
    { method: 'POST', path: '/auth/forgot-password', section: 'Authentication', description: 'Password reset initiation' },
    { method: 'POST', path: '/auth/reset-password', section: 'Authentication', description: 'Password reset confirmation' },
    { method: 'POST', path: '/auth/oauth/google', section: 'Authentication', description: 'Google OAuth authentication' },
    { method: 'GET', path: '/users/profile', section: 'Users & Profile', description: 'Student profile retrieval' },
    { method: 'PUT', path: '/users/profile', section: 'Users & Profile', description: 'Student profile mutation' },
    { method: 'PUT', path: '/users/password', section: 'Users & Profile', description: 'Password update' },
    { method: 'GET', path: '/courses', section: 'Course Catalog', description: 'Public catalog with search, filter, pagination' },
    { method: 'GET', path: '/courses/:slug', section: 'Course Catalog', description: 'Course details by slug' },
    { method: 'GET', path: '/courses/:courseId/syllabus', section: 'Course Catalog', description: 'Public syllabus structure' },
    { method: 'GET', path: '/categories', section: 'Course Catalog', description: 'Category metadata list' },
    { method: 'POST', path: '/contact', section: 'Marketing', description: 'Public inquiry submission' },
    { method: 'GET', path: '/cart', section: 'Cart Operations', description: 'Guest & user cart retrieval' },
    { method: 'POST', path: '/cart/items', section: 'Cart Operations', description: 'Add course to cart' },
    { method: 'DELETE', path: '/cart/items/:courseId', section: 'Cart Operations', description: 'Remove single item from cart' },
    { method: 'DELETE', path: '/cart', section: 'Cart Operations', description: 'Clear active cart' },
    { method: 'POST', path: '/cart/promo', section: 'Cart Operations', description: 'Validate & apply coupon discount' },
    { method: 'POST', path: '/orders/checkout', section: 'Orders & Checkout', description: 'Place order and initialize payment' },
    { method: 'GET', path: '/orders', section: 'Orders & Checkout', description: 'Student order history list' },
    { method: 'GET', path: '/orders/:orderId', section: 'Orders & Checkout', description: 'Single order details' },
    { method: 'POST', path: '/payments/create', section: 'Payments', description: 'Initialize payment gateway/instructions' },
    { method: 'POST', path: '/payments/:paymentId/verify', section: 'Payments', description: 'Submit manual proof of payment' },
    { method: 'GET', path: '/payments/:paymentId', section: 'Payments', description: 'Fetch payment verification status' },
    { method: 'POST', path: '/payments/webhook', section: 'Payments', description: 'Payment gateway webhook listener' },
    { method: 'PATCH', path: '/payments/:paymentId/approve', section: 'Payments (Admin)', description: 'Admin manual payment verification' },
    { method: 'GET', path: '/student/enrollments', section: 'Enrollments & Student Hub', description: 'Student active and completed courses' },
    { method: 'GET', path: '/student/dashboard-summary', section: 'Enrollments & Student Hub', description: 'Student KPI stats and recent activity' },
    { method: 'GET', path: '/learning/:courseId/overview', section: 'Learning LMS', description: 'LMS syllabus, progress, & exam status' },
    { method: 'GET', path: '/learning/:courseId/lessons/:lessonId', section: 'Learning LMS', description: 'Lecture content, video stream, resources' },
    { method: 'POST', path: '/learning/:courseId/lessons/:lessonId/complete', section: 'Learning LMS', description: 'Mark lesson complete & advance progress' },
    { method: 'GET', path: '/learning/:courseId/progress', section: 'Learning LMS', description: 'Course completion metrics' },
    { method: 'GET', path: '/assessments/:courseId/briefing', section: 'Timed Assessment Engine', description: 'Exam briefing guidelines and eligibility' },
    { method: 'POST', path: '/assessments/:courseId/start', section: 'Timed Assessment Engine', description: 'Start 120-min timed assessment attempt' },
    { method: 'POST', path: '/assessments/:attemptId/answer', section: 'Timed Assessment Engine', description: 'Autosave answer option & bookmark flag' },
    { method: 'GET', path: '/assessments/:attemptId/review', section: 'Timed Assessment Engine', description: 'Review summary grid before submission' },
    { method: 'POST', path: '/assessments/:attemptId/submit', section: 'Timed Assessment Engine', description: 'Submit exam and evaluate score immediately' },
    { method: 'GET', path: '/assessments/:attemptId/result', section: 'Timed Assessment Engine', description: 'Assessment scorecard and certificate trigger' },
    { method: 'GET', path: '/certificates', section: 'Certificates', description: 'Student earned certificates' },
    { method: 'GET', path: '/certificates/:certificateId', section: 'Certificates', description: 'Single certificate record' },
    { method: 'GET', path: '/certificates/:certificateId/download', section: 'Certificates', description: 'Download PDF certificate asset' },
    { method: 'GET', path: '/certificates/verify/:certificateNumber', section: 'Certificates', description: 'Public certificate authenticity check' }
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    totalDocumentedEndpoints: documentedEndpoints.length,
    testedCount: 0,
    passedCount: 0,
    failedCount: 0,
    endpoints: [],
  };

  for (const ep of documentedEndpoints) {
    const matches = capturedNetwork.filter(net => {
      if (net.method !== ep.method) return false;
      const urlPath = net.url.split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/^\/api\/v1/, '');
      const regexPattern = '^' + ep.path.replace(/:[a-zA-Z0-9_-]+/g, '[a-zA-Z0-9_-]+') + '$';
      return new RegExp(regexPattern).test(urlPath);
    });

    const isTested = matches.length > 0;
    const lastCall = matches[matches.length - 1] || null;
    const hasSuccessfulCall = matches.some(m => m.status >= 200 && m.status < 300);

    if (isTested) report.testedCount++;
    if (hasSuccessfulCall) report.passedCount++;
    else if (isTested && !hasSuccessfulCall) report.failedCount++;

    report.endpoints.push({
      method: ep.method,
      endpoint: ep.path,
      section: ep.section,
      description: ep.description,
      tested: isTested,
      callCount: matches.length,
      statuses: matches.map(m => m.status),
      lastStatus: lastCall ? lastCall.status : null,
      lastRequestData: lastCall ? lastCall.postData : null,
      lastResponsePreview: lastCall ? (typeof lastCall.responseBody === 'object' ? JSON.stringify(lastCall.responseBody).substring(0, 200) : String(lastCall.responseBody).substring(0, 200)) : null,
      conformsToEnvelope: lastCall && typeof lastCall.responseBody === 'object' ? ('success' in lastCall.responseBody) : (lastCall && lastCall.status === 204 ? true : null)
    });
  }

  fs.writeFileSync(
    path.join(__dirname, 'qaApiReport.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('✅ Generated comprehensive QA report in qaApiReport.json');
}

runApiVerification().catch(console.error);
