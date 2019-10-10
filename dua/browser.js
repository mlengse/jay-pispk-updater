const Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);

const { 
  nightmareCfg,
} = require('../config')

const initPispk = async () => {
  const page = new Nightmare(nightmareCfg)

  await page.goto('https://keluargasehat.kemkes.go.id');
  return { page }

}

module.exports = {
  initPispk
}