const fs = require('fs')
const cheerio = require('cheerio')
const converter = require('json-2-csv')
const { pool, connect } = require('./mysqlconn')

function getKKLinkID ( html ) { 
  if(html) {
    let $ = cheerio.load(html)
    return $('a.row-edit').attr('href')
  }
}

;(async () => {
  try{
    let all = await connect(`SELECT * FROM pispkraw`)
    all = all.map( raw => Object.assign({}, {
      id: raw.survei_id,
      no: raw.id,
    }, JSON.parse(raw.data)))
    let kk = all.filter( ({ id }) => !id.includes('_'))
//    let art = all.filter( ({ id }) => id.includes('_') && !id.includes('undefined'))
    let undef = all.filter( ( raw ) => !raw.iks && !raw.iks_inti )
    let surveiIdUndef = [...new Set(undef
      .map( ({ survei_id }) => survei_id.toString()))]
      .map( und => Object.assign({}, 
      ...all.filter( o => o.survei_id.toString() === und ), 
      ...all.filter( o => o.survei_id.toString() === und && o.aksi).map( ({ aksi }) => ({ 
        aksi: getKKLinkID( aksi )
      }))))
  //  console.log(`all: ${all.length}`)
    console.log(`kk: ${kk.length}`)
  //  console.log(`art: ${art.length}`)
    console.log(`belum lengkap: ${surveiIdUndef.length}`)
    await Promise.all([
      new Promise( (resolve, reject) => converter.json2csv(surveiIdUndef, ( err, csv ) => {
        err ? reject(err) : fs.writeFile("./download/blm-lgkp.csv", csv, (err) => err? reject(err): resolve())
      })),
      pool.end()
    ])
  }catch(e){
    console.error(e)
  }
})()