const logger = require('koa-logger');
const writeLog = require('../util/writeLogger');

const writeLogger = async args => {
  const file = __dirname + '/../logs/out.log';
  const date = new Date().toLocaleString('chinese',{ hour12: false });
  const data = args[0].match('-->') ? `--> ${args[1]} ${date} ${args.slice(2).join(' ')}\n` : `<-- ${args[1]} ${date} ${args[2]}\n`;

  writeLog(file, data);
};

module.exports = logger((str, args) => {
  console.info(str);
  writeLogger(args);
});
