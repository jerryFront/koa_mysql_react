/**
 * 启用redis
 * 
 */

const Redis=require('ioredis')
const redis_config=require('../config/redisConfig.json')




/**
 * 将client做为mq的核心分发处理器
 * 对外统一发布订阅，接收缓存更新 插入client.queue，
 * 后续模拟两个线程对 queue进行分别处理，加上行锁
 * 
 * 
 maxRetriesPerRequest: 1

 */
const client= new Redis({  //自动连接
  preferredSlaves:[
    { host: "localhost", port:6379 },
    { host: "localhost", port: 6380 }
  ],
  maxRetriesPerRequest: 20,
  });


client.exipreWithDefaultTTL = function (key, seconds) {
    seconds  = seconds || 0;
    return redis.expire(key, seconds);
};

client.queue=client.queue||[]

client.on('message',(channel,message)=>{
    console.log('~~',message,channel)
})

client.on('error',err=>{
    console.error('Redis 连接错误：'+err)
    client.connect()
})




/**
 * 发布: 更新缓存
 * 支持复杂map/object
 * 参数格式 key,value,(exTime)  2/3个 或Object
 */
client.mqSet=(...obj)=>{

    /**支持mset和set两种方式 */

    if(obj.length!=2&&obj.length!=3&&!(typeof obj==='object'&&Object.getOwnPropertyNames(obj[0]).length)) return
    client.queue.push(obj)

    //后续交给 client.list去模拟多线程处理client.queue

    if(obj.length==2) client.set(obj[0],obj[1],'ex',300) //设置默认ex时间
    else if(obj.length==3) client.set(obj[0],obj[1],'ex',obj[2])
    else client.mset(obj.shift())

}

/**
 * 获取或查询缓存是否命中
 * 遍历client.list里的列表，查询是否有命中
 * 由于set最终写入的都是Redis对象 同一处，而不是new出来的，
 * 所以不需要单独改造get
 * 
 */


// client.mqSet('kk11',334,10)  //设置失效
// client.mqSet({'kk2':44})
// client.get('kk11').then(res=>console.log(res))






exports.client=client




/**
 * redis设计模式
 * 
 * 1.设置缓存失效时间，且从不主动删除缓存，直接更新（防止删除时高并发击穿而导致数据库宕机）
 * 2.读如未命中，则查后写缓存(如未查到也可以用一个默认的缓存)，写如命中，则将其push到消息队列(设置超时时间)，随后异步更新缓存队列
 * 
 * 解决缓存并发
 * 
 * 这里的并发指的是多个redis的client同时set key引起的并发问题。其实redis自身就是单线程操作，
 * 多个client并发操作，按照先到先执行的原则，先到的先执行，其余的阻塞。
 * 当然，另外的解决方案是把redis.set操作放在队列中使其串行化，必须的一个一个执行。
 * 
 * 
 * 缓存预热
 */

/**
 * 实现消息队列，并需要设置超时时间
 * 
 * 这里将client作为统一管理redis集群的master管理，client发布订阅来更新mq(client)，然后针对mq的每一行设置行锁以及超时时间
 * 由于多个触发会引发并发执行mq，则要注意mq的length，必须用while执行
 *
 */



/*
* 获取默认过期时间，单位秒
* */
const defaultExpired=parseInt(redis_config.CacheExpired)








