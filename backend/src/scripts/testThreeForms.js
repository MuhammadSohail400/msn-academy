const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testForms() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
  });
  const page = await browser.newPage();

  page.on('response', async (res) => {
    if (res.url().includes('/api/v1/')) {
      let body;
      try { body = await res.json(); } catch(e) { body = await res.text().catch(() => ''); }
      console.log('[RESP]', res.request().method(), res.url(), res.status(), typeof body === 'object' ? JSON.stringify(body).slice(0, 120) : body.slice(0, 120));
    }
  });

  // 1. Contact Form
  console.log('Testing Contact form...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
  const cInputs = await page.$$('input');
  if (cInputs.length >= 3) {
    await cInputs[0].type('Zaid Ahmed');
    await cInputs[1].type('zaid.ahmed@example.com');
    await cInputs[2].type('General Course Inquiry');
  }
  const cTextarea = await page.$('textarea');
  if (cTextarea) {
    await cTextarea.type('I would like to inquire about course prerequisites and schedule.');
  }
  const cSubmit = await page.$('button[type="submit"]');
  if (cSubmit) await cSubmit.click();
  await new Promise(r => setTimeout(r, 2000));

  // 2. Register Form
  console.log('Testing Register form...');
  const testEmail = `student.qa.${Date.now()}@msnacademy.pk`;
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
  const rInputs = await page.$$('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
  console.log('Register inputs found:', rInputs.length);
  if (rInputs.length >= 6) {
    await rInputs[0].type('Zubair');
    await rInputs[1].type('Khan');
    await rInputs[2].type(testEmail);
    await rInputs[3].type('+923001234567');
    await rInputs[4].type('Password@123');
    await rInputs[5].type('Password@123');
  }
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) await checkbox.click();
  const rSubmit = await page.$('button[type="submit"]');
  if (rSubmit) await rSubmit.click();
  await new Promise(r => setTimeout(r, 2500));

  // 3. Reset Password Form
  console.log('Testing Reset Password form...');
  await page.goto('http://localhost:5173/reset-password?token=mock_test_token_123', { waitUntil: 'networkidle0' });
  const resetInputs = await page.$$('input[type="password"]');
  console.log('Reset inputs found:', resetInputs.length);
  if (resetInputs.length >= 2) {
    await resetInputs[0].type('NewPassword@123');
    await resetInputs[1].type('NewPassword@123');
    const rpSubmit = await page.$('button[type="submit"]');
    if (rpSubmit) await rpSubmit.click();
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
}

testForms().catch(console.error);
