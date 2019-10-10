const ora = require('ora')
const spinner = ora({
  stream: process.stdout
});
module.exports = spinner