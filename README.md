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
 
2019.8.2

 1.采用react-router 4.0版本以上的，可以灵活定义Router位置
 2.css modules 来加入局部作用域以及模块依赖 (antd必须采用全局css，所以两者要分开打包)
 3.postcss 在webpack3以上需要建一个postcss.config.js单独配置

 2019.8.4

 useEffect的不作为componentDidUnmount的话，传入第二个参数时一定注意：第二个参数不能为引用类型，引用类型比较不出来数据的变化，会造成死循环（实际是因为里面console了data）

2019.8.5

1.options请求类同普通请求；
2.useEffect频繁触发是因为console了data，用useCallback必须将data作为hooks相关来引入；
3.将setData作为回调返回给业务函数
4.react是jsx，如果loading放在最外层，则自组件触发dispatch的时候，会重复循环渲染

