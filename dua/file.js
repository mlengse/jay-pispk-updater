const fs = require('fs')
const path = require('path')

let fileNames = fs.readdirSync(path.join(__dirname, 'download')).filter(item => item.includes('.xlsx'))

let filePaths = fileNames.map( fileName => path.join(__dirname, 'download', fileName))

module.exports = {
  fileNames,
  filePaths
}