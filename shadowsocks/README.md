shadowsocks
=============================
> 代理 : ）

### 目录
* [Ubuntu 16.](#ubuntu-16)
    * 安装
    * 配置
    * 启动
    * 开机自启动
* [Ubuntu 18.](#ubuntu-18)
    * 安装
    * 配置
    * chacha20
    * 启动
    * 开机自启动

Ubuntu 16.
------------
依赖版本
* `python 2.7`
* `shadowsocks-python 2.8.`

### 安装

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
### 配置
* 安装 `nano` 编辑器
```Bash
$ apt-get install nano
```
* 编辑配置文件
```Bash
$ nano /etc/shadowsocks.json
```
JSON 文件，删除注释以符合 `JSON` 格式
```
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
### 启动
* 后台运行 `shadowsocks`
```Bash
$ ssserver -c /etc/shadowsocks.json -d start
```
* 停止命令
```Bash
$ ssserver -c /etc/shadowsocks.json -d stop
```
### 开机自启动
* 设置 `shadowsocks` 开机自启动
```Bash
$ nano /etc/rc.local
```
* 在 `exit 0` 前面加上 `shadowsocks` 的启动命令：
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

Ubuntu 18.
-----------------------
依赖版本
* `python 3.6`
* `shadowsocks-python 3.0.`

### 安装

以下的步骤都是在服务器上以 `root` 权限进行的，如果不是 `root`，自行加 `sudo` 管理员权限执行~
* 更新软件源
```Bash
$ apt-get update
```
* 安装 `pip3` 环境
```Bash
$ apt-get install python3-pip
```
* 安装 `git` 拉取 github 源代码
```Bash
$ apt-get install git
```
* 安装 `shadowsocks 3.0.0`
> github 官网：https://github.com/shadowsocks/shadowsocks/tree/master
```Bash
$ pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```
### 配置
* 安装 `nano` 编辑器
```Bash
$ apt-get install nano
```
* 编辑配置文件
```Bash
$ nano /etc/shadowsocks.json
```
JSON 文件，删除注释以符合 `JSON` 格式
```
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

安装依赖
```Bash
$ apt install libssl-dev swig
```

安装 `m2crypto` 模块

```Bash
$ pip3 install M2Crypto
```

### chacha20
> 以 `chacha20` 加密

系统默认是没有 `chacha20` 加密方式的，需要手动编译 `libsodium 1.0.8` 及以上版本

* 安装 `wget` 下载资源包
```Bash
$ apt-get install build-essential wget -y
```
* 下载 `libsodium` 最新版本
```Bash
$ wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
```
* 解压
```Bash
$ tar xzvf LATEST.tar.gz
```
* 前往目录
```Bash
$ cd libsodium*
```
* 生成配置文件
```Bash
$ ./configure
```
* 编译并安装
```Bash
$ make -j8 && make install
```
* 添加运行库位置
```Bash
$ echo /usr/local/lib > /etc/ld.so.conf.d/usr_local_lib.conf
```
* 加载运行库
```Bash
$ ldconfig
```

### 启动
* 后台运行 `shadowsocks`
```Bash
$ ssserver -c /etc/shadowsocks.json -d start
```
* 停止命令
```Bash
$ ssserver -c /etc/shadowsocks.json -d stop
```

### 开机自启动
> 设置 `shadowsocks` 开机自启动

Ubuntu 18 已经没有 rc.local 文件了

使用 `systemd` 启动 rc.local, 然后在 rc.local 里面添加需要自启动的程序.

* 建立 rc-local.service 文件
```Bash
$ nano /etc/systemd/system/rc-local.service
```
```
[Unit]
Description=/etc/rc.local Compatibility
ConditionPathExists=/etc/rc.local
 
[Service]
Type=forking
ExecStart=/etc/rc.local start
TimeoutSec=0
StandardOutput=tty
RemainAfterExit=yes
SysVStartPriority=99
 
[Install]
WantedBy=multi-user.target
```
* 创建文件 rc.local
```Bash
$ nano /etc/rc.local
```
```
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
echo "看到这行字，说明添加自启动脚本成功。" > /usr/local/test.log
ssserver -c /etc/shadowsocks.json -d start
exit 0
```
* 给 rc.local 加上权限
```Bash
$ chmod +x /etc/rc.local
```
* 启用服务
```Bash
$ systemctl enable rc-local
```
* 启动服务并检查状态
```Bash
$ systemctl start rc-local.service
$ systemctl status rc-local.service
```
* 重启并检查 test.log 文件是否打印输出信息
```Bash
$ nano /usr/local/test.log
```

