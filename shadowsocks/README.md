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
* [V2Ray](#v2ray)

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

V2Ray
-----------------------
> V2Ray 既是服务端又是客户端
>
> {浏览器} <--(socks)--> {V2Ray 客户端 inbound <-> V2Ray 客户端 outbound} <--(VMess)-->  {V2Ray 服务器 inbound <-> V2Ray 服务器 outbound} <--(Freedom)--> {目标网站}

Project V 是一个工具集合，它可以帮助你打造专属的基础通信网络。

Project V 的核心工具称为V2Ray，其主要负责网络协议和功能的实现，与其它 Project V 通信。

V2Ray 可以单独运行，也可以和其它工具配合，以提供简便的操作流程。

### 主要特性
* 多入口多出口: 一个 V2Ray 进程可并发支持多个入站和出站协议，每个协议可独立工作。
* 可定制化路由: 入站流量可按配置由不同的出口发出。轻松实现按区域或按域名分流，以达到最优的网络性能。
* 多协议支持: V2Ray 可同时开启多个协议支持，包括 Socks、HTTP、Shadowsocks、VMess 等。每个协议可单独设置传输载体，比如 TCP、mKCP、WebSocket 等。
* 隐蔽性: V2Ray 的节点可以伪装成正常的网站（HTTPS），将其流量与正常的网页流量混淆，以避开第三方干扰。
* 反向代理: 通用的反向代理支持，可实现内网穿透功能。
* 多平台支持: 原生支持所有常见平台，如 Windows、Mac OS、Linux，并已有第三方支持移动平台。

# 安装
> Ubuntu 12.04 / 14.04 及后续版本

Linux 安装脚本
```Bash
$ bash <(curl -L -s https://install.direct/go.sh)
```
此脚本会自动安装以下文件：
* /usr/bin/v2ray/v2ray：V2Ray 程序；
* /usr/bin/v2ray/v2ctl：V2Ray 工具；
* /etc/v2ray/config.json：配置文件；
* /usr/bin/v2ray/geoip.dat：IP 数据文件
* /usr/bin/v2ray/geosite.dat：域名数据文件

此脚本会配置自动运行脚本。自动运行脚本会在系统重启之后，自动运行 V2Ray。目前自动运行脚本只支持带有 Systemd 的系统，以及 Debian / Ubuntu 全系列。

运行脚本位于系统的以下位置：
* /etc/systemd/system/v2ray.service: Systemd
* /etc/init.d/v2ray: SysV

脚本运行完成后，你需要：
* 编辑 /etc/v2ray/config.json 文件来配置你需要的代理方式；
* 运行 service v2ray start 来启动 V2Ray 进程；
* 之后可以使用 service v2ray start|stop|status|reload|restart|force-reload 控制 V2Ray 的运行。

### 新手上路

####客户端
在你的 PC （或手机）中，你需要运行 V2Ray 并使用下面的配置：
```
{
  "inbounds": [{
    "port": 1080,  // SOCKS 代理端口，在浏览器中需配置代理并指向这个端口
    "listen": "127.0.0.1",
    "protocol": "socks",
    "settings": {
      "udp": true
    }
  }],
  "outbounds": [{
    "protocol": "vmess",
    "settings": {
      "vnext": [{
        "address": "server", // 服务器地址，请修改为你自己的服务器 ip 或域名
        "port": 10086,  // 服务器端口
        "users": [{ "id": "b831381d-6324-4d53-ad4f-8cda48b30811" }]
      }]
    }
  },{
    "protocol": "freedom",
    "tag": "direct",
    "settings": {}
  }],
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [{
      "type": "field",
      "ip": ["geoip:private"],
      "outboundTag": "direct"
    }]
  }
}
```
上述配置唯一要改的地方就是你的服务器 IP，配置中已注明。上述配置会把除了局域网（比如访问路由器）之外的所有流量转发到你的服务器。

#### 服务器

然后你需要一台防火墙外的服务器，来运行服务器端的 V2Ray。配置如下：
```
{
  "inbounds": [{
    "port": 10086, // 服务器监听端口，必须和上面的一样
    "protocol": "vmess",
    "settings": {
      "clients": [{ "id": "b831381d-6324-4d53-ad4f-8cda48b30811" }]
    }
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  }]
}
```
服务器的配置中需要确保 id 和端口与客户端一致，就可以正常连接了。

#### 运行

* 在 Windows 和 macOS 中，配置文件通常是 V2Ray 同目录下的 config.json 文件。直接运行 v2ray 或 v2ray.exe 即可。
* 在 Linux 中，配置文件通常位于 /etc/v2ray/config.json 文件。运行 v2ray --config=/etc/v2ray/config.json，或使用 systemd 等工具把 V2Ray 作为服务在后台运行。
