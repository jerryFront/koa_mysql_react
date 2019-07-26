/**
 * 启用redis
 * 
 */

const redis=require('ioredis')
const redis_config=require('../config/redisConfig.json')


const clientA=new redis({
    port:6379,
})
const clientB=new redis({
    port:6380,
    flags: "slave"
})

/**
 * 将client做为mq的核心分发处理器
 * 对外统一发布订阅，接收缓存更新 插入client.queue，
 * 后续模拟两个线程对 queue进行分别处理，加上行锁
 * 
 */
const client=new redis()

client.list=[clientA,clientB]
client.queue=client.queue||[]

client.on('message',(channel,message)=>{
    console.log('~~',message,channel)
})

client.on('error',()=>{
    client.connect()
})




/**
 * 发布: 更新缓存
 * 支持复杂map/object
 */
client.mqSet=obj=>{

    if(typeof obj!=='object'||(!Object.getOwnPropertyNames(obj).length)) return
    client.queue.push(obj)

    //后续交给 client.list去模拟多线程处理

    client.list[0].mset(obj)

}

/**
 * 获取或查询缓存是否命中
 * 遍历client.list里的列表，查询是否有命中
 * 由于set最终写入的都是Redis对象 同一处，而不是new出来的，
 * 所以不需要单独改造get
 * 
 */
// client.mqGet=async key=>{
// //     if(!client.list||!client.list.length) return
// //     let arr=client.list.reduce((prev,cur)=>{
// //         prev.push(cur.get(key))
// //         return prev
// //     },[])

// //    let res=await Promise.all(arr)

//    let res=await client.get(key)
//    console.log(res)
//    return res
      
// }








exports.client=client


// client.on('error',err=>{
//     console.error('Redis 连接错误：'+err)
//     process.exit(1)
// })


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

/*
* 设置缓存
* @param key 缓存key
* @param  value缓存value
* @param expired缓存的有效时长，单位秒
* @param callback回调函数
* */
exports.setItem=(key,value,expired,callback)=>{
    //默认使用系统过期时间
    expired=expired||defaultExpired
    
    client.set(key,JSON.stringify(value),err=>{
        if(err){
            return callback&&callback(err)
        }
        if(expired){
            client.expire(key,expired)
        }
        return callback&&callback(null)
    })
}

/*
* 获取缓存
* @param key缓存key
* @param callback回调函数
* */
exports.getItem=(key,callback)=>{
    client.get(key,function(err,reply){
        if(err){
            return callback&&callback(err)
        }
        return callback&&callback(null,JSON.parse(reply))
    })
}


/*
* 移除缓存
* @param key缓存key
* @param callback回调函数
* */
exports.removeItem=(key,callback)=>{
    client.del(key,function(err){
        if(err){
            return callback(err)
        }
        return callback(null)
    })
}





/**
 * 根据对象的属性和值来拼装key
 * 
 */
exports.generateKey=(prefix,obj)=>{
   if(typeof prefix==='object'){
       obj=prefix
       prefix=undefined
   }

   var attr,value,key='';
   for(attr in obj){
       value=obj[attr]
       //形如: _name_Tom
       key+='_'+attr.toString().toLowerCase()+'_'+value.toString()
   }
   if(prefix) key=prefix+key;
   else key=key.substr(1)

   return key

}