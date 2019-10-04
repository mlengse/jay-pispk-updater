const fs = require('fs')
const excel = require('ek-excel-stream')
const {
//	pool,
//	getConnection,
	connect
} = require('./mysqlconn')
 
const { filePaths } = require('./file')

for (filePath of filePaths) {
  console.log(filePath)
  let dataStream = fs.createReadStream(filePath);
  let n = 0
  let header = {}
  dataStream
  .pipe(excel())  // same as excel({sheetIndex: 0})
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
        let id = `${Obj.survei_id}_${Obj.no_urut}`
        let data = JSON.stringify(Obj)
        try {
          let res = await connect(`INSERT INTO pispkraw (survei_id, data) VALUES ("${id}", ? ) ON DUPLICATE KEY UPDATE data = ?;`, [data, data])
          console.log(id)
          console.log(res)
//          console.log(data)
        }catch(err){
          console.error(err)
        }
      }
    }
  })
}


