const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./download/db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ rawdata: [], iksrt: [], art: [] })
  .write()


// Add a rawdata
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()

// Set a user using Lodash shorthand syntax
db.set('user.name', 'typicode')
  .write()
  
// Increment count
db.update('count', n => n + 1)
  .write()

module.exports = class lowdbconn {
  constructor(dbname) {
    this.adapter = new FileSync(`./download/${dbname}.json`)
    this.db = low(this.adapter)
    this.db.defaults({ })
  }

  upsert({ id, data }) {
    let exists = this.db.has( id ).value()
    if( exists ) {
      let oldData = this.db.get( id ).value()
      if( JSON.stringify(oldData) !== JSON.stringify(data)) {
        data = Object.assign({}, oldData, data)
        this.db.set( id, data ).write()
        return 'exist but diff'
        // return this.db.set( id, data ).write()
      } else {
        return 'exists and same'
      }
    } else {
      this.db.set( id, data ).write()
      return 'not exists'
      // return this.db.set( id, data ).write()
    }
  }
}