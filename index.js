
const Pispk = require('./pispk-web')
const {pkms} = require('./config')
;(async () => {
  for( pkm of pkms){
    const pispk = new Pispk(pkm)
    await pispk.download()
  }
})()

