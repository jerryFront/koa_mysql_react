const User=require('../model/user')
const md5=require('md5')
const rep=require('../utils/response')
const redis=require('../utils/redis').client

const signIn=async (req,next)=>{


   let query=rep.request(req)


   const res=User.validate(query,'username','password')

   if(!res||!res.result){
      req.response.body=rep.response(null,'0601',res.msg)
      return
      
   }
    
   let re=await User.find(query)

   if(re.length>0){ //登录成功，则写入token
      /**redis写入token
       * token策略 userid&&timestamp 再md5
       */
      re=re[0].dataValues //返回的是一个User实体

      const now=new Date().getTime()/1000
      const key=md5(`${re.id}&&{now}`)

      redis.mqSet(key,true,600)  //设置过期时间为10分钟

      delete re.password

      re['token']=key

   }

   req.response.body=rep.response(re,'0200')
  

   
}

module.exports={
   signIn,
}