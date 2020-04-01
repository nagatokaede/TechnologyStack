'use static';

const Router = require('koa-router');
const admin = require('./route/admin');


const router = new Router();

router.use('/admin', admin.routes(), admin.allowedMethods());

module.exports = router;
