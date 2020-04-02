'use static';

const Router = require('koa-router');
const ins = require('../../../modules/instagramSpider');

const router = new Router();

router
  .get('/search', ctx => {
    ins.spider('https://www.instagram.com/p/BvYbAbrBU8v/?utm_source=ig_share_sheet&igshid=betpf9thpwz5').then(res => {
      ctx.body = res;
    }).catch(err => {
      ctx.body = err;
    });
  });
  // .post('/', ctx => {
  //   // ...
  // })
  // .put('/', ctx => {
  //   // ...
  // })
  // .del('/', ctx => {
  //   // ...
  // });

module.exports = router;
