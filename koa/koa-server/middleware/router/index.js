'use static';

const Router = require('koa-router');
const admin = require('./route/admin'),
  ins = require('./route/instagram');


const router = new Router();

router.use('/admin', admin.routes(), admin.allowedMethods());
router.use('/ins', ins.routes(), ins.allowedMethods());

module.exports = router;
