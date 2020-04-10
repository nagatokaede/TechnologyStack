pm2
==================
PM2是守护程序进程管理器，它将帮助您管理和保持应用程序在线。

PM2入门非常简单，它是一个简单直观的CLI，可以通过NPM安装。
> 与之前用过的 Forever 差不错

## 目录
* [安装](#安装)
    * 安装
    * 更新
* [启动](#启动)
* [配置文件](#配置文件)


安装
-----------
安装
```Bash
$ npm install mp2 -g // 全局安装
```
更新
```Bash
$ npm install pm2 -g && pm2 update
```

启动
-----------
* 启动，守护和监视应用程序的最简单方法是使用以下命令行：
```Bash
$ pm2 start app.js
```
* 或轻松启动任何其他应用程序：
```Bash
$ pm2 start bashscript.sh
$ pm2 start python-app.py --watch
$ pm2 start binary-file -- --port 1520
```
* 可以传递给CLI的一些选项：
```Bash
# 指定一个应用程序名称
--name <app_name>

# 文件更改时观看并重新启动应用程序
--watch

# 为应用程序重新加载设置内存阈值
--max-memory-restart <200MB>

# 指定日志文件
--log <log_path>

# 额外的参数传递给脚本
-- arg1 arg2 arg3

# 自动重启之间的间隔时间
--restart-delay <delay in ms>

# 随着时间的推移前缀日志
--time

# 不自动重启应用程序
--no-autorestart

# 指定 cron 强制重启
--cron <cron_pattern>

# 附加到应用程序日志
--no-daemon
```
* 管理状态命令

> 代替app_name您可以通过：
>> all 在所有过程中采取行动
>>
>> id 根据特定的进程ID采取行动
```Bash
$ pm2 restart app_name
$ pm2 reload app_name
$ pm2 stop app_name
$ pm2 delete app_name
```

* 其它命令
```Bash
# 列出由PM2管理的所有应用程序的状态：
$ pm2 [list|ls|status]

# 要实时显示日志：
$ pm2 logs

# 要挖掘较旧的日志，请执行以下操作：
$ pm2 logs --lines 200

# 这是一个直接适合您终端的实时仪表板：
$ pm2 monit
```

配置文件
----------------
* 生成生态系统文件：
```Bash
$ pm2 ecosystem
```
* 生成 `ecosystem.config.js` 文件：
```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
```
* 轻松启动：
```Bash
$ pm2 start process.yml
```
