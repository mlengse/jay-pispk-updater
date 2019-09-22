require('dotenv').config()

const { initPispk } = require('./browser')

const Pispk = require('./pispk')

;(async () => {

  const { page } = await initPispk()

  const pispk = new Pispk({ page })

  let tahuns = ['2016', '2017']

  for( tahun of tahuns){
    await pispk.downloadRawDataSurvei(tahun)
  }

  await page.end();

})();