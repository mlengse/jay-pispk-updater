const { connect } = require('./mysqlconn')

;(async () => {
  try {
    let datas = await connect(`SELECT data FROM pispkraw`)
    for( { data } of datas){
      let obj = JSON.parse(data)
      let { 
        provinsi,
        kecamatan
      } = obj

      //data propinsi
      let propinsi = await connect('SELECT id FROM propinsi WHERE nama = ? ', provinsi)
      if(!propinsi.length){
        await connect('INSERT IGNORE INTO propinsi ( nama ) VALUES (?)', provinsi)
        propinsi = await connect('SELECT id FROM propinsi WHERE nama = ? ', provinsi)
      }

      //data kab/kota
      let kab_kota = obj['kab/kota']
      let kab_kota_arr = await connect('SELECT id FROM kab_kota WHERE propinsi_id = ? AND nama = ? ', [propinsi[0].id, kab_kota])
      if(!kab_kota_arr.length){
        await connect('INSERT IGNORE INTO kab_kota ( propinsi_id, nama ) VALUES (?, ?)', [propinsi[0].id, kab_kota])
        kab_kota_arr = await connect('SELECT id FROM kab_kota WHERE propinsi_id = ? AND nama = ? ', [propinsi[0].id, kab_kota])
      }

      //data kecamatan
      let kecamatan_arr = await connect('SELECT id FROM kecamatan WHERE propinsi_id = ? AND nama = ? ', [propinsi[0].id, kab_kota])
      if(!kab_kota_arr.length){
        await connect('INSERT IGNORE INTO kab_kota ( propinsi_id, nama ) VALUES (?, ?)', [propinsi[0].id, kab_kota])
        kab_kota_arr = await connect('SELECT id FROM kab_kota WHERE propinsi_id = ? AND nama = ? ', [propinsi[0].id, kab_kota])
      }

      console.log(`propinsi: ${provinsi}, id: ${propinsi[0].id}, kota: ${kab_kota}, id: ${kab_kota_arr[0].id}`)

    }
  }catch(err){
    console.error(err)
  }
})()