const fs = require('fs')
const excel = require('ek-excel-stream')
const DbConn = require('./sqlite-connect') 
const { filePaths } = require('./file')
const dbconn = new DbConn('rawdata')
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
          Obj[header[key].toLowerCase().split(' ').join('_')] = row[key]
        }
      })
      if(Obj.survei_id) {
        let id = `${Obj.survei_id}${ Obj.no_urut ? `_${Obj.no_urut}` : ''}`
        dbconn.upsert({ id, data: JSON.stringify(Obj) })
      }
    }
  })
}


