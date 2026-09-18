import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'C:\\Users\\HS LAPTOP\\.gemini\\antigravity-ide\\brain\\36f88fb0-32a5-44cb-aea0-502d24c16758\\screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const PAGES_TO_TEST = [
  { name: 'cart', url: 'http://localhost:5173/cart' },
  { name: 'checkout', url: 'http://localhost:5173/checkout' },
  { name: 'courses', url: 'http://localhost:5173/courses' },
  { name: 'login', url: 'http://localhost:5173/login' },
  { name: 'register', url: 'http://localhost:5173/register' },
];

async function run() {
  console.log('Launching Chrome for UI consistency testing...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  for (const pageInfo of PAGES_TO_TEST) {
    console.log(`\nTesting page: ${pageInfo.name} (${pageInfo.url})`);
    
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1000));

      // Check overflow metrics
      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const hasHorizontalOverflow = docEl.scrollWidth > window.innerWidth;
        const scrollHeight = Math.max(docEl.scrollHeight, body.scrollHeight);
        const clientHeight = window.innerHeight;

        // Card height consistency check for courses
        let cardHeights = [];
        const cards = document.querySelectorAll('main .grid > div, .grid > div');
        if (cards && cards.length >= 3) {
          cardHeights = Array.from(cards).slice(0, 3).map(c => Math.round(c.getBoundingClientRect().height));
        }

        // Cart container width
        const cartContainer = document.querySelector('.max-w-\\[480px\\], .max-w-md, .max-w-xl');
        const cartWidth = cartContainer ? Math.round(cartContainer.getBoundingClientRect().width) : null;

        return {
          scrollWidth: docEl.scrollWidth,
          windowWidth: window.innerWidth,
          hasHorizontalOverflow,
          scrollHeight,
          clientHeight,
          hasVerticalScroll: scrollHeight > clientHeight + 10,
          cardHeights,
          cartWidth
        };
      });

      const screenshotFile = `${pageInfo.name}_${vp.name}.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotFile);
      await page.screenshot({ path: screenshotPath, fullPage: vp.name === 'mobile' });

      results.push({
        page: pageInfo.name,
        viewport: vp.name,
        ...metrics,
        screenshotFile
      });

      console.log(`  [${vp.name.toUpperCase()}] H-Overflow: ${metrics.hasHorizontalOverflow ? 'FAIL' : 'OK'}, V-Scroll: ${metrics.hasVerticalScroll ? 'YES' : 'NO'}, CardHeights: [${metrics.cardHeights.join(', ')}], Width: ${metrics.cartWidth}px`);
    }
  }

  await browser.close();
  console.log('\n--- UI Consistency Verification Completed ---');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
