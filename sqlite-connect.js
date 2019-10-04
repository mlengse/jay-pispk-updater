const Database = require('better-sqlite3');

module.exports = class pispksql {
  constructor( dbname ){
    this.dbname = dbname
    this.db = new Database(`${dbname}.db`, { verbose: console.log });
  }

  upsert({ id, data }) {
    let exist, res

    let arr = this.db
    .prepare(`SELECT data FROM ${this.dbname} WHERE id = ?`)
    .all(id)

    if(Array.isArray(arr) && arr.length) {
      exist = arr[0]
      if(exist.data == data){
        res = 'exist and same'
      } else {
        res = 'exist but diff'
        this.db
        .prepare(`UPDATE ${this.dbname} SET data = @data WHERE id = @id`)
        .run({id, data })
      }
    } else {
      res = 'not exist'
      this.db
      .prepare(`INSERT INTO ${this.dbname} (id, data) VALUES (@id, @data)`)
      .run({ id, data })
  
    }
    process.stdout.write(`\r${id} ${res}                    \r`)
  }
}