require('dotenv').config()

const path =  require('path')
const moment = require("moment");

let tahuns = ['2019']
// let tahuns = ['2017']
let thisYear = moment().format("YYYY");

while( thisYear !== tahuns[tahuns.length-1]) {
  tahuns.push((Number(tahuns[tahuns.length-1]) + 1).toString())
}

const puppeteerCfg = {
  // headless: true,
  headless: false,
  userDataDir: './tmp',
}

const navCfg = {
  timeout: 0,
  waitUntil: 'networkidle0'
}

const pkms = [ 
  // 'sibela',
  // 'purwosari', 
  'jayengan', 
]

const PISPK_URL = 'https://keluargasehat.kemkes.go.id/'
const selectionTahun = '#select2-tahun-container'
const inputSelection = 'body > span > span > span.select2-search.select2-search--dropdown > input'
const downloadSelector = '#btn-download'

const nightmareCfg = {
  show: false,
  // show: true,
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

const mysqlConfig = {
	connectionLimit: 10,
  host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PWD,
	database: process.env.MYSQL_DB
}

module.exports = Object.assign(
  {},
  {
    PISPK_URL,
    selectionTahun,
    inputSelection,
    downloadSelector,
    nightmareCfg,
    puppeteerCfg,
    navCfg,
    pkms,
    tahuns,
    mysqlConfig
  },
  process.env
)