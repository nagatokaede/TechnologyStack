npm
===========================
npm 由三个独立的部分组成：
* 网站
    * 网站 是开发者查找包（package）、设置参数以及管理 npm 使用体验的主要途径。
* 注册表（registry）
    * 注册表 是一个巨大的数据库，保存了每个包（package）的信息。
* 命令行工具 (CLI)
    * CLI 通过命令行或终端运行。开发者通过 CLI 与 npm 打交道。
    
## 目录
* [安装](#安装)
    * 安装
    * 更新
    * 安装包
* [package.json](#packagejson)

安装
-----------
安装
* 从 Node.js 网站安装 npm

更新
```Bash
$ npm -v // 获取当前版本号

$ npm install npm@latest -g // 安装最后一个版本

$ npm install npm@next -g // 安装将来发布的测试版本
```
安装包
```Bash
$ npm install <package_name>
```

package.json
-----------
> 管理本地安装的npm软件包的最佳方法是创建一个 package.json文件。

* 要求

一个package.json必须具备 "name" 、 "version" 例如：
```json
{
  "name": "my-awesome-package",
  "version": "1.0.0"
}
```
* 创建一个 package.json
```Bash
$ npm init // 询问创建

$ npm init --yes // 默认值创建
```
* 要将条目添加到您package.json的中
```Bash
// dependencies：
$ npm install <package_name> --save

// devDependencies：
$ npm install <package_name> --save-dev
```
