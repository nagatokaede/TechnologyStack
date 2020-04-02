shadowsocks
=============================
> 代理 : ）

### 目录
* [安装](#安装)
* [配置](#配置)
* [启动](#启动)

安装
------------
服务器系统：Ubuntu 16.

shadowsocks-python

以下的步骤都是在服务器上以 `root` 权限进行的，如果不是 `root`，自行加 `sudo` 管理员权限执行~
* 更新软件源
```Bash
$ apt-get update
```
* 安装 `pip` 环境
```Bash
$ apt-get install python-pip
```
* 更新 `pip` 版本
```Bash
$ pip install --upgrade pip
```
* 安装 `setuptools` 模块
```Bash
$ pip install setuptools
```
* 安装 `shadowsocks`
```Bash
$ pip install shadowsocks
```
配置
-------------
* 安装 `nano` 编辑器
```Bash
$ apt-get install nano
```
* 编辑配置文件
```Bash
$ nano /etc/shadowsocks.json
```
```python
{ 
    "server":"0.0.0.0", # 服务器 IP
    "server_port":1024, # 服务启动端口号
    "local_address": "127.0.0.1", # 本地 IP
    "local_port":1080, # 本地端口号
    "password":"mypassword", # 连接密码
    "timeout":300, # 超时时间
    "method":"aes-256-cfb" # 加密方式
}
```
* 赋予 `shadowsocks` 配置文件权限
```Bash
$ chmod 755 /etc/shadowsocks.json
```
* 安装以支持这些加密方式
```Bash
$ apt-get install python-m2crypto
```
启动
-------------
* 后台运行 `shadowsocks`
```Bash
$ ssserver -c /etc/shadowsocks.json -d start
```
* 停止命令
```Bash
$ ssserver -c /etc/shadowsocks.json -d stop
```
* 设置 `shadowsocks` 开机自启动
```Bash
$ nano /etc/rc.local
```
在 `exit 0` 前面加上 `shadowsocks` 的启动命令：
```
#!/bin/sh -e # 
# rc.local # 
# This script is executed at the end of each multiuser runlevel. 
# Make sure that the script will "exit 0" on success or any other 
# value on error. # 
# In order to enable or disable this script just change the execution # bits. # 
# By default this script does nothing. 
ssserver -c /etc/shadowsocks.json -d start 
exit 0
```

若果 Ubuntu 17.10 默认没有这个文件，设置 `shadowsocks` 自动启动，参考：

http://forum.ubuntu.org.cn/viewtopic.php?f=186&t=481439
