
const Pispk = require('./pispk-puppeteer')
const config = require('../config')
const { pool, connect } = require('./mysqlconn')
  
;(async () => {
  try {
  
    for( let pusk of config.pkm){
      const username = config[`PISPK_${pusk.toUpperCase()}_USERNAME`]
      const password = config[`PISPK_${pusk.toUpperCase()}_PASSWORD`]

      const pispk = new Pispk()
      await pispk.init(username, password)

      // await pispk.end()
      // await pispk.init(username, password)

      let datas = await pispk.getDataRumahTangga()
      while(datas.textStatus) {
        datas = await pispk.getDataRumahTangga()
      }

      let n = 0

      let all = await connect('SELECT id, survei_id FROM pispkraw')

      // if(Array.isArray(all) && all.length) for( a of all) console.log(a)

      for(data of datas.data) {
        n++
        let id = data.survei_id.toString()

        // let ikss = all.filter( ({ survei_id }) => survei_id.toString() === id )

        // // let ikss = await connect('SELECT id, survei_id FROM pispkraw WHERE survei_id LIKE ?', [id])

        let iks

        // if(Array.isArray(ikss) && ikss.length){
        //   iks = ikss[0]
        //   console.log(n, iks.id, iks.survei_id)
        // } else {
          
          // console.log(id, 'tidak ketemu')
          // iks = await pispk.getIKSRT(data.survei_id)
          // while(iks.textStatus){
          //   iks = await pispk.getIKSRT(data.survei_id)
          // }
          
          //console.log(data.nama_kk)
          //console.log(JSON.stringify(iks))
  
          data = JSON.stringify(Object.assign({}, data, iks))
  
          console.log(data)
  
          connect(`INSERT INTO pispkraw (survei_id, data) VALUES ("${id}", ? ) ON DUPLICATE KEY UPDATE data = ?;`, [data, data])
          .then( res => {
            console.log(JSON.stringify(res))
          })
        // }
      }
      await pispk.end()
    }

    //pool.end()
  
  }
  catch(err){
    console.error(err)
  }

})();
