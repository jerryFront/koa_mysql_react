const News=require('../model/news')
const md5=require('md5')
const rep=require('../utils/response')
const redis=require('../utils/redis').client
const pageConfig=require('../config/common')

const getNewsList=async (req,next)=>{

  let query=rep.request(req)

  const res=News.validate(query,'page_num')



  if(!res||!res.result){
    req.response.body=rep.response(null,'0601',res.msg)
    return
  }

  //限制需要分页

  
  const re=await News.findAll({
    //   where:{
    //       title:query.title?{$like:`%${query.title}%`}:{},
    //   },
      limit:query.limit||pageConfig.limit,
      offset:(query.limit||pageConfig.limit)*(query.page_num||pageConfig.page_num),
  })

  req.response.body=rep.response(re,'0200')

}



module.exports={
    getNewsList,
}