'use static';

const { PORT } = require('./config');

const koa = require('koa');
const logger = require('../middleware/logger');
const router = require('../middleware/router');

const app = new koa();

app.use(logger);

app.use(router.routes());

app.listen(PORT);
console.info('server run http://localhost:' + PORT);
