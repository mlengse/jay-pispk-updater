const { initPispk } = require('./browser')

const Pispk = require('./pispk')
const config = require('./config')

const { years } = require('./time')

;(async () => {

  const { page } = await initPispk()

  const pispk = new Pispk({ page })

  for( let pusk of config.pkm){
    const username = config[`PISPK_${pusk.toUpperCase()}_USERNAME`]
    const password = config[`PISPK_${pusk.toUpperCase()}_PASSWORD`]

    await pispk.login(username, password)
    for( tahun of years){
      await pispk.downloadRawDataSurvei(tahun)
    }
  }

  await page.end();

})();
