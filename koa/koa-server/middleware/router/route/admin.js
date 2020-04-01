'use static';

const Router = require('koa-router');

const router = new Router();

// 单个用户增删改查
router
  .get('/user/:id', ctx => {
    ctx.body = ctx.params;
  })
  .post('/user', ctx => {
    // ...
  })
  .put('/user/:id', ctx => {
    // ...
  })
  .del('/user/:id', ctx => {
    // ...
  });

// 批量用户删改查
router
  .get('/users', ctx => {
    ctx.body = ctx.params;
  })
  .put('/users', ctx => {
    // ...
  })
  .del('/users', ctx => {
    // ...
  });

module.exports = router;
