// const Pispk = require('./pispk-web')
const ExcelTo = require('./excel-to')
const {
  pkms,
} = require('./config')

;(async() => {
  try {
    for( pkm of pkms) {
      const excel = new ExcelTo(pkm)
      await excel.getAll()
      for( filePath of excel.filePaths) {
        await excel.toStream(filePath)
        // await excel.toJson(filePath)
      }

      // await excel.end()
      
      // const pispk = new Pispk(pkm)
      // ;(async () => {
      //   try {
      //     let filenames = await pispk.download()
      //   } catch (e){
      //     console.error(e)
      //   }
      // })()
      
    }
    // })
  }catch(e){console.error(e)}
})()
