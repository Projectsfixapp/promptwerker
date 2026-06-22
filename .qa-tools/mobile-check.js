const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'preview', 'index.html').replace(/\\/g, '/');
  const browser = await chromium.launch();
  const errors = [];

  const iphone = devices['iPhone 13'];
  const context = await browser.newContext({ ...iphone });
  const page = await context.newPage();
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

  await page.goto(fileUrl);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, 'mobile-top.png') });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve(__dirname, 'mobile-mid.png') });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve(__dirname, 'mobile-bottom.png') });

  await context.close();
  await browser.close();

  console.log('ERRORS:', errors.length ? JSON.stringify(errors) : 'none');
})();
