/**
 * 启用redis
 * 
 */

const redis=require('redis')
const redis_config=require('../config/redisConfig.json')

const client=redis.createClient(redis_config)


const clientA=redis.createClient(6380,redis_config.RedisHost)

client.on('error',err=>{
    console.error('Redis 连接错误：'+err)
    process.exit(1)
})




/*
* 设置缓存
* @param key 缓存key
* @param  value缓存value
* @param expired缓存的有效时长，单位秒
* @param callback回调函数
* */
exports.setItem=(key,value,expired,callback)=>{
    client.set(key,JSON.stringify(value),err=>{
        if(err){
            return callback(err)
        }
        if(expired){
            client.expire(key,expired)
        }
        return callback(null)
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
            return callback(err)
        }
        return callback(null,JSON.parse(reply))
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

/*
* 获取默认过期时间，单位秒
* */
exports.defaultExpired=parseInt(redis_config.CacheExpired)


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