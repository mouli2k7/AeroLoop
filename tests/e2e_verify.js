const puppeteer = require('puppeteer');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('--- Starting AeroLoop Phase 1 E2E Verification ---');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const fileUrl = 'file://' + path.resolve(__dirname, '../aeroloop-mvp.html');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });

  // 1. Initial State Check
  console.log('1. Checking Initial Unauthenticated State...');
  const loginDisplay = await page.$eval('#screen-login', el => window.getComputedStyle(el).display);
  const authDisplay = await page.$eval('#screen-authenticated', el => window.getComputedStyle(el).display);
  const navText = await page.$eval('#nav-session-text', el => el.textContent.trim());

  assert.strictEqual(loginDisplay, 'flex', 'Login screen should be visible initially');
  assert.strictEqual(authDisplay, 'none', 'Authenticated screen should be hidden initially');
  assert(navText.includes('Not Authenticated'), 'Nav status should show unauthenticated');
  console.log('✓ Initial state is correct.');

  // Take screenshot of initial login card
  await page.screenshot({ path: path.resolve(__dirname, '../screenshot_login.png'), fullPage: false });
  console.log('✓ Saved screenshot_login.png');

  // 2. Test Review Focus 1: Empty Email Validation
  console.log('2. Testing Empty Email Validation...');
  await page.click('#btn-login-submit');
  await new Promise(r => setTimeout(r, 200));
  const alertVisible = await page.$eval('#login-alert', el => el.classList.contains('visible'));
  const alertText = await page.$eval('#login-alert-text', el => el.textContent);
  assert(alertVisible, 'Alert should be visible on empty submit');
  assert(alertText.includes('Please provide an operator work email'), 'Alert text should guide user');
  console.log('✓ Empty submission correctly blocked with message:', alertText);

  // 3. Test Review Focus 4: Quick-Fill Chip
  console.log('3. Testing Demo Quick-Fill Chip...');
  await page.click('.persona-chip[data-email="darkstore.hub4@aeroloop.io"]');
  const filledEmail = await page.$eval('#login-email', el => el.value);
  const filledPw = await page.$eval('#login-password', el => el.value);
  assert.strictEqual(filledEmail, 'darkstore.hub4@aeroloop.io', 'Email should be populated');
  assert.strictEqual(filledPw, 'demo12345', 'Password should be populated');
  console.log('✓ Quick-fill chip populated email & password correctly.');

  // 4. Test Password Visibility Toggle
  console.log('4. Testing Password Toggle...');
  await page.click('#btn-toggle-password');
  let pwType = await page.$eval('#login-password', el => el.getAttribute('type'));
  assert.strictEqual(pwType, 'text', 'Password input type should become text');
  await page.click('#btn-toggle-password');
  pwType = await page.$eval('#login-password', el => el.getAttribute('type'));
  assert.strictEqual(pwType, 'password', 'Password input type should become password');
  console.log('✓ Password visibility toggle functions properly.');

  // 5. Test Authentication Submission and Transition
  console.log('5. Testing Form Submission & Operations Card Transition...');
  await page.click('#btn-login-submit');
  
  // Wait for 350ms transition
  await new Promise(r => setTimeout(r, 600));

  const afterLoginDisplay = await page.$eval('#screen-login', el => window.getComputedStyle(el).display);
  const afterAuthDisplay = await page.$eval('#screen-authenticated', el => window.getComputedStyle(el).display);
  const userName = await page.$eval('#auth-user-name', el => el.textContent.trim());
  const beaconOnline = await page.$eval('#nav-beacon', el => el.classList.contains('online'));
  const navSessionText = await page.$eval('#nav-session-text', el => el.textContent);

  assert.strictEqual(afterLoginDisplay, 'none', 'Login screen should now be hidden');
  assert.strictEqual(afterAuthDisplay, 'flex', 'Authenticated operations card should now be visible');
  assert.strictEqual(userName, 'Dark Store Manager', 'Display name should match persona');
  assert(beaconOnline, 'Nav beacon should have online class');
  assert(navSessionText.includes('darkstore.hub4@aeroloop.io'), 'Navbar should show user email');
  console.log('✓ Successfully authenticated and transitioned to Operations Command.');

  // Take screenshot of authenticated view
  await page.screenshot({ path: path.resolve(__dirname, '../screenshot_authenticated.png'), fullPage: false });
  console.log('✓ Saved screenshot_authenticated.png');

  // 6. Test Review Focus 2: Page Reload Persistence
  console.log('6. Testing Session Persistence Across Reload...');
  await page.reload({ waitUntil: 'load' });
  const reloadAuthDisplay = await page.$eval('#screen-authenticated', el => window.getComputedStyle(el).display);
  const reloadUserName = await page.$eval('#auth-user-name', el => el.textContent.trim());
  assert.strictEqual(reloadAuthDisplay, 'flex', 'Authenticated screen should remain visible after reload');
  assert.strictEqual(reloadUserName, 'Dark Store Manager', 'User session should persist after reload');
  console.log('✓ Session persistence verified across reload.');

  // 7. Test Review Focus 3: Sign Out Flow
  console.log('7. Testing Sign Out Flow...');
  await page.click('#btn-logout');
  await new Promise(r => setTimeout(r, 100));

  const finalLoginDisplay = await page.$eval('#screen-login', el => window.getComputedStyle(el).display);
  const finalAuthDisplay = await page.$eval('#screen-authenticated', el => window.getComputedStyle(el).display);
  const finalBeacon = await page.$eval('#nav-beacon', el => el.classList.contains('online'));
  const storedSession = await page.evaluate(() => localStorage.getItem('aeroloop_session'));

  assert.strictEqual(finalLoginDisplay, 'flex', 'Login screen should be visible after sign out');
  assert.strictEqual(finalAuthDisplay, 'none', 'Authenticated screen should be hidden after sign out');
  assert(!finalBeacon, 'Beacon should not be online after sign out');
  assert.strictEqual(storedSession, null, 'LocalStorage session should be cleared after sign out');
  console.log('✓ Sign Out resets all state and clears localStorage.');

  // 8. Test Review Focus 5: Responsive Mobile Viewport
  console.log('8. Testing Mobile Viewport (375px)...');
  await page.setViewport({ width: 375, height: 667 });
  await new Promise(r => setTimeout(r, 100));
  const cardWidth = await page.$eval('.login-card', el => el.getBoundingClientRect().width);
  assert(cardWidth <= 375, 'Card must fit inside 375px viewport without overflowing');
  console.log(`✓ Mobile layout renders cleanly (card width: ${cardWidth}px on 375px screen).`);

  await browser.close();
  console.log('=== ALL E2E VERIFICATION CHECKS PASSED PERFECTLY ===');
})();
