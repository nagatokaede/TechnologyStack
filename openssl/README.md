openssl
====================

* 创建私钥 命名为 private.key
```Bash
$ ssh-keygen -t rsa -b 2048 -f private.key
```

* 安装 openssl

* 根据私钥 private.key 创建公钥 
```Bash
$ openssl rsa -in private.key -pubout -outform PEM -out public.key
```
