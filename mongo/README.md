mongodb
=======================

### 目录
* [基本概念](#基本概念)
* [基本命令](#基本命令)
* [增删改查](#增删改查)
    * [增加](#增加)
    * [查询](#查询)
    * [修改](#修改)
    * [删除](#删除)
* [添加登录密码](#添加登录密码)
* [mongoose](#mongoose)



基本概念
-----------------------
* 数据库（database）
* 集合 （collection）
* 文档 （document）
    * 在 MongoDB 中，数据库和集合不需要手动创建
    * 当我们创建文档时，如果文档所在的集合或数据库不存在会自动创建数据库和集合

基本命令
-----------------------
#### 启动
窗口启动 mongo
```Bash
$ mongod --dbpath D:\data\db --port 15498
```
后台启动 mongo
```Bash
$ mongod --dbpath=/home/data/db --logpath=/home/data/logs.log --logappend --port=15498 --fork
```
#### 连接
无密码连接
```Bash
$ mongo mongodb://path:port
```
有密码连接
```Bash
$ mongo mongodb://username:passworld@path:port
```
连接到指定库
 ```Bash
 $ mongo mongodb://username:passworld@path:port/db
 ```
#### 基本操作
* show dbs

    显示当前的所有数据库
    
* use 数据库名

    进入到指定的数据库中
    
* db

    db 表示当前所处的数据库
    
* show collections

    显示数据库中所有的集合

增删改查
-----------------------
#### 增加
* db.\<collection>.insert(doc)

    向集合中插入一个或多个文档

    id 可以自己指定，但需要确保唯一性

例子：向 test 数据库中的 stus 集合中插入一个新的学生对象
```Bash
# 插入数据
{name: "長門楓", age: "17", gender: "不明" }

# 单条插入
$ db.stus.insert({name: "長門楓", age: "17", gender: "不明"});

# 多条插入
$ db.stus.insert([
    {name: "長門有希", age: "14", gender: "女"},
    {name: "沢渡楓", age: "16", gender: "女"},
    {name: "美纱", age: "17", gender: "女"}
]);
``` 
   
* db.\<collection>.insertOne()
    
    插入一个文档对象 V3.2 后添加功能

* db.\<collection>.insertMany()

    插入多个文档对象 V3.2 后添加功能

#### 查询
* db.\<collection>.find()

    查询当前集合中所有符合条件的文档

    fin() 返回一个数组

    find() 可以接受一个对象作为条件参数
```Bash
# {} 表示查询所有文档
# { 属性: 值 } 查询属性是指定值得文档
# { 属性: { $in: [ 值1, 值2 ... ] } } 查询相同属性不同的值
$ db.stus.find({ age: { $in: [ 14, 16 ] } })

# { $or: [ { 属性: 值 }, { 属性: 值 } ] } 查询不同属性符合的值
$ db.stus.find({$or: [{age: 14}, {name: "美纱"}]})
    
# { 属性: { $lt: 小于这个值的数 } } 筛选小于这个值的文档
    $lte <=
$ db.stus.find({ age: { $lt: 17 } })

# { 属性: { $gt: 大于这个值的数 } } 筛选大于这个值的文档
    $gte >=
$ db.stus.find({ age: { $gt: 17 } })

# { 属性: { $ne: 不等于这个值的数 } } 筛选不等于这个值的文档
# { 属性: { $eq: 等于这个值的数 } } 一般省略
# 支持扩展属性查询但一定要双引号
$ db.stus.find({ "other.cc": "o"  })
```
* db.\<collection>.findOne()

    查询符合条件的第一个文档

    findOne() 返回一个文档对象

* db.\<collection>.find({}).count()

    查询所有结果的数量

* db.\<collection>.find({}).skip().limit()
    * skip() 跳过多少条数据显示
    * limit() 设置显示数据的上限 （显示多少条数据）
        * skip((页码 - 1) * 每页显示条数 ).limit(每页显示条数);
        * MongoDB 会自动调整 skip() 和 limit() 的顺序

#### 修改
* db.\<collection>.update(查询条件，新对象)

update() 默认情况下会使用新对象来替换旧对象并且只修改第一个

如果需要修改指定属性，而不是替换。需要使用“修改操作符”来完成修改
```Bash
# $set 可以用来修改文档中的指定属性
$ db.stus.update(
    {name: "長門楓"}, 
    {$set: {
        gender: "不详"
    }}
)

# $unset 可以用来删除指定属性
$ db.stus.update(
    {name: "長門楓"}, 
    {$unset: {
        gender: 1
    }}
)
# 修改多个查询结果
$ db.stus.update(
    {gender: "女"}, 
    {$set: {
        age: 17
    }}, {
        multi: true
    }
)

# $push 用于向数组中添加一个新元素
$ db.stus.update(
    { name: "nagato" }, 
    { $push: { "other.cc": "en" } }
)

# $addToSet 用于向数组中添加一个不重复的新元素
    重复则不添加

# $inc 自增
$ db.emp.updateMany({ sal: { $lte: 1000 } }, { $inc: { sal: 400 } })
    工资低于 1000 的员工工资增加 400
```

* db.<collection>.updateOne(查询条件，新对象)

    修改一个文档对象 V3.2 后添加功能

* db.<collection>.updateMany(查询条件，新对象)

    修改多个文档对象 V3.2 后添加功能

* db.<collection>.replaceOne(旧对象，新对象)

    修改多个文档对象 V3.2 后添加功能

    相当于 update() 默认时的功能

#### 删除
> 一般不删除数据，通过添加一个属性作为数据是否有效地判断

* db.\<collection>.remove()

    remove() 可以根据条件来删除文档，传递的条件的方式和 find() 一样
    
    默认删除符合条件的所有文档
    
    * 如果 remove() 第二个参数为 true 则只删除一个。
    * 如果传入一个空对象 {} 则删除集合里全部数据
```Bash
$ db.stus.remove({age: 17}, true);
$ db.stus.remove({});
```

* db.\<collection>.deleteOne()

    删除符合条件的第一个文档
    
* db.\<collection>.deleteMany()

    删除符合条件的所有文档

* db.\<collection>.drop()

    删除指定集合

* db.dropDatabase()

    删除当前数据库-
    
添加登录密码
-----------------------
#### 为mongodb添加
* 开启 mongodb
```Bash
$ mongod --dbpath <path> --port <port>
```

* 连接 mongodb
```Bash
$ mongo --port <port>
```

* 设置密码

切换到 `admin` 数据库
```Bash
$ use admin
```

给admin设置用户密码

user: 用户名, pwd: 用户密码,roles: 用来设置用户的权限，比如读，读写 等等
```Bash
$ db.createUser({user: 'root', pwd: '123456', roles: ['root']})
```

验证是否添加成功，'db.auth(用户名，用户密码)'

如果返回 '1'表示验证成功， 如果是 '0' 表示验证失败...
```Bash
$ db.auth('root', '123456')
```

#### 给特定的每个库设置权限
切换到特定数据库
```Bash
$ use webapp-node-project
```

设置密码
user: 用户名, pwd: 用户密码,roles: 用来设置用户的权限，比如读，读写 等等
```Bash
$ db.createUser({user: 'admin', pwd: '123456', roles: [{role: 'readWrite', db: 'webapp-node-project'}]})
```

#### role 类型
* 创建系统级别的的admin用户，分配root角色，可以管理所有数据库,做任意的操作：

|code| 描述 |
|----|-----|
|root|可以管理所有数据库,做任意的操作|

* 数据库用户角色（Database User Roles）：

|code| 描述 |
|----|-----|
|read|授予User只读数据的权限|
|readWrite|授予User读写数据的权限|

* 数据库管理角色（Database Administration Roles）：

|code| 描述 |
|----|-----|
|dbAdmin|在当前dB中执行管理操作|
|dbOwner|在当前DB中执行任意操作|
|userAdmin|在当前DB中管理User|

* 备份和还原角色（Backup and Restoration Roles）：

|code| 描述 |
|----|-----|
|backup|备份|
|restore|还原|

* 跨库角色（All-Database Roles）：

|code| 描述 |
|----|-----|
|readAnyDatabase|授予在所有数据库上读取数据的权限|
|readWriteAnyDatabase|授予在所有数据库上读写数据的权限|
|userAdminAnyDatabase|授予在所有数据库上管理User的权限|
|dbAdminAnyDatabase|授予管理所有数据库的权限|

* 集群管理角色（Cluster Administration Roles）：

|code| 描述 |
|----|-----|
|clusterAdmin|授予管理集群的最高权限|
|clusterManager|授予管理和监控集群的权限，具有此角色的用户可以访问在分片和复制中使用的配置和本地数据库|
|clusterMonitor|授予监控集群的权限，对监控工具具有readonly的权限|
|hostManager|管理Server|


mongoose
-----------------------
#### 快速上手
* 安装
```Bash
$ npm install mongoose
```

假设我们都很喜欢喵星人，想在MongoDB里记录每只我们见过的喵星人。 首先我们要在项目中引入 mongoose ，然后连接我们本地的 test 数据库。
```js
// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
```
connect() 返回一个状态待定（pending）的连接， 接着我们加上成功提醒和失败警告。
```js
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
```

连接成功时，回调函数会被调用。简洁起见， 我们假设下面所有函数都运行在这个回调函数里。

Mongoose 里，一切都始于Schema。 现在我们来看一个例子：
```js
var kittySchema = mongoose.Schema({
  name: String
});
```
很好，我们得到了一个带有 String 类型 name 属性的 schema 。 接着我们需要把这个 schema 编译成一个 Model：
```js
var Kitten = mongoose.model('Kitten', kittySchema);
```
model 是我们构造 document 的 Class。 在例子中，每个 document 都是一只喵，它的属性和行为都会被声明在 schema。 现在我们来“创造”一只猫：
```js
var felyne = new Kitten({ name: 'Felyne' });
console.log(felyne.name); // 'Felyne'
```
不会喵怎么算喵星人，现在给喵星人 document 加个 "speak" 方法：
```js
// 译者注：注意了， method 是给 document 用的
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);
```
加在 schema methods 属性的函数会编译到 Model 的 prototype， 也会暴露到每个 document 实例：
```js
var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"
```
赞！是一只会说话的瞄星人！emmmmm虽然我们还没吧它存到数据库里。 每个 document 会在调用他的 save 方法后保存到数据库。 注意回调函数的第一个参数永远是 error 。
```js
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});
```
后来我们收集了好多喵，就可以通过以下方法获取喵星人 model 里的所有数据：
```js
Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})
```
如果我们想获取特定的数据， 可以了解一下 query。
```js
// 这么写可以获取所有 name 为 "Fluff" 开头的数据
Kitten.find({ name: /^fluff/ }, callback);
```
