const path =  require('path')

const Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);

const spinner = require('./spinner')
const config = require('./config')

const { 
  tahuns,
  PISPK_URL,
  selectionTahun,
  inputSelection,
  downloadSelector,
  nightmareCfg,
  nightmareCfg: { 
    webPreferences 
  } 
} = config

module.exports = class Pispk {
  constructor( pkm ) {
    this.pkm = pkm
    this.loggedIn = false
    this.username = config[`PISPK_${this.pkm.toUpperCase()}_USERNAME`]
    this.password = config[`PISPK_${this.pkm.toUpperCase()}_PASSWORD`]
  }

  async waitUntilExists (sel) {
    // spinner.start(`wait sel: ${sel}`)
    let done;
    while (!done) {
      done = await this.pispk.exists(sel)
    }
    // spinner.stop()
  }

  async login () {
    try {
      spinner.start(`login pispk ${this.pkm}`)

      this.pispk = new Nightmare(Object.assign({}, nightmareCfg, {
        webPreferences: Object.assign({}, webPreferences, {
          partition: `persist:${this.pkm}`,
        }),
      }))

      await this.pispk
      .goto(PISPK_URL)
      .insert('#username', this.username)
      .insert('#password', this.password)
      .click('button.btn-block.btn.btn-primary');
      await this.waitUntilExists('li > ul > li > a[href="' + PISPK_URL + 'rawdata_survei"]')
      spinner.succeed(`login pispk ${this.pkm}`)
    } catch (err) {
      // console.error(err)
      spinner.fail(`login pispk ${this.pkm} ${JSON.stringify(err)}`)
    }
  }

  async download (){
    let filenames = []
    try{
      if(!this.loggedIn) {
        await this.login()
        this.loggedIn = true
      }
  
      for (let thisYear of tahuns) {
        spinner.start(`donwload pispk ${this.pkm} tahun: ${thisYear}`)
        await this.pispk.goto(`${PISPK_URL}rawdata_survei`)
  
        await this.waitUntilExists(selectionTahun)
        await this.pispk.mousedown(selectionTahun).click(selectionTahun)
        await this.waitUntilExists(inputSelection)
        await this.pispk.type(inputSelection, thisYear)
        await this.pispk.type(inputSelection, '\u000d')
        let dl = await this.pispk
        .mousedown(downloadSelector)
        .click(downloadSelector)
        .download(path.join(__dirname, 'download', `survei-${this.pkm}-${thisYear}.xlsx`))
        // console.log(dl)
        if(dl.path){
          filenames.push(dl.path)
        }
        spinner.succeed(`donwload pispk ${this.pkm} tahun: ${thisYear}: ${JSON.stringify(dl)}`)
      }

      if(this.loggedIn) {
        await this.pispk.end()
        this.loggedIn = false
      }

      return filenames

    }catch(err){
      // console.error(err)
      spinner.fail(`donwload pispk ${this.pkm} tahun: ${thisYear}: ${JSON.stringify(err)}`)
    }
  }
}