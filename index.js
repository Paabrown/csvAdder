const { csvAdd } = require('./csvAdd.js');
const { interval } = require('./config')

setInterval(csvAdd, interval)

console.log('job running!');
