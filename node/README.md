ndoe
=========================
> Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。

### 目录
* [fs](#fs)
    * 检测当前进程对文件的权限
    * 创建目录
    * 同步写入文件
    * 异步写入文件
    * 简单文件写入
    * flag
    * 流式文件写入
    * 简单文件读取
    * 流式文件读取并写入
    * 简单的流式文件读写
    * 其他文件操作方法


fs(文件系统)
-----------------
> fs 模块提供了一个 API，用于以模仿标准 POSIX 函数的方式与文件系统进行交互。

使用
```js
const fs = require('fs');
```

### 检测当前进程对文件的权限
| 既可以检查文件状态，也可以检查路径是否存在

使用fs.access(path[, mode], callback)方法检查权限，mode参数是一个整数，有以下常量值：

|语法|效果|
|----|-----|
|fs.constants.F_OK   |  path对调用进程是可见的，既存在 |
|fs.constants.R_OK   |  path是可读的 |
|fs.constants.W_OK   |  path是可写的 |
|fs.constants.X_OK   |  path是可执行的 |

示例：
```js
fs.access('./note.txt', fs.constants.F_OK, err =>{
  console.log(err?'文件不存在':'文件已经存在');
});
```
同步版本，如果发生异常，则直接抛出异常，否则什么也不做。

同步版本可以利用 try..catch 来做，适用所有方法，如下所示：
```js
try {
  fs.accessSync('./note.txt', fs.constants.F_OK);
} catch (err) {
  console.log('文件不存在');
}
```

### 创建目录
```js
fs.mkdir(dir, err => {
  if (err) {
    console.warn(err);
    return false;
  }
  console.log('创建成功')
});
```

### 同步写入文件
打开文件
```js
const fd = fs.openSync('file', 'w');
```
写入文件
```js
fs.writeSync(fd, '写入一些信息！');
```
关闭文件
```js
fs.closeSync(fd);
```

### 异步写入文件
```js
// 打开文件
fs.open('file', 'w', (err, fd) => {
    if (!err) {
        console.log('文件打开成功！');
        // 写入文件
        fs.write(fd, '写入一些信息', (err) => {
            if (!err) {
                console.log('写入成功！');
            } else {
                console.log(err);
            }
            // 关闭文件
            fs.close(fd, (err) => {
                if (!err) {
                    console.log('关闭成功！');
                } else {
                    console.log(err);
                }
            });
    
        });
    
    } else {
        console.log(err);
    }
});
```

### 简单文件写入
> 封装好的写入函数
> 不适合大文件写入，性能差，内存溢出

* 异步写入

fs.writeFile(file, data[, options], callback);

* 同步写入

fs.writeFileSync(file, data[, options]);

    - file 文件路径
    - data 写入数据
    - options 可选， 可以对写入进行一些设置
        - encoding <string> | <null> 默认 = 'utf-8'
        - mode <integer> 默认 = 0o666
        - flag <string> 默认 = 'w'
    - callback 当写入完成之后执行的函数


### flag
|语法|效果|
|----|-----|
|r   |只读，文件不存在抛出异常|
|r+  |读写，文件不存在抛出异常|
|rs  |同步下只读|
|rs+ |同步下读写|
|w   | 打开并写入，文件不存在则创建，存在则截断|
|wx  |创建并写入，文件存在则创建失败|
|w+  |打开并读写，文件不存在则创建，存在则截断|
|wx+ |创建并读写，文件存在则创建失败|
|a   |打开并追加，不存在则创建|
|ax  |打开并追加，不存在则失败|
|a+  |打开并读取和追加，不存在则创建|
|ax+ |打开并读取和追加，不存在则失败|

示例：
```js
fs.writeFile('/path/file', '写入一些信息', { flag: 'w' }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('写入成功！')
    }
});
```

### 流式文件写入
> 大文件写入方式

```js
// 创建一个可写流
/*
    fs.createWriteStream(path[, options]);
        - 可以用来创建一个可写流
        - path 文件路径
        - options 配置的参数
*/
let ws = fs.createWeiteStream("path/file");

// 可以通过监听流的 open 和 close 事件来监听流的打开和关闭
/*
    on(事件字符串， 回调函数)
        - 可以为对象绑定一个事件
    once(事件字符串， 回调函数)
        - 可以为对象绑定一个一次性的事件，触发后自动失效
*/
ws.once('open', () => {
    console.log('流打开了~~~');
});

ws.once('close', () => {
    console.log('流关闭了~~~');
});

// 通过 ws 向文件中输入内容
ws.write("通过可写流写入文件内容");
ws.write("通过可写流写入文件内容2");

// 关闭流
ws.end(); // ws.end() 是关闭输出端

// ws.close() 是关闭输入端
```
### 简单文件读取
```js
/*
    fs.readFile(path [, optionss], callback);
    fs.readFileSync(path [, options]);
*/

fs.readFile('path/file', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        // 返回值为 buffer 类型
        // 事先设置 options 中 encoding 编码，得到的数据类型会改变
        // 例如 utf-8 则 data 类型为 <string>
        console.log(data);
        // ......
    }
});
```
### 流式文件读取并写入
```js
/*
    流式文件读取也适用于一些大文件。
    fs.createReadStream(path[, options]);
        - 可以用来创建一个可读流
        - path 文件路径
        - options 配置的参数
*/
// 创建一个可读流
let rs = fs.createReadStream('path/file');
// 创建一个可写流
let ws = fs.createWriteStream('path/file');

// 监听流的开启和关闭
rs.once('open', () => {
    console.log('可读流打开了~~');
});

ws.once('open', () => {
    console.log('可写流打开了~~');
});

rs.once('close', () => {
    console.log('可读流关闭了~~');
    // 数据读取完毕，关闭可写流
    ws.end();
});

// 如果要读取一个可读流中的数据，必须要为可读流绑定一个 data 时间， data 时间绑定完毕，它会自动开始读取数据
rs.on('data', (data) => {
    console.log(data);
});
```

### 简单的流式文件读写
```js
/*
    pipe 管道
*/
// 创建一个可读流
let rs = fs.createReadStream('path/file');
// 创建一个可写流
let ws = fs.createWriteStream('path/file');

// pipe() 可以将可读流中的内容，直接输出到可写流中
re.pipe(ws);
```

### 其他文件操作方法
* 查看文件状态
```js
/*
    fs.stat(path, callback);
    fs.statSync(path);
*/
fs.stat('path/file', (err, stat) => {
    /*
        size 文件大小
        isFile() 是否是一个文件
        isDirectory 是否是一个文件夹（目录）
    */
    console.log(stat.size);
});
```

* 删除文件
```js
/*
    fs.unlink(path, callback);
    fs.unlinkSync(path);
*/
fs.unlinkSync('path/file');
```

* 读取一个目录的目录结构
```js
/*
    fs.readdir(path [, options], callback);
    fs.readdirSync(path [, options]);
        - files 是一个字符串数组，每一个元素就是一个文件夹或文件的名字
*/
fs.readdir('path', (err, files) => {
    if (err) {
        console.log(err);
    } else {
        console.log(files);
    }
});
```

* 截断文件，将文件修改为指定大小
```js
/*
    fs.truncate(path, len, callback);
    fs.truncateSync(path, len);
        - len 单位为字节， 一个汉字 3 个字节！
*/
fs.truncateSync('path/file', 10);
```

* 创建一个目录和删除一个目录
```js
/*
    fs.mkdir(path [, mode], callback);
    fs.mkdirSync(path[, mode]);
        - 创建一个目录
     
    fs.rmdir(path, callback);
    fs.rmdirSync(path);
        - 删除一个目录
*/
fs.mkdirSync('path');
fs.rmdirSync('path');
```

* 文件重命名或文件移动
```js
/*
    fs.rename(oldPath, newPath, callback);
    fs.renameSync(oldPath, newPath);
        - oldPath 旧路径
        - newPath 新路径
        - callback 回调函数
*/
fs.rename('oldPath/oldFileName', 'newPath/newFileName', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('修改成功~~~');
    }
});
```

* 监视文件的修改
```js
/*
    fs.watchFile(filename [, options], listener);
        - 参数：
            filename 需要监视的文件名
            options 配置参数
            listener 回调函数，当文件发生变化时，回调函数会执行
                在回调函数中有两个参数：
                    curr 当前文件的状态
                    prev 修改前文件状态
                           - 这两个对象都是 stats 对象
*/
fs.watchFile('path/file', (curr, prev) => {
    console.log(`修改前文件大小: ${prev.size}`);
    console.log(`修改后文件大小: ${curr.size}`);
});
```

