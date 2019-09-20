const puppeteer = require('puppeteer');

const { 
  puppeteerCfg,
  navCfg,
  PISPK_USERNAME,
  PISPK_PASSWORD 
} = require('./config')

const initBrowser = async () => {
  const browser = await puppeteer.launch(puppeteerCfg);

  const pages = await browser.pages();
  console.assert(pages.length > 0);
  
  return {
    browser,
    page: pages[0]
  }

}

const initPispk = async () => {
  const { browser, page } = await initBrowser()

  await page.goto('https://keluargasehat.kemkes.go.id', navCfg);
  await page.type('#username', PISPK_USERNAME)
  await page.type('#password', PISPK_PASSWORD)
  await page.click('#forms-login > div.login-form-footer > button')
  await page.waitForNavigation(navCfg)

  return { browser, page }  

}

module.exports = {
  initPispk
}