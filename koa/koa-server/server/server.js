'use static';

const { port } = require('./config');

const koa = require('koa');
const logger = require('../middleware/logger');

const app = new koa();

app.use(logger);

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(port);
console.info('server run http:localhost:' + port);
