require('dotenv').config()

const { initPispk } = require('./browser')

;(async () => {

  const { browser, page } = await initPispk()

  await page.screenshot({path: 'example.png'});

  await browser.close();
})();