require('dotenv').config()

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://keluargasehat.kemkes.go.id', {
    waitUntil: 'networkidle0'
  });
  await page.waitForSelector('#username')
  await page.type('#username', process.env.PISPK_USERNAME)
  await page.type('#password', process.env.PISPK_PASSWORD)
  await page.click('#forms-login > div.login-form-footer > button')
  await page.waitForNavigation()

  await page.screenshot({path: 'example.png'});

  await browser.close();
})();