const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

// 17 Major Pages to Audit as requested
const PAGES_TO_AUDIT = [
  { name: 'Home', path: '/', auth: false },
  { name: 'Courses', path: '/courses', auth: false },
  { name: 'Course Details', path: '/courses/applied-data-analytics-power-bi', auth: false },
  { name: 'Login', path: '/login', auth: false },
  { name: 'Register', path: '/register', auth: false },
  { name: 'Contact', path: '/contact', auth: false },
  { name: 'Cart', path: '/cart', auth: false },
  { name: 'Checkout', path: '/checkout', auth: true },
  { name: 'Dashboard', path: '/dashboard', auth: true },
  { name: 'My Courses', path: '/my-courses', auth: true },
  { name: 'Learning/Course Overview', path: '/learn/6aa6409465a4d4b52ff7668f', auth: true },
  { name: 'Lecture Player', path: '/learn/6aa6409465a4d4b52ff76691/lesson/6aa6409465a4d4b52ff76692', auth: true },
  { name: 'Assessment', path: '/learn/6aa6409465a4d4b52ff7668f/assessment', auth: true },
  { name: 'Assessment Result', path: '/learn/6aa6409465a4d4b52ff7668f/assessment/result', auth: true },
  { name: 'Certificates', path: '/certificate', auth: true },
  { name: 'Profile', path: '/profile', auth: true },
  { name: 'Orders', path: '/orders', auth: true },
];

async function measurePageMetrics(page, url, pageName, options = {}) {
  const { throttle = false, isMobile = false } = options;

  // Track all network requests
  const networkRequests = [];
  const client = await page.target().createCDPSession();

  if (throttle) {
    // 4G Network Throttling (1.6 Mbps download, 750 Kbps upload, 150ms RTT)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    });
    // 4x CPU Throttling (mid-tier mobile)
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  } else {
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  const onRequest = (req) => {
    networkRequests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      headers: req.headers(),
      startTime: Date.now(),
    });
  };

  const onResponse = (res) => {
    const item = networkRequests.find((r) => r.url === res.url());
    if (item) {
      item.status = res.status();
      item.endTime = Date.now();
      item.duration = item.endTime - item.startTime;
      item.headers = res.headers();
      item.fromCache = res.fromCache();
      item.fromServiceWorker = res.fromServiceWorker();
    }
  };

  page.on('request', onRequest);
  page.on('response', onResponse);

  // Inject Web Vitals observer snippet before navigation
  await page.evaluateOnNewDocument(() => {
    window.__perfData = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      tbt: 0,
      longTasks: [],
    };

    // FCP & Paint
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__perfData.fcp = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });
    } catch (e) {}

    // LCP
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          window.__perfData.lcp = lastEntry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    // CLS
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perfData.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    // Long Tasks for TBT
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.__perfData.longTasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
            name: entry.name,
          });
          // Tasks longer than 50ms contribute duration - 50ms to TBT
          if (entry.duration > 50) {
            window.__perfData.tbt += entry.duration - 50;
          }
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch (e) {}
  });

  const startNav = Date.now();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  // Allow pending microtasks & paint to settle
  await new Promise((r) => setTimeout(r, 1200));
  const endNav = Date.now();

  const timings = await page.evaluate(() => {
    const navEntries = performance.getEntriesByType('navigation');
    const nav = navEntries.length > 0 ? navEntries[0] : null;
    const paintEntries = performance.getEntriesByType('paint');

    let fp = 0;
    let fcp = 0;
    paintEntries.forEach((p) => {
      if (p.name === 'first-paint') fp = p.startTime;
      if (p.name === 'first-contentful-paint') fcp = p.startTime;
    });

    const perf = window.__perfData || {};

    return {
      timeToFirstRender: Math.round(fp || fcp || 0),
      fcp: Math.round(perf.fcp || fcp || 0),
      lcp: Math.round(perf.lcp || 0),
      cls: Number((perf.cls || 0).toFixed(4)),
      tbt: Math.round(perf.tbt || 0),
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : 0,
      loadEvent: nav ? Math.round(nav.loadEventEnd) : 0,
      responseEnd: nav ? Math.round(nav.responseEnd) : 0,
      domInteractive: nav ? Math.round(nav.domInteractive) : 0,
      longTaskCount: (perf.longTasks || []).length,
      longTasks: (perf.longTasks || []).slice(0, 5),
    };
  });

  page.off('request', onRequest);
  page.off('response', onResponse);

  // Compute Network Summaries
  let totalBytes = 0;
  const requestsByType = {};
  const duplicateApis = {};
  const apiRequests = [];

  for (const r of networkRequests) {
    const type = r.resourceType || 'other';
    requestsByType[type] = (requestsByType[type] || 0) + 1;

    // Check for API calls
    if (r.url.includes('/api/')) {
      const cleanUrl = r.url.split('?')[0];
      duplicateApis[cleanUrl] = (duplicateApis[cleanUrl] || 0) + 1;
      apiRequests.push({
        url: r.url.replace(BASE_URL, ''),
        method: r.method,
        status: r.status,
        duration: r.duration || 0,
      });
    }
  }

  const duplicatesList = Object.entries(duplicateApis)
    .filter(([_, count]) => count > 1)
    .map(([url, count]) => ({ url: url.replace(BASE_URL, ''), count }));

  return {
    pageName,
    url,
    isMobile,
    throttle,
    totalLoadTimeMs: endNav - startNav,
    metrics: timings,
    network: {
      totalRequests: networkRequests.length,
      requestsByType,
      duplicateApis: duplicatesList,
      apiRequests,
    },
  };
}

