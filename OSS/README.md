阿里云 OSS
===================================
阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。
> 比起存到服务器里，还是存到 OSS 上便宜
>
> 主要以 node 开发

### 目录
* [安装](#安装)
* [配置](#配置)
* [快速入门](#快速入门)
* [存储空间管理](#存储空间管理)


安装
-----------------------
Node.js >= 8.0.0 如果需要在 Node.js < 8 的环境中使用，请使用 ali-oss 4.x版本。
```Bash
$ npm install ali-oss
```

然后在Vue、React等程序中依赖注入即可使用

```js
let OSS = require('ali-oss');

let client = new OSS({
  // https://help.aliyun.com/document_detail/140601.html?spm=5176.10695662.1996646101.searchclickresult.38c419c2vGchvn
  region: '<oss region>',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: '<Your accessKeyId>',
  accessKeySecret: '<Your accessKeySecret>',
  bucket: '<Your bucket name>'
});
```

配置
-----------------------
OSS（options）中的各个配置项说明如下

|key|type|describe|
|---|----|--------|
|accessKeyId| {String}|通过阿里云控制台创建的AccessKey。|
|accessKeySecret| {String}|通过阿里云控制台创建的AccessSecret。|
|stsToken| {String}|使用临时授权方式，详情请参见使用 STS 进行临时授权。|
|bucket| {String}|通过控制台或PutBucket创建的bucket。|
|endpoint| {String}|OSS域名。|
|region| {String}|bucket所在的区域， 默认oss-cn-hangzhou。|
|internal| {Boolean}|是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用。|
|cname| {Boolean}|是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定。|
|isRequestPay| {Boolean}|bucket是否开启请求者付费模式，默认false。具体可查看请求者付费模式。|
|secure| {Boolean}|(secure: true)则使用HTTPS，(secure: false)则使用HTTP，详情请查看常见问题。|
|timeout| {String&brvbar;Number}|超时时间，默认60s。|

快速入门
--------------------
查看 Bucket 列表
```js
async function listBuckets () {
  try {
    let result = await client.listBuckets();
  } catch(err) {
    console.log(err)
  }
}

listBuckets();
```

查看文件列表
```js
client.useBucket('Your bucket name');
async function list () {
  try {
    let result = await client.list({
      'max-keys': 5
    })
    console.log(result)
  } catch (err) {
    console.log (err)
  }
}
list();
```

上传文件
```js
client.useBucket('Your bucket name');

async function put () {
  try {
    let result = await client.put('object-name', 'local file');
    console.log(result);
   } catch (err) {
     console.log (err);
   }
}

put();
```

下载文件
```js
async function get () {
  try {
    let result = await client.get('object-name');
    console.log(result);
  } catch (err) {
    console.log (err);
  }
}

get();
```

删除文件
```js
async function del () {
  try {
    let result = await client.delete('object-name');
    console.log(result);
  } catch (err) {
    console.log (err);
  }
}

del();
```

存储空间管理
-----------------
```js
'use static';

/********************* 存储空间管理 *****************************/

const client = require('../oss');


/**
 * 创建存储空间
 * @param {string} bucketName - your bucket name
 * @return {Promise<void>}
 */
async function putBucket(bucketName) {
  try {
    const result = await client.putBucket(bucketName);
    return result.res ? `create ${bucketName} bucket ${result.res.statusMessage}` : result;
  } catch (err) {
    console.warn(err);
    return err;
  }
}

/**
 * 列举存储空间
 * options {
 *   Delimiter {string} - 对Object名字进行分组的字符。所有Object名字包含指定的前缀，第一次出现Delimiter字符之间的Object作为一组元素
 *   Marker {string} - 设定从Marker之后按字母排序开始返回Object。Marker用来实现分页显示效果，参数的长度必须小于1024字节。
 *   Max-keys {string} - 指定返回Object的最大数。取值：大于0小于1000。默认值：100
 *   Prefix {string} - 限定返回文件的Key必须以Prefix作为前缀。
 *   Encoding-type {string} - 对返回的内容进行编码并指定编码的类型。
 * }
 * @param {object} options
 * @return {Promise<void>}
 */
async function listBuckets(options) {
  try {
    const result = await client.listBuckets(options);
    return result.buckets;
  } catch (err) {
    console.warn(err);
    return err;
  }
}

/**
 * 设置存储空间访问权限
 * @param {string} bucketName - your bucket name
 * @param {string} option - [ private(私有), public-read(公共读), public-read-write(公共读写) ]
 * @return {Promise<void>}
 */
async function putBucketACL(bucketName, option) {
  try {
    const result = await client.putBucketACL(bucketName, option);
    return result.res ? `set ${bucketName} bucket ${option} ${result.res.statusMessage}` : result;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 * 获取存储空间访问权限
 * @param {string} bucketName - your bucket name
 * @return {Promise<void>}
 */
async function getBucketACL(bucketName) {
  try {
    const result = await client.getBucketACL(bucketName);
    return result.acl;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 * 删除存储空间
 * 删除存储空间之前，必须先删除存储空间下的所有文件、LiveChannel和分片上传产生的碎片。
 * @param {string} bucketName - your bucket name
 * @return {Promise<void>}
 */
async function deleteBucket(bucketName) {
  try {
    const result = await client.deleteBucket(bucketName);
    return result.res ? `delete ${bucketName} bucket OK` : result;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  putBucket,
  listBuckets,
  putBucketACL,
  getBucketACL,
  deleteBucket,
};
```


