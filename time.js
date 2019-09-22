const now = new Date()
let years = []
let first = '2016'
let yearNow = now.getFullYear()

while( first <= yearNow+1 ){
  years.push(first)
  first++
}

module.exports = {
  years
}