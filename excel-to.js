const fs = require('fs')
const path = require('path')

const excelToJson = require("convert-excel-to-json");
const excelStream = require('ek-excel-stream')

const My = require('./my')
const spinner = require('./spinner')

const {
  tahuns
} = require('./config')

class Excell extends My {
  constructor( pkm ) {
    super( pkm )
    this.pkm = pkm
    this.filePaths = fs
    .readdirSync(path.join(__dirname, 'download'))
    .filter(item => 
      item.includes('.xlsx') 
      && item.includes(pkm) 
      && !item.includes('~$')
      && tahuns.filter( tahun => item.includes(tahun)).length
    ).map( item => path.join(__dirname, 'download', item))

    // this.my = new My(pkm)
  }

  async getAll() {
    spinner.start('get all table from mysql')
    this.allART = [...(await this.query(`SELECT data FROM ${this.artTable}`))].map( ({data}) => JSON.parse(data))
    this.allKK = [...(await this.query(`SELECT data FROM ${this.kkTable}`))].map( ({data}) => JSON.parse(data))
    spinner.succeed(`get all table from mysql, kk: ${this.allKK.length}, art: ${this.allART.length}`)
  }

  async processRow( row, kk ) {
    spinner.start(`process row ${this.pkm} ${row['SURVEI ID']}${row['NO URUT'] ? `_${row['NO URUT']}` : ''}`)
    if(row['SURVEI ID']) {
      let headers = Object.keys(row)
      let idKK = headers.indexOf('SUPERVISOR')
      let headerKK = headers.filter((_, id) => id < (idKK + 1) )
      let headerART = headers.filter((_, id) => id > (idKK) )
  
      let art = Object.assign({}, {
        id: `${row['SURVEI ID']}${row['NO URUT'] ? `_${row['NO URUT']}` : ''}`
      },
      headerART.reduce( (curr, key) => {
        curr[key] = row[key]
        return curr
      }, {}))
  
  
      // console.log(this.kkTable)
      // const { upsert, kkTable, artTable } = this
      if(!kk) {
        kk = Object.assign({}, headerKK.reduce( (current, key) => {
          if(row[key]) {
            current[key] = row[key]
          }
          return current
        }, {}))

        if( kk['SURVEI ID']) {
          let kkArr = this.allKK.filter( ekk => ekk['SURVEI ID'] === kk['SURVEI ID'] && JSON.stringify(ekk) === JSON.stringify(kk))
          // console.log(kkArr)
          let kkExist = kkArr.length

  
          if(!kkExist) {
            spinner.start(`upsert ${this.kkTable} ${kk['SURVEI ID']}`)
            this.allKK.push(kk)
            await this.upsert( this.kkTable, kk['SURVEI ID'], JSON.stringify(kk))
            // spinner.succeed(`upsert ${this.kkTable} ${kk['SURVEI ID']}`)
            spinner.succeed()

          } else {
            // spinner.succeed(`${this.kkTable}, ${kk['SURVEI ID']} exist`)
            // spinner.succeed()
          }
  
        }

      }

      let artExist = this.allART.filter( eart => eart.id === art.id && JSON.stringify(eart) === JSON.stringify(eart)).length
      
      if(!artExist) {
        spinner.start(`upsert ${this.artTable}, ${art.id}`)
        this.allART.push(art)
        await this.upsert( this.artTable, art.id, JSON.stringify(art))
        spinner.succeed()
        // spinner.succeed(`upsert ${this.artTable}, ${art.id}`)
      } else {
        // spinner.succeed()
        // spinner.succeed(`${this.artTable}, ${art.id} exist`)
      }

      spinner.succeed()
      // spinner.succeed(`process row ${this.pkm} ${row['SURVEI ID']}${row['NO URUT'] ? `_${row['NO URUT']}` : ''}`)

      return {
        kk,
        art
      }
    }
  }

  async toStream( filePath ) {
    spinner.start(`${filePath} start stream`)
    await new Promise( resolve => {
      let dataStream = fs.createReadStream(filePath);
      let n = 0
      let header = {}
      dataStream
      .pipe(excelStream())  // same as excel({sheetIndex: 0})
      .on('data', async row => {
        try{
          n++
          if( n === 4) {
            header = row
            // console.log(filePath)
          } else if ( n > 4) {
            let Obj = {}
            Object.keys(header).map( key => {
              Obj[header[key]] = row[key]
            })
            await this.processRow( Obj )
          }
        } catch(e) {
          console.error(e)
        }
      })
      .on( 'end', rc => {
        spinner.succeed(`${filePath} end stream`)
        resolve()
      })
  
    })
  }

