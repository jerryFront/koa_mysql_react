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

   query.attributes={exclude:['password']}


   let re=await User.find(query)

   if(re){ //登录成功，则写入token
      /**redis写入token
       * token策略 userid&&timestamp 再md5
       */
   
      const now=new Date().getTime()/1000
      const key=md5(`${re.id}&&{now}`)

      redis.mqSet(key,true,600)  //设置过期时间为10分钟

      re['token']=key

      rep.reply(req,re)

   }else{ //登录失败

      rep.reply(req,re,'1101') 
   }
   
}


const getUser=async (req,next)=>{

   let query=rep.request(req)
   const res=User.validate(query,'id')
   if(!res||!res.result){
      req.response.body=rep.response(null,'0601',res.msg)
      return
   }
   query.attributes={exclude:['password']}

   let re=await User.find(query)

   rep.reply(req,re)
    

}

const update=async (req,next)=>{

     let query=rep.request(req)
     const res=User.validate(query,'id')
     if(!res||!res.result){
      req.response.body=rep.response(null,'0601',res.msg)
      return
     }

     query.attributes={exclude:['password']}

     query.where={id:query.id}

     let re=await User.updated(query)

     rep.reply(req,re)


}


module.exports={
   signIn,
   getUser,
   update,
}