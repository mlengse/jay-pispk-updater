const mysql = require('mysql')
// const MySQLEvents = require('@patrickwalker/mysql-events');
const spinner = require('./spinner')

const { mysqlConfig } = require('./config.js')

// const eventConfig = {
//   startAtEnd: true,
//   excludedSchemas: {
//     mysql: true,
//   },
// }

class My {
  constructor( pkm ) {
    this.pool = mysql.createPool(mysqlConfig);
    this.kkTable = `${pkm}_kk`
    this.artTable = `${pkm}_art`
    this.in = false
    // this.table = false
    // this.eventConfig = config || eventConfig
    // this.MySQLEvents = MySQLEvents
  }

  async end() {
    return await new Promise( resolve => {
      this.pool.end( e => resolve())
    })
  }

  async createTable() {
    try{
      console.log(this.kkTable, this.artTable)
      await this.query(`CREATE TABLE IF NOT EXISTS ${this.kkTable} (id int(10) unsigned NOT NULL AUTO_INCREMENT, survei_id varchar(10) NOT NULL, data text NOT NULL, PRIMARY KEY (id), UNIQUE KEY survei_id (survei_id)) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23034 ;`)
      await this.query(`CREATE TABLE IF NOT EXISTS ${this.artTable} (id int(10) unsigned NOT NULL AUTO_INCREMENT, survei_id varchar(10) NOT NULL, data text NOT NULL, PRIMARY KEY (id), UNIQUE KEY survei_id (survei_id)) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23034 ;`)
      this.table = true
    }catch(e){
      console.error(e)
    }
  }

  async upsert( table, id, data ) {
    let res = await this.query(`INSERT INTO ${table} (survei_id, data) VALUES ("${id}", ? ) ON DUPLICATE KEY UPDATE data = ?;`, [data, data])
    console.log(`${table}, ${id}, ${data}, ${JSON.stringify(res)}`)
  }

  async query(query, value) {

    while( !this.connection || (this.connection && this.connection.state && this.connection.state === 'disconnected') || (this.connection && this.pool._freeConnections.indexOf(this.connection) === 0 )) {
      await this.getConnection()
    }
    spinner.start('query')
    let results = await new Promise( resolve => {
      let connection = this.connection
      this.connection = false
      if(value) {
        connection.query(query, value, (err, results, fields) => {
          if(err){
            console.error(`${new Date()} error: ${JSON.stringify(err.stack)}`)
          }
          connection.release()
          resolve(results)
        })
  
      } else {
        connection.query(query, (err, results, fields) => {
          if(err){
            console.error(`${new Date()} error: ${JSON.stringify(err.stack)}`)
          }
          connection.release()
          resolve(results)
        })
      }
    })
    // spinner.succeed('query')
    spinner.succeed()
    return results
  }
  
  async getConnection() {
    spinner.start('get mysql connection')
    await new Promise ( resolve => this.pool.getConnection( async (err, connection) => {
      if(err){
        console.error(JSON.stringify(err))
        // spinner.info('get new connection')
        // await this.getConnection()
        // resolve()
      } else {
        // spinner.succeed(`connected ${connection.threadId}`)
        this.connection = connection
        spinner.succeed()
        resolve()
      }
    }))
  }

  async init() {
    await this.getConnection()
    // if(!this.instance) {
    //   this.instance = new MySQLEvents(this.connection, this.eventConfig);
    //   await this.instance.start()
    // }

    // this.instance.on(this.MySQLEvents.EVENTS.CONNECTION_ERROR, async (err) => {
    //   console.error(JSON.stringify(err))
    //   console.log('restart instance')
    //   await this.instance.stop()
    //   await this.init()
    // });

    // this.instance.on(this.MySQLEvents.EVENTS.ZONGJI_ERROR, async (err) => {
    //   console.error(JSON.stringify(err))
    //   console.log('restart instance')
    //   await this.instance.stop()
    //   await this.connection.release()
    //   await this.init()
    // });
  }

  // addTrigger(trigger, eventFunction) {
  //   this.instance.addTrigger( Object.assign({}, trigger,
  //   {
  //     onEvent: eventFunction
  //   }))
  // }
}

module.exports = My