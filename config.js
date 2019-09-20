const puppeteerCfg = {
  headless: false,
  userDataDir: './tmp',
}

const navCfg = {
  waitUntil: 'networkidle0'
}
 
module.exports = Object.assign(
  {},
  {
    puppeteerCfg,
    navCfg
  },
  process.env
)