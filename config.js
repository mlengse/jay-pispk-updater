const path =  require('path')

const nightmareCfg = {
  //show: true,
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
  },
  process.env
)