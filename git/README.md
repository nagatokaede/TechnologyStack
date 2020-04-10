git
===========================

## 目录
* [.gitignore](#.gitignore)
* [获取远程分支代码](#获取远程分支代码)

.gitignore
-----------
配置语法
* 空行或是以#开头的行即注释行将被忽略。
* 可以在前面添加正斜杠/来避免递归,下面的例子中可以很明白的看出来与下一条的区别。
* 可以在后面添加正斜杠/来忽略文件夹，例如build/即忽略build文件夹。
* 可以使用!来否定忽略，即比如在前面用了*.apk，然后使用!a.apk，则这个a.apk不会被忽略。
* \* 用来匹配零个或多个字符，如*.[oa]忽略所有以".o"或".a"结尾，*~忽略所有以~结尾的文件（这种文件通常被许多编辑器标记为临时文件）；[]用来匹配括号内的任一字符，如[abc]，也可以在括号内加连接符，如[0-9]匹配0至9的数；?用来匹配单个字符。
```Bash
# 忽略 .a 文件
*.a
# 但否定忽略 lib.a, 尽管已经在前面忽略了 .a 文件
!lib.a
# 仅在当前目录下忽略 TODO 文件， 但不包括子目录下的 subdir/TODO
/TODO
# 忽略 build/ 文件夹下的所有文件
build/
# 忽略 doc/notes.txt, 不包括 doc/server/arch.txt
doc/*.txt
# 忽略所有的 .pdf 文件 在 doc/ directory 下的
doc/**/*.pdf
```

获取远程分支代码
-------------------
* 新建一个文件夹作为这个项目的文件夹
```Bash
$ mkdir ObjectName
```

* 初始化
```Bash
$ git init
```

* 自己要与origin master建立连接（下划线为远程仓库链接）
```Bash
$ git remote add origin git@github.com:nagatokaede/WebProjectMain.git
```

* 把远程分支拉到本地

git fetch origin dev（dev为远程仓库的分支名）
```Bash
$ git fetch origin 0.0.1
```

* 在本地创建分支dev并切换到该分支

git checkout -b dev(本地分支名称) origin/dev(远程分支名称)
```Bash
$ git checkout -b 0.0.1 origin/0.0.1
```

* 把某个分支上的内容都拉取到本地

git pull origin dev(远程分支名称)
```Bash
$ git pull origin 0.0.1
```

finish!!!

之后只要仓库有了更新只要 git pull origin 0.0.1 就可以拉去远程这个分支的更新代码了
