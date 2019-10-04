const { initPispk } = require('./browser')

const Pispk = require('./pispk')

const { years } = require('./time')

;(async () => {

  const { page } = await initPispk()

  const pispk = new Pispk({ page })

  for( tahun of years){
    await pispk.downloadRawDataSurvei(tahun)
  }

  await page.end();

})();