async function runAudit() {
  console.log('🚀 Launching Chrome for MSN Academy Frontend Performance Audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-gpu-rasterization'],
  });

  const page = await browser.newPage();

  // 1. Authenticate session as student
  console.log('🔑 Authenticating student session on http://localhost:5173...');
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.type('input[type="email"]', 'student.phase3@msnacademy.pk');
    await page.type('input[type="password"]', 'Password@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}),
    ]);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('   Student authenticated successfully!');
  } catch (e) {
    console.warn('   Login warning:', e.message);
  }

  const desktopAuditResults = [];

  // 2. Desktop Unthrottled Audit (1366x768)
  console.log('\n======================================================');
  console.log('🖥️  PART 1: DESKTOP UNTHROTTLED AUDIT (1366 × 768)');
  console.log('======================================================');

  for (const pageItem of PAGES_TO_AUDIT) {
    process.stdout.write(`Measuring [${pageItem.name}]... `);
    try {
      const res = await measurePageMetrics(page, `${BASE_URL}${pageItem.path}`, pageItem.name, {
        throttle: false,
        isMobile: false,
      });
      desktopAuditResults.push(res);
      console.log(
        `FCP: ${res.metrics.fcp}ms | LCP: ${res.metrics.lcp}ms | DCL: ${res.metrics.domContentLoaded}ms | TBT: ${res.metrics.tbt}ms | CLS: ${res.metrics.cls} | Total: ${res.totalLoadTimeMs}ms`
      );
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }

  // 3. Mobile Throttled Audit (375x812 with 4G network and 4x CPU throttle)
  console.log('\n======================================================');
  console.log('📱 PART 2: MOBILE 4G THROTTLED AUDIT (375 × 812)');
  console.log('======================================================');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  const mobileAuditResults = [];
  const representativeMobilePages = [
    PAGES_TO_AUDIT.find((p) => p.name === 'Home'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Courses'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Course Details'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Dashboard'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Cart'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Checkout'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Lecture Player'),
    PAGES_TO_AUDIT.find((p) => p.name === 'Assessment'),
  ].filter(Boolean);

  for (const pageItem of representativeMobilePages) {
    process.stdout.write(`Measuring Mobile [${pageItem.name}] (4G throttled)... `);
    try {
      const res = await measurePageMetrics(page, `${BASE_URL}${pageItem.path}`, pageItem.name, {
        throttle: true,
        isMobile: true,
      });
      mobileAuditResults.push(res);
      console.log(
        `FCP: ${res.metrics.fcp}ms | LCP: ${res.metrics.lcp}ms | DCL: ${res.metrics.domContentLoaded}ms | TBT: ${res.metrics.tbt}ms | CLS: ${res.metrics.cls} | Total: ${res.totalLoadTimeMs}ms`
      );
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }

  // 4. Runtime Interaction Profiling
  console.log('\n======================================================');
  console.log('⚡ PART 3: RUNTIME INTERACTION PROFILING');
  console.log('======================================================');
  await page.setViewport({ width: 1366, height: 768 });

  const interactionResults = [];

  // Interaction A: Search Course Catalog typing
  try {
    await page.goto(`${BASE_URL}/courses`, { waitUntil: 'networkidle2' });
    const searchStart = Date.now();
    await page.type('input[placeholder="Search courses..."]', 'Power BI');
    await new Promise((r) => setTimeout(r, 600)); // wait for debounce
    const searchEnd = Date.now();
    interactionResults.push({
      action: 'Search Courses ("Power BI")',
      durationMs: searchEnd - searchStart,
    });
    console.log(`✓ Search Courses latency: ${searchEnd - searchStart}ms`);
  } catch (e) {
    console.warn('Interaction error (search):', e.message);
  }

  // Interaction B: Filter Category click
  try {
    const filterStart = Date.now();
    const clicked = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const catLabel = labels.find((l) => l.innerText.includes('Web Development'));
      if (catLabel) {
        catLabel.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 600));
    const filterEnd = Date.now();
    interactionResults.push({
      action: 'Filter Category Click ("Web Development")',
      durationMs: filterEnd - filterStart,
      success: clicked,
    });
    console.log(`✓ Filter Category latency: ${filterEnd - filterStart}ms`);
  } catch (e) {
    console.warn('Interaction error (filter):', e.message);
  }

  // Interaction C: Course Details "Add to Cart"
  try {
    await page.goto(`${BASE_URL}/courses/applied-data-analytics-power-bi`, { waitUntil: 'networkidle2' });
    const cartStart = Date.now();
    const added = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addBtn = buttons.find((b) => b.innerText.includes('Add to Cart') || b.innerText.includes('View Cart'));
      if (addBtn) {
        addBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 800));
    const cartEnd = Date.now();
    interactionResults.push({
      action: 'Add to Cart Click',
      durationMs: cartEnd - cartStart,
      success: added,
    });
    console.log(`✓ Add to Cart latency: ${cartEnd - cartStart}ms`);
  } catch (e) {
    console.warn('Interaction error (cart):', e.message);
  }

  // Interaction D: Open Cart Drawer
  try {
    const drawerStart = Date.now();
    const opened = await page.evaluate(() => {
      const cartBtn = document.querySelector('button[aria-label="Open shopping cart"]');
      if (cartBtn) {
        cartBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 500));
    const drawerEnd = Date.now();
    interactionResults.push({
      action: 'Open Cart Drawer Trigger',
      durationMs: drawerEnd - drawerStart,
      success: opened,
    });
    console.log(`✓ Open Cart Drawer latency: ${drawerEnd - drawerStart}ms`);
  } catch (e) {
    console.warn('Interaction error (drawer):', e.message);
  }

  await browser.close();

  // Save full audit data to JSON
  const outputFilePath = path.resolve(__dirname, 'performanceAuditData.json');
  fs.writeFileSync(
    outputFilePath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        desktopAuditResults,
        mobileAuditResults,
        interactionResults,
      },
      null,
      2
    )
  );

  console.log(`\n🎉 Performance data successfully saved to: ${outputFilePath}`);
}

runAudit().catch(console.error);
