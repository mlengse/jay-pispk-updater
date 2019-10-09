const fs = require('fs')
const excel = require('ek-excel-stream')
 
const { filePaths } = require('./file')

const { pool, connect } = require('./mysqlconn')
;(async() => {
  let all = await connect('SELECT * FROM pispkraw')
  let sids = [ ...new Set(all.map( ({data}) => JSON.parse(data).survei_id.toString() ))]
  //let kk = all.filter( ({ survei_id, data }) => !survei_id.includes('_') && JSON.parse(data).iks_inti ).map(({ survei_id}) => survei_id.toString())

  for (filePath of filePaths) if(filePath.includes('survei')) {
    let dataStream = fs.createReadStream(filePath);
    let n = 0
    let header = {}
    await dataStream
    .pipe(excel())  // same as excel({sheetIndex: 0})
    .on('data', async row => {
      n++
      if( n === 4) {
        header = row
        console.log(filePath)
      } else if ( n > 4) {
        let Obj = {}
        Object.keys(header).map( key => {
          if(row[key]) {
            Obj[header[key].toLowerCase().split(' ').join('_')] = row[key]
          }
        })
  
        if(Obj.survei_id) {
          console.log(sids.length, Obj.survei_id, Obj.iks_inti)
          if(sids.indexOf(Obj.survei_id.toString()) === -1 ) {
            sids.push(Obj.survei_id.toString())
            let id = Obj.survei_id.toString()
            // let id = `${Obj.survei_id}${Obj.no_urut ? `_${Obj.no_urut}`: ''}`
            let data = JSON.stringify(Obj)
            try{
              let res = await connect(`INSERT INTO pispkraw (survei_id, data) VALUES ("${id}", ? ) ON DUPLICATE KEY UPDATE data = ?;`, [data, data])
              console.log(id, JSON.stringify(res))
            }catch(err) {
              console.error(JSON.stringify(err))
            }
          }
        } 
      }
    })
  }

  //pool.end()
  
})()



