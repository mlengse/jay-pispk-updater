require('dotenv').config()
const fs = require('fs')
const excel = require('ek-excel-stream')
 
const { filePaths } = require('./file')

for (filePath of filePaths) {
  console.log(filePath)
  let dataStream = fs.createReadStream(filePath);
  let n = 0
  let header = {}
  dataStream
  .pipe(excel())  // same as excel({sheetIndex: 0})
  .on('data', row => {
    n++
    if( n === 4) {
      header = row
    } else if ( n > 4) {
      let Obj = {}
      Object.keys(header).map( key => {
        if(row[key]) {
          Obj[header[key]] = row[key]
        }
      })
      if(Obj['SURVEI ID']) {
        console.log(Obj)
      }
    }
  })
}


/*
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

*/