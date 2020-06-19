mongodb
=======================

### 目录
* [基本概念](#基本概念)
* [基本命令](#基本命令)



基本概念
-----------------------
#### 在我们开始学习MySQL 数据库前，让我们先了解下RDBMS的一些术语：

数据库: 数据库是一些关联表的集合。

数据表: 表是数据的矩阵。在一个数据库中的表看起来像一个简单的电子表格。

列: 一列(数据元素) 包含了相同类型的数据, 例如邮政编码的数据。

行：一行（=元组，或记录）是一组相关的数据，例如一条用户订阅的数据。

冗余：存储两倍数据，冗余降低了性能，但提高了数据的安全性。

主键：主键是唯一的。一个数据表中只能包含一个主键。你可以使用主键来查询数据。

外键：外键用于关联两个表。

复合键：复合键（组合键）将多个列作为一个索引键，一般用于复合索引。

索引：使用索引可快速访问数据库表中的特定信息。索引是对数据库表中一列或多列的值进行排序的一种结构。类似于书籍的目录。

参照完整性: 参照的完整性要求关系中不允许引用不存在的实体。与实体完整性是关系模型必须满足的完整性约束条件，目的是保证数据的一致性。

基本命令
-----------------------
* 连接mySql
```Bash
# 注意用户名前可以有空格也可以没有空格，但是密码前必须没有空格，否则让你重新输入密码。
$ mysql -h[host] -P[port] -u[username] -p[passworld]
```
* 修改密码
```Bash
$ mysqladmin -u[username] -p[oldPassword] password [newPassword]

# 给 root 加个密码 123456 
$ mysqladmin -u root -password 123456
# 注：因为开始时root没有密码，所以-p旧密码一项就可以省略了。 

# 如果进入了mysql后想修改密码，就直接用mysql语句就好了
$ set PASSWORD=PASSWORD("123");
```
* 增加新用户
```Bash
$ grant select on 数据库.* to 用户名@登录主机 identified by “密码”;

# 增加一个用户test1密码为abc，让他可以在任何主机上登录，并对所有数据库有查询、插入、修改、删除的权限。首先用root用户连入MYSQL，然后键入以下命令
$ grant select,insert,update,delete on *.* to [email=test1@"%]test1@"%[/email]" Identified by "abc";

# 增加一个用户test2密码为abc,让他只可以在localhost上登录，并可以对数据库mydb进行查询、插入、修改、删除的操作(localhost指本地主机，即MYSQL数据库所在的那台主机),这样用户即使用知道test2的密码，他也无法从internet上直接访问数据库，只能通过MYSQL主机上的web页来访问了。
$ grant select,insert,update,delete on mydb.* to [email=test2@localhost]test2@localhost[/email] identified by "abc";
```
* 创建数据库
```Bash
$ create database [database_name];
```
* 修改指定数据库中所有varchar类型的表字段的字符集为UTF8，并将排序规则修改为utf8_general_ci
```Bash
SELECT CONCAT('ALTER TABLE `', table_name, '` MODIFY `', column_name, '` ', DATA_TYPE, '(', CHARACTER_MAXIMUM_LENGTH, ') CHARACTER SET UTF8 COLLATE utf8_general_ci', (CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE '' END), ';')
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'databaseName'
AND DATA_TYPE = 'varchar'
AND
(
    CHARACTER_SET_NAME != 'utf8'
    OR
    COLLATION_NAME != 'utf8_general_ci'
);
```
* 修改指定数据库中所有数据表的字符集为UTF8，并将排序规则修改为utf8_general_ci
```Bash
SELECT CONCAT('ALTER TABLE ', table_name, ' CONVERT TO CHARACTER SET  utf8 COLLATE utf8_unicode_ci;')
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'databaseName';
```
* 数据表数据操作
```Bash
# 显示所有的数据库
$ show [databases];

# 进入 dataBaseName 数据库
$ use [dataBaseName]

# 显示 dataBaseName 数据库的所有表
$ show [tables];

# 显示 tableName 表的字段信息
$ desc [tableName];

# 创建表
$ create table  [tableName] (name char(100), path char(100), count int(10), firstName char(100), firstMD5 char(100), secondName char(100), secondMD5 char(100), thirdName char(100), thirdMD5 char(100));

# 修改表名
$ rename table [oldTableName] to [newTableName];

# 删除表
$ drop table [tableName];

# 插入数据
$ INSERT INTO [tableName] (name, path, count, firstName, firstMD5, secondName, secondMD5, thirdName, thirdMD5) VALUES ('test', 'test', 1, 'name1', 'md1', 'name2', 'md2', 'name3', 'md3');

# 查询表中的数据
$ select * from [tableName];
$ select * from [tableName] where name = 'test';

# 更新数据
$ UPDATE [tableName] SET folderName ='Mary' where id=1;

# 删除数据
$ delete from [tableName] where folderName = 'test';
```


