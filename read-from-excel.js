require('dotenv').config()
const fs = require('fs')
const excel = require('ek-excel-stream')
 
const { filePaths } = require('./file')

let kelurahan = []
let rw = []
let rt = []

;(async () => {
  for (filePath of filePaths) {
  console.log(filePath)
  let dataStream = fs.createReadStream(filePath);
  let n = 0
  let header = {}
  let stream = dataStream
  .pipe(excel())  // same as excel({sheetIndex: 0})
  
  stream
  .on('data', async row => {
    n++
    if( n === 4) {
      header = row
    } else if ( n > 4) {
      let Obj = {}
      Object.keys(header).map( key => {
        if(row[key]) {
          Obj[header[key].toLowerCase().split(' ').join('_')] = row[key]
        }
      })
      if(Obj.survei_id) {
        let id = `${Obj.survei_id}${ Obj.no_urut ? `_${Obj.no_urut}` : ''}${Obj.tanggal_survei ? `_${Obj.tanggal_survei}` : ''}`
       // console.log(id)

        if(kelurahan.indexOf(Obj.kelurahan) === -1){
          kelurahan.push(Obj.kelurahan)
          console.log(Obj.kelurahan)
        }

        let rwObj = JSON.stringify({
          kelurahan: Obj.kelurahan,
          rw: Obj.rw
        })
        if(rw.indexOf(rwObj) === -1){
          rw.push(rwObj)
          console.log(rwObj)
        }

        let rtObj = JSON.stringify({
          kelurahan: Obj.kelurahan,
          rw: Obj.rw,
          rt: Obj.rt
        })
        if(rt.indexOf(rtObj) === -1){
          rt.push(rtObj)
          console.log(rtObj)
        }

      }
    }
  })
  
  stream
  .on( 'finish', () => {
    console.log(kelurahan)
    rw.map(console.log)
    rt.map(console.log)

  })
}
})()



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