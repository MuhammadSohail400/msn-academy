import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/forgot-password', { waitUntil: 'networkidle2' });
  await page.type('#forgot-email', 'asorapremium@gmail.com');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:\\Users\\HS LAPTOP\\.gemini\\antigravity-ide\\brain\\36f88fb0-32a5-44cb-aea0-502d24c16758\\screenshots\\forgot_password_updated.png' });
  await browser.close();
  console.log('Screenshot saved!');
}

main().catch(console.error);
