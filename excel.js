const XlsxStreamReader = require("xlsx-stream-reader");

module.exports = class excelPispk {
  constructor() {
    this.workBookReader = new XlsxStreamReader();
    
  }
}