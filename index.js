// const Pispk = require('./pispk-web')
const ExcelTo = require('./excel-to')
const {
  pkms,
} = require('./config')

;(async() => {
  try {
    for( pkm of pkms) {
      // pkms.map( async pkm => {
        const excel = new ExcelTo(pkm)
        for( filePath of excel.filePaths) {
          // excel.toStream(filePath)
          await excel.toJson(filePath)
        }
      
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
