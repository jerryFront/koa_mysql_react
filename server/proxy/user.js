const User=require('../model/user')
const md5=require('md5')
const rep=require('../utils/response')

const signIn=async (req,next)=>{


   let query=req.request.query||req.request.body


   const res=User.validate(query,'username','password')

   if(!res.result){
      req.response.body=rep(null,'0601',res.msg)
      return 
   }

   req.response.body=rep({},'0200')
  

   
}

module.exports={
   signIn,
}