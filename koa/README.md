koa
===========================
Koa.js 作为一个web框架，总结出来只提供了两种能力
* HTTP服务
* 中间件机制（AOP切面）

想用Koa实现大部分Web功能的话，就需要整合相关功能的中间件。  
换句话说，Koa.js 说就是中间件的大容器，任何Web所需的能力通过中间件来实现。  
参考：[koa](https://koa.bootcss.com/)、[Koa.js 设计模式-学习笔记](https://chenshenhai.github.io/koajs-design-note/)、[Koa2进阶学习笔记](https://chenshenhai.github.io/koa2-note/)
## 目录
* [HTTP服务](#HTTP服务)
* [中间件](#中间件)
    * 直接中间件
    * 间接中间件
* [官方提供常用中间件](#官方提供常用中间件)
    * koa-logger
    * koa-router
    * koa-static
* [自制或第三方中间件](#自制或第三方中间件)

HTTP服务
-----------
创建一个最简单的 koa 应用
```Bash
$ npm i koa
```
```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

中间件
-----------
Koa 中间件以更传统的方式级联，您可能习惯使用类似的工具 - 之前难以让用户友好地使用 node 的回调。然而，使用 async 功能，我们可以实现 “真实” 的中间件。对比 Connect 的实现，通过一系列功能直接传递控制，直到一个返回，Koa 调用“下游”，然后控制流回“上游”。  
> 这就是 koa 著名的洋葱模型
```js
const Koa = require('koa');
const app = new Koa();

const middleware1 = async (ctx, next) => { 
  console.log(1); 
  await next();  
  console.log(6);   
};

const middleware2 = async (ctx, next) => { 
  console.log(2); 
  await next();  
  console.log(5);   
};

const middleware3 = async (ctx, next) => { 
  console.log(3); 
  await next();  
  console.log(4);   
};

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
app.use(async(ctx, next) => {
  ctx.body = 'hello world'
});

app.listen(3000);

// 启动访问浏览器
// 控制台会出现以下结果
// 1
// 2
// 3
// 4
// 5
// 6
```
### 直接中间件
> 直接被 app.use() 加载

* 请求拦截
```js
const Koa = require('koa');
let app = new Koa();

const middleware = async function(ctx, next) {
  // 中间件 拦截请求
  // 把所有请求不是 /page/ 开头的路径全部抛出500错误
  const reqPath = ctx.request.path;
  if( reqPath.indexOf('/page/') !== 0 ) {
    ctx.throw(500)
  }
  await next();
};

const page = async function(ctx, next) {
  ctx.body = `
      <html>
        <head></head>
        <body>
          <h1>${ctx.request.path}</h1>
        </body>
      </html>
    `; 
};

app.use(middleware);
app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})
```

* 响应拦截
```js
const Koa = require('koa');
let app = new Koa();

const middleware = async function(ctx, next) {
  ctx.response.type = 'text/plain';
  await next();
};

const page = async function(ctx, next) {
  ctx.body = `
      <html>
        <head></head>
        <body>
          <h1>${ctx.path}</h1>
        </body>
      </html>
    `; 
};

app.use(middleware);
app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
});
```

* context挂载代理
    * 请求代理注入
        直接被 app.use  
        请求时候才有注入  
        每次请求的注入都不同  
    * 初始化实例（应用）代理注入  
        直接注入到 app.context  
        初始化应用的时候才注入  
        只注入一次，每次请求都可以使用

* 请求时挂载代理context
```js
const Koa = require('koa');
let app = new Koa();

const middleware = async function(ctx, next) {
  // 中间件 代理/挂载上下文
  // 把所有当前服务的进程PID，内存使用情况方法代理/挂载在ctx上
  ctx.getServerInfo = function() {
    function parseMem( mem = 0 ) {
      let memVal = mem / 1024 / 1024;
      memVal = memVal.toFixed(2) + 'MB';
      return memVal;
    }

    function getMemInfo() {
      let memUsage = process.memoryUsage();
      let rss = parseMem(memUsage.rss);
      let heapTotal = parseMem(memUsage.heapTotal);
      let heapUsed =  parseMem(memUsage.heapUsed);
      return {
        pid: process.pid,
        rss,
        heapTotal,
        heapUsed
      }
    }
    return getMemInfo()
  };
  await next();
};

const page = async function(ctx, next) {
  const serverInfo = ctx.getServerInfo();
  ctx.body = `
      <html>
        <head></head>
        <body>
          <p>${JSON.stringify(serverInfo)}</p>
        </body>
      </html>
    `; 
};

app.use(middleware);
app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
});
```

* 初始化实例挂载代理context
```js
const Koa = require('koa');
let app = new Koa();

