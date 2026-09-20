const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'Laptop_1440x900', width: 1440, height: 900 },
  { name: 'Desktop_1366x768', width: 1366, height: 768 },
  { name: 'TabletLandscape_1024x768', width: 1024, height: 768 },
  { name: 'TabletPortrait_768x1024', width: 768, height: 1024 },
  { name: 'MobileLarge_390x844', width: 390, height: 844 },
  { name: 'MobileStandard_375x812', width: 375, height: 812 },
];

const PAGES = [
  { path: '/', name: 'Home', auth: false },
  { path: '/courses', name: 'Course Catalog', auth: false },
  { path: '/courses/applied-data-analytics-power-bi', name: 'Course Details', auth: false },
  { path: '/about', name: 'About', auth: false },
  { path: '/pricing', name: 'Pricing', auth: false },
  { path: '/faq', name: 'FAQ', auth: false },
  { path: '/contact', name: 'Contact', auth: false },
  { path: '/verify', name: 'Verify Certificate', auth: false },
  { path: '/cart', name: 'Cart', auth: false },
  { path: '/login', name: 'Login', auth: false },
  { path: '/register', name: 'Register', auth: false },
  { path: '/forgot-password', name: 'Forgot Password', auth: false },
  { path: '/reset-password', name: 'Reset Password', auth: false },
  { path: '/checkout', name: 'Checkout', auth: true },
  { path: '/order/pending', name: 'Order Pending', auth: true },
  { path: '/order/success', name: 'Order Success', auth: false },
  { path: '/order/failed', name: 'Order Failed', auth: false },
  { path: '/dashboard', name: 'Dashboard', auth: true },
  { path: '/my-courses', name: 'My Courses', auth: true },
  { path: '/orders', name: 'Order History', auth: true },
  { path: '/profile', name: 'Profile', auth: true },
  { path: '/certificate', name: 'Certificates', auth: true },
  { path: '/learn/6aa6409465a4d4b52ff7668f', name: 'Course Overview', auth: true },
  { path: '/learn/6aa6409465a4d4b52ff76691/lesson/6aa6409465a4d4b52ff76692', name: 'Lecture Player', auth: true },
  { path: '/learn/6aa6409465a4d4b52ff7668f/assessment', name: 'Assessment Briefing', auth: true },
  { path: '/learn/6aa6409465a4d4b52ff7668f/assessment/questions', name: 'Assessment Questions', auth: true },
  { path: '/learn/6aa6409465a4d4b52ff7668f/assessment/result', name: 'Assessment Result', auth: true },
];

async function runAudit() {
  console.log('📱 Starting Comprehensive UI/UX Visual & Responsive Audit across 6 Viewports...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const BASE_URL = 'http://localhost:5173';

  const screenshotsDir = path.resolve(__dirname, 'visual_audit_shots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Authenticate as student
  console.log('🔑 Authenticating session as student.phase3@msnacademy.pk on ' + BASE_URL + '...');
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 10000 });
    await page.type('input[type="email"]', 'student.phase3@msnacademy.pk');
    await page.type('input[type="password"]', 'Password@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {}),
    ]);
    await new Promise(r => setTimeout(r, 1000));
    console.log('   Authenticated successfully!');
  } catch (e) {
    console.warn('   Login warning:', e.message);
  }

  const results = [];
  let totalIssues = 0;

  for (const pageItem of PAGES) {
    console.log(`\n📄 Auditing [${pageItem.name}] (${pageItem.path})...`);

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto(`${BASE_URL}${pageItem.path}`, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 600));

        const metrics = await page.evaluate((vpWidth, vpHeight) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const scrollHeight = Math.max(docEl.scrollHeight, body ? body.scrollHeight : 0);
          const hasHorizontalOverflow = scrollWidth > vpWidth + 1;

          // Check for overflowing elements
          const overflowingElements = [];
          const smallTapTargets = [];

          const allElements = document.querySelectorAll('*');
          allElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > vpWidth + 2) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
                id: el.id || '',
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              });
            }

            // Check touch targets on interactive elements in mobile viewports
            if (vpWidth <= 768 && (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.href))) {
              if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
                // Ignore small inline links inside paragraphs or icons
                if (!el.closest('p') && !el.closest('span')) {
                  smallTapTargets.push({
                    tag: el.tagName.toLowerCase(),
                    text: (el.innerText || '').slice(0, 30),
                    w: Math.round(rect.width),
                    h: Math.round(rect.height),
                  });
                }
              }
            }
          });

          return {
            scrollWidth,
            scrollHeight,
            hasHorizontalOverflow,
            overflowingElements: overflowingElements.slice(0, 5),
            smallTapTargets: smallTapTargets.slice(0, 3),
          };
        }, vp.width, vp.height);

        const status = metrics.hasHorizontalOverflow ? '❌ OVERFLOW' : '✅ PASS';
        if (metrics.hasHorizontalOverflow) {
          totalIssues++;
          console.log(`   [${vp.name}] ${status}: scrollWidth ${metrics.scrollWidth}px > viewport ${vp.width}px`);
          metrics.overflowingElements.forEach(el => {
            console.log(`      -> Offender: <${el.tag} id="${el.id}" class="${el.className}"> (right: ${el.right}px, width: ${el.width}px)`);
          });
        } else {
          console.log(`   [${vp.name}] ${status}: perfect fit (${metrics.scrollWidth}px <= ${vp.width}px)`);
        }

        // Save screenshot for key viewports (mobile 375, tablet 768, desktop 1366) on select pages
        if (['MobileStandard_375x812', 'TabletPortrait_768x1024', 'Desktop_1366x768'].includes(vp.name)) {
          const safeName = pageItem.name.replace(/[^a-zA-Z0-9]/g, '_');
          const shotFile = path.join(screenshotsDir, `${safeName}_${vp.name}.png`);
          await page.screenshot({ path: shotFile, fullPage: false });
        }

        results.push({
          page: pageItem.name,
          path: pageItem.path,
          viewport: vp.name,
          viewportWidth: vp.width,
          scrollWidth: metrics.scrollWidth,
          passed: !metrics.hasHorizontalOverflow,
          overflowingElements: metrics.overflowingElements,
          smallTapTargets: metrics.smallTapTargets,
        });

      } catch (err) {
        console.error(`   [${vp.name}] ⚠️ Error auditing page:`, err.message);
        results.push({
          page: pageItem.name,
          path: pageItem.path,
          viewport: vp.name,
          viewportWidth: vp.width,
          passed: false,
          error: err.message,
        });
      }
    }
  }

  await browser.close();

  const reportPath = path.resolve(__dirname, 'visualAuditReport.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalChecks: results.length,
    passedChecks: results.filter(r => r.passed).length,
    failedChecks: results.filter(r => !r.passed).length,
    totalIssues,
    results,
  }, null, 2));

  console.log(`\n🏁 Visual Audit Complete! Total checks: ${results.length} | Passed: ${results.filter(r => r.passed).length} | Failed: ${results.filter(r => !r.passed).length}`);
  console.log(`📄 Detailed JSON report saved to: ${reportPath}`);
}

runAudit().catch(console.error);
