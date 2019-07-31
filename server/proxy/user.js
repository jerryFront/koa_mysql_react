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

   if(re.length>0){ //��¼�ɹ�����д��token
      /**redisд��token
       * token���� userid&&timestamp ��md5
       */
      re=re[0].dataValues //���ص���һ��Userʵ��

      const now=new Date().getTime()/1000
      const key=md5(`${re.id}&&{now}`)

      redis.mqSet(key,true,600)  //���ù���ʱ��Ϊ10����

      delete re.password

      re['token']=key

   }

   req.response.body=rep.response(re,'0200')
  

   
}

module.exports={
   signIn,
}