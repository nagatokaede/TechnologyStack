Nginx
=============================
Nginx是lgor Sysoev为俄罗斯访问量第二的rambler.ru站点设计开发的。从2004年发布至今，凭借开源的力量，已经接近成熟与完善。

Nginx功能丰富，可作为HTTP服务器，也可作为反向代理服务器，邮件服务器。支持FastCGI、SSL、Virtual Host、URL Rewrite、Gzip等功能。并且支持很多第三方的模块扩展。

### 目录
* [安装](#安装)
    * apt-get 安装
* [命令](#命令)
    * 查看 `nginx` 路径
    * 查看 `nginx` 配置文件路径
    * 重启
* [配置](#配置)

安装
----------------------
apt-get 安装
> 该方法只能安装低版本
```Bash
$ apt-get install nginx
```

命令
----------------------
* 查看 `nginx` 路径
```Bash
$ ps aux|grep nginx
```
* 查看 `nginx` 配置文件路径

假设 `nginx` 路径位：/usr/sbin/nginx
```Bash
$ /usr/sbin/nginx -t
```

* 重启
```Bash
$ nginx -s reload
```

配置
----------------------
> nginx.conf 文件为配置文件

通过命令查找的配置文件

```
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址 公网地址可用域名代替   
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向 mysvr 定义的服务器列表 http:// 是必须的
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```
上面是nginx的基本配置，需要注意的有以下几点：

1、几个常见配置项：

* 1.$remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
* 2.$remote_user ：用来记录客户端用户名称；
* 3.$time_local ： 用来记录访问时间与时区；
* 4.$request ： 用来记录请求的url与http协议；
* 5.$status ： 用来记录请求状态；成功是200；
* 6.$body_bytes_s ent ：记录发送给客户端文件主体内容大小；
* 7.$http_referer ：用来记录从那个页面链接访问过来的；
* 8.$http_user_agent ：记录客户端浏览器的相关信息；

2、惊群现象：一个网路连接到来，多个睡眠的进程被同事叫醒，但只有一个进程能获得链接，这样会影响系统性能。

3、每个指令必须有分号结束。