  async toJson( filePath ) {
    console.log(`membaca file: ${filePath}`)
    let { Sheet1 } = excelToJson({
      sourceFile: filePath,
      header: {
        rows: 4
      },
      columnToKey: {
        '*': '{{columnHeader}}'
      }
    });

    // console.log(`row length: ${Sheet1.length}`)

    if (Sheet1.length) {
      let idList = [...new Set(Sheet1.map(e => e['SURVEI ID']))]
      for (let i = 0; i < idList.length; i++) {
        const surveiID = idList[i];
        // console.log(`survei id: ${surveiID} ke: ${i+1}`)
        let arts = Sheet1.filter( e => e['SURVEI ID'] === surveiID)
        let kk
        for( let a = 0; a < arts.length; a++){
          if( a === 0) {
            let res = await this.processRow( arts[a] )
            kk = res.kk
          } else {
            await this.processRow( arts[a], kk )
          }
          
        }

        // .map( (key, id) => ({ key: }))
        // let kk = {}

        // let inpObj = {
        //   ab: [],
        //   asi: [],
        //   ht:[],
        //   imun:[],
        //   jamban:[],
        //   jiwa:[],
        //   jkn:[],
        //   kb:[],
        //   rokok:[],
        //   salinFaskes:[],
        //   tb:[],
        //   tumbuh:[]
        // }

        // if(arts.length) arts.map( obj => {
        //   if(obj['IKS INTI']) {
        //     inpObj = Object.assign({}, inpObj, {
        //       _key: obj["SURVEI ID"].toString(),
        //       alamat: obj["ALAMAT"],
        //       dataID: obj["SURVEI ID"],
        //       iksBesar: obj['IKS BESAR'],
        //       iksInti: obj['IKS INTI'],
        //       jmlArt: obj['JUMLAH ART'],
        //       jmlArt011: obj['JUMLAH ART USIA 0 - 11 BULAN'],
        //       jmlArt1054: obj['JUMLAH ART USIA 10 - 54 TAHUN'],
        //       jmlArt1259: obj['JUMLAH ART USIA 12 - 59 BULAN'],
        //       jmlArtDewasa: obj['JUMLAH ART DEWASA ( >= 15 TAHUN )'],
        //       jmlArtWawancara: obj['JUMLAH ART DI WAWANCARA'],
        //       kel: obj['KELURAHAN'],
        //       kk: obj['NAMA KK'],
        //       noKK: obj['NO. URUT KELUARGA'],
        //       noRumah: obj['NO. URUT BANGUNAN'],
        //       rt: Number(obj['RT']),
        //       rw: Number(obj['RW']),
        //       tgl: moment(obj['TANGGAL SURVEI'], 'YYYY-MM-DD').format('DD/MM/YYYY')
        //     })

        //     inpObj.ab.push(obj['TERSEDIA SARANA AIR BERSIH'] || 'N')
        //     inpObj.asi.push(obj['ASI EKSLUSIF'] || 'N')
        //     inpObj.ht.push(obj['MINUM OBAT HIPERTENSI TERATUR'] || 'N')
        //     inpObj.imun.push(obj['IMUNISASI LENGKAP'] || 'N')
        //     inpObj.jamban.push(obj['TERSEDIA JAMBAN KELUARGA'] || 'N')
        //     inpObj.jiwa.push(obj['ART MINUM OBAT GANGGUAN JIWA BERAT TERATUR'] || 'N')
        //     inpObj.jkn.push(obj['KEPESERTAAN JKN'] || 'N')
        //     inpObj.kb.push(obj['MENGGUNAKAN KB'] || 'N')
        //     inpObj.rokok.push(obj['MEROKOK'] || 'N')
        //     inpObj.salinFaskes.push(obj['PERSALINAN DI FASKES'] || 'N')
        //     inpObj.tb.push(obj['MINUM OBAT TB TERATUR'] || 'N')
        //     inpObj.tumbuh.push(obj['PEMANTAUAN PERTUMBUHAN BALITA'] || 'N')

        //   }
        // })

        // if(inpObj._key){
        //   ['ab', 'jamban', 'jiwa'].map(o => {
        //     inpObj[o] = inpObj[o][0]
        //   })
          
        //   ;['asi', 'ht', 'imun', 'jkn', 'kb', 'salinFaskes', 'tb', 'tumbuh'].map( e => {
        //     if (inpObj[e].filter(a => a === 'Y').length) {
        //       inpObj[e] = 'Y'
        //     } else if (inpObj[e].filter(a => a === 'T').length) {
        //       inpObj[e] = 'T'
        //     } else {
        //       inpObj[e] = 'N'
        //     }
        //   })

        //   ;['rokok'].map( e => {
        //     if(inpObj[e].filter(a=>a==='Y').length){
        //       inpObj[e] = 'T'
        //     } else {
        //       inpObj[e] = "Y";
        //     }
        //   })

        //   let { OLD, NEW } = await upsert( pusk, 'pispk', inpObj)

        //   //writeStat(item, i, 'from', arts)
        //   writeStat(item, i, 'init', inpObj)
        //   writeStat(item, i, 'old', OLD)
        //   writeStat(item, i, 'new', NEW)
        // }
      }
    }

  }
}

module.exports = Excell
