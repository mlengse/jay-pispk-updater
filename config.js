const path =  require('path')
require('dotenv').config()
const puppeteerCfg = {
  // headless: true,
  headless: false,
  userDataDir: './tmp',
}

const navCfg = {
  timeout: 0,
  waitUntil: 'networkidle0'
}

const pkm = [ 
  'jayengan', 
//  'purwosari', 
//  'sibela'
]

const nightmareCfg = {
  show: true,
  width: 1900,
  //gotoTimeout: 300000,
  webPreferences: {
    partition: "persist:pispk",
    zoomFactor: 0.75,
    image: false
  },
  paths: {
    downloads: path.join(process.cwd(), 'download')
  }
}

module.exports = Object.assign(
  {},
  {
    nightmareCfg,
    puppeteerCfg,
    navCfg,
    pkm
  },
  process.env
)