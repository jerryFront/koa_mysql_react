# koa_mysql_react

#superagent

#koa+mysql+react_hook


#Sequelize 
ORM



1. 需要手动安装mysql依赖 npm install mysql2 (已在package.json里加入)

2.https://github.com/microsoftarchive/redis/releases 下载redis 3.0+, Redis-x64-3.0.504.zip,后续模拟redis集群



3.客户端登录后缓存session 的实现机制： koa-mysql-session redis

https://www.cnblogs.com/cangqinglang/p/10266952.html


2019.7.31 

 1.Sequelize 默认所有的列都是不能为空的,所以需要设置allowNull:true;
 2.实现统一的router之前的拦截器，利用koa-compose本身管道机制，自定义实现鉴权以及token的管道验证机制，后续可以支持无损扩充，每个步骤如错误，则返回对应的errorCode,正确则接着返回ctx
 3.token生成机制md5，然后redis存储的key为token本身，利用redis本身过期时间


2019.8.1 

 1.配置react webpack环境
 2.初步使用react-hooks
