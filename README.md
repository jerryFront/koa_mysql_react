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


2019.8.7

1.lazy/react-loadable/@loadable/component 利用webpack新特性实现懒加载
2.特别注意动态import(webpack语法)的实际执行(path只能中间部分动态变化，利用include来减少全局搜索的文件类型)


2019.8.8

1.cluster线程池 分发send 参数，然后从线程 process.on('message')接收参数执行，执行完后process.send(result)，然后线程池对应的每个worker的on('message')接收处理完的result


2019.8.9

1.reacthooks function components要注意将逻辑与return(render)分开，否则rerender会不断执行初始化数据 
2.css module的样式问题，父组件:local会自动作用于子组件

2019.8.10

1.props.children卡槽，类比props render同理

2019.8.12

1.react-css-modules为css module的备选方案

2019.8.14

1.FileReader base64上传需层层检查路径并创建，成功或失败全用resolve处理，并拼接返回的url
2.useRef获取最新对象引用，useState若需每次触发，则不能绑定在同一对象上，因为链表保持为对象的引用，hooks会判定其一直没有变化，不会再次触发hooks系列，正确方法为...等浅拷贝
3.function components遇到use系列，则会返回对应其链表上最新的fiberNode.memoizedState(从缓存读取)

2019.8.15

1.ioredis针对复杂数据只能采用序列化，统一处理Model返回，取其实例的dataValues

