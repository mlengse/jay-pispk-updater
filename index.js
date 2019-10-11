const Pispk = require('./pispk-web')
const ExcelTo = require('./excel-to')
const {
  pkms,
} = require('./config')

;(async() => {
  try {
    for( pkm of pkms) {
      const excel = new ExcelTo(pkm)

      const pispk = new Pispk(pkm)
      let filenames = await pispk.download()

      await excel.createTable()

      await excel.getAll()

      for( filePath of filenames) {
      // for( filePath of excel.filePaths) {
        await excel.toStream(filePath)
        // await excel.toJson(filePath)
      }

      await excel.end()
      
      
    }
    // })
  }catch(e){console.error(e)}
})()
