const path = require('path')

const { 
  PISPK_USERNAME,
  PISPK_PASSWORD 
} = require('./config')

module.exports = class pispk {
  constructor({ page }) {
    this.page = page
  }

  async waitUntilExist(selector) {
    let done;
    while (!done) {
      done = await this.page.exists(selector)
    }
  
  }

  async login(username = PISPK_USERNAME, password = PISPK_PASSWORD) {
    if(await this.page.exists('#username')) {
      await this.page
      .insert('#username', username)
      .insert('#password', password)
      .click('#forms-login > div.login-form-footer > button')
      await this.waitUntilExist('li > ul > li > a[href="https://keluargasehat.kemkes.go.id/rawdata_survei"]')
      console.log('login')
    }
  }

  async downloadRawDataSurvei(tahun = '2016'){

    let filename = path.join(__dirname, 'download', `survei-${tahun}.xlsx`)

    await this.login()

    if(await this.page.url() !== 'https://keluargasehat.kemkes.go.id/rawdata_survei'){
      await this.page.goto('https://keluargasehat.kemkes.go.id/rawdata_survei')
      await this.waitUntilExist('select#tahun')
      console.log('goto download page')
    }

    await this.page.select('select#tahun', tahun)

    await this.page.click('#btn-download')

    let download = await this.page.download(filename)

    console.log(download)

    //console.log(`data mentah survey tahun: ${tahun} sudah didownload di: ${filename}`)

  }
}