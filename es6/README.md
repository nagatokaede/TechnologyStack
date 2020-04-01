es6
==================
> javascript 2015 版本及更高，记录一些常用方法

## 目录
* [导出引入](#导出引入)
    * [require](#require)
    * [module](#module)
    * [import](#import)
    * [export](#export)
    
导出引入
-----------
> 在 Node.js 模块系统中，每个文件都被视为一个独立的模块。

module、module.exports、exports采用的是CommonJS模块规范。

import、export、export default采用的是ES6模块规范。

* module.exports输出的是值的拷贝；export是值的引用
* module.exports在运行时加载；export是在编译时输出
### require
用于引入模块、 JSON、或本地文件。 可以从 node_modules 引入模块。 可以使用相对路径（例如 ./、 ./foo、 ./bar/baz、 ../foo）引入本地模块或 JSON 文件，路径会根据 __dirname 定义的目录名或当前工作目录进行处理。
```js
// 整体引入赋值
const koa = require('koa');

// 单独引入某个对象
const access = require('fs').access;

// 解析引用
const { open, write, close } = require('fs');

// 整体引用
require('wangEdit');
```

### module
每个文件就是一个模块。文件内定义的变量、函数等等都是在自己的作用域内，都是自身所私有的，对其它文件不可见。

每个文件内部都有一个module对象，它包含以下属性
* `id`: 模块的识别符，通常是带有绝对路径的模块文件名
* `filename`：模块的文件名，带有绝对路径
* `loaded`：返回一个布尔值，表示模块是否已经完成加载
* `parent`：返回一个对象，表示调用该模块的模块
* `children`：返回一个数组，表示该模块要用到的其他模块
* `exports`：表示模块对外输出的值

module.exports

在module中有一个属性exports，即：module.exports。它是该模块对外的输出值，是一个对象。其它模块在加载该模块时，实际上加载到的数据都是由它提供的。

module.exports输出的可以是一个对象，也可以是一个函数。在引用该模块的文件内，如果接受到的是对象，可以直接访问其中的属性，如果接受到的是一个函数，也可以直接执行

exports

exports是一个特殊的存在，它是对module.exports的指向，可以通过向exports对象中添加变量、方法等，但是不能直接将exports指向一个值，这样会切断exports和module.exports之间的联系。

export和module.exports的使用有一点需要注意，如果导出的是一个函数，只能使用module.exports。

### import
使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块。
```js
// 按需引入
import { firstName, lastName, year } from './config.js';

// 整体引入
import * as config from './config.js';

// export default 默认导出，只有用 export default 的模块可使用
import config from './config.js';
```
import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
```js
import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;
```

### export
export default

为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。
```js
// export-default.js
export default function () {
  console.log('foo');
}
```
上面代码是一个模块文件export-default.js，它的默认输出是一个函数。

其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。
```js
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```
上面代码的import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时import命令后面，不使用大括号。