const middleware = function(app) {
  // 中间件在初始化实例 把getServerInfo方法 挂载代理到上下文
  app.context.getServerInfo = function() {
    function parseMem( mem = 0 ) {
      let memVal = mem / 1024 / 1024;
      memVal = memVal.toFixed(2) + 'MB';
      return memVal;
    }

    function getMemInfo() {
      let memUsage = process.memoryUsage();
      let rss = parseMem(memUsage.rss);
      let heapTotal = parseMem(memUsage.heapTotal);
      let heapUsed =  parseMem(memUsage.heapUsed);
      return {
        pid: process.pid,
        rss,
        heapTotal,
        heapUsed
      }
    }
    return getMemInfo()
  };
};

middleware(app);

const page = async function(ctx, next) {
  const serverInfo = ctx.getServerInfo();
  ctx.body = `
      <html>
        <head></head>
        <body>
          <p>${JSON.stringify(serverInfo)}</p>
        </body>
      </html>
    `; 
};

app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})
```
### 间接中间件
> 间接被 app.use() 加载

* 间接中间件
```js
const Koa = require('koa');
let app = new Koa();

function indirectMiddleware(path, middleware) {
  return async function(ctx, next) {
    console.log(ctx.path === path, middleware);
    if (ctx.path === path) {
      await middleware(ctx, next);
    } else {
      await next();
    }
  };
}

const index = async function(ctx, next) {
  ctx.body = 'this is index page';
};

const hello = async function(ctx, next) {
  ctx.body = 'this is hello page';
};

const world = async function(ctx, next) {
  ctx.body = 'this is world page';
};

app.use(indirectMiddleware('/', index));
app.use(indirectMiddleware('/hello', hello));
app.use(indirectMiddleware('/world', world));

app.listen(3001, () => {
  console.log('the demo is start at port 3001');
});
```

* 子中间件

子中间件是广义中间件的一个最有代表场景，主要的特点有
> 初始化中间件时，内置子中间件列表  
子中间件列表添加子中间件元素  
子中间件列表封装成间接中间件，让后被app.use()加载  
```js
const Koa = require('koa');
let app = new Koa();

class Middleware{
  constructor() {
    this.stack = [];
  }

  get(path, childMiddleware) {
    this.stack.push({ path, middleware: childMiddleware })
  }

  middlewares() {
    let stack = this.stack;
    return async function(ctx, next) {
      let path = ctx.path;
      for( let i=0; i<stack.length; i++ ) {
        const child = stack[i];
        if( child && child.path === path && child.middleware ) {
          await child.middleware(ctx, next);
        }
      }
      await next();
    }
  }
}

const middleware = new Middleware();
middleware.get('/page/001', async(ctx, next) => { ctx.body = 'page 001' });
middleware.get('/page/002', async(ctx, next) => { ctx.body = 'page 002' });
middleware.get('/page/003', async(ctx, next) => { ctx.body = 'page 003' });

app.use(middleware.middlewares());

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})
```

官方提供常用中间件
-----------
### koa-logger
Koa的开发风格记录器中间件,请求接收兼容。

安装
```Bash
$ npm install koa-logger
```

使用
```js
const logger = require('koa-logger');
const Koa = require('koa');

const app = new Koa();
app.use(logger());
```

自定义
```js
app.use(logger((str, args) => {
  // 将koa记录器重定向到其他输出管道
  // 默认为process.stdout（通过console.log函数）
}))
```
或者
```js
app.use(logger({
  transporter: (str, args) => {
    // ...
  }
}));
```

### koa-router
koa-router 是常用的 koa 的路由库

安装
```Bash
$ npm install koa-router
```
使用
```js
const Koa = require('koa');
const KoaRouter = require('koa-router');

const app = new Koa();
// 创建 router 实例对象
const router = new KoaRouter();

//注册路由
router.get('/', async (ctx, next) => {
  console.log('index');
  ctx.body = 'index';
});

app.use(router.routes());  // 添加路由中间件
app.use(router.allowedMethods()); // 对请求进行一些限制处理

app.listen(3000);
```
上面的示例使用了 GET 方法来进行注册根路由, 实际上不仅可以使用 GET 方法

router.get|put|post|patch|delete|del ⇒ Router

而 router.all() 可用于匹配所有方法
```js
router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  })
  .all('/users/:id', (ctx, next) => {
    // ...
  });
```
捕获命名的路由参数并将其添加到 `ctx.params`
```js
router.get('/:category/:title', (ctx, next) => {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' }
});
```
支持嵌套路由器
```js
const forums = new Router();
const posts = new Router();

posts.get('/', (ctx, next) => {});
posts.get('/:pid', (ctx, next) => {});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```
路由路径可以在路由器级别添加前缀
```js
const router = new Router({
  prefix: '/users'
});

router.get('/'); // responds to "/users"
router.get('/:id'); // responds to "/users/:id"
```
可以使用多个中间件
```js
router.get(
  '/users/:id',
  (ctx, next) => {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      next();
    });
  },
  ctx => {
    console.log(ctx.user);
    // => { id: 17, name: "Alex" }
  }
);
```

router 参数

|Param |Type  |Description|
|------|------|------|
|path  |String|      |	
|[middleware]|function|route middleware(s)|
|callback    |function|route callback|

自制或第三方中间件
-------------------
