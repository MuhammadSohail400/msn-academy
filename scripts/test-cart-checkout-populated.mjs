import puppeteer from 'puppeteer-core';
import path from 'path';

const SCREENSHOTS_DIR = 'C:\\Users\\HS LAPTOP\\.gemini\\antigravity-ide\\brain\\36f88fb0-32a5-44cb-aea0-502d24c16758\\screenshots';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Quick Register to get session
  const uniqueEmail = `cart.tester.${Date.now()}@example.com`;
  console.log(`Registering session for ${uniqueEmail}...`);
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
  await page.type('input[placeholder="First name"]', 'Ahmed');
  await page.type('input[placeholder="Last name"]', 'Hassan');
  await page.type('input[type="email"]', uniqueEmail);
  await page.type('input[type="tel"]', '+92 300 1234567');
  await page.type('input[placeholder="Minimum 8 characters"]', 'Password123!');
  await page.type('input[placeholder="Re-enter your password"]', 'Password123!');
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) await checkbox.click();
  const registerBtn = await page.$('button[type="submit"]');
  if (registerBtn) await registerBtn.click();
  await new Promise(r => setTimeout(r, 2500));

  // 2. Go to courses, pick first course, click Add to Cart
  console.log('Navigating to course catalog...');
  await page.goto('http://localhost:5173/courses', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const viewCourseLink = await page.$('a[href^="/courses/"]');
  if (viewCourseLink) {
    await viewCourseLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Look for Add to Cart button
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await (await b.getProperty('textContent')).jsonValue();
      if (text.includes('Add to Cart')) {
        await b.click();
        console.log('Clicked Add to Cart');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // 3. Test Cart with items
  console.log('Testing Cart with items...');
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Desktop Cart
  await page.setViewport({ width: 1280, height: 800 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'cart_populated_desktop.png') });

  // Tablet Cart
  await page.setViewport({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'cart_populated_tablet.png') });

  // Mobile Cart
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'cart_populated_mobile.png'), fullPage: true });

  // 4. Test Checkout with items
  console.log('Testing Checkout with items...');
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Desktop Checkout
  await page.setViewport({ width: 1280, height: 800 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'checkout_populated_desktop.png') });

  // Tablet Checkout
  await page.setViewport({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'checkout_populated_tablet.png') });

  // Mobile Checkout
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'checkout_populated_mobile.png'), fullPage: true });

  await browser.close();
  console.log('Populated cart & checkout screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
