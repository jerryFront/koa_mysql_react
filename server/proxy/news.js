const News=require('../model/news')
const NewsDetail=require('../model/news_detail')
const md5=require('md5')
const rep=require('../utils/response')
const redis=require('../utils/redis').client
const pageConfig=require('../config/common')
const Op=require('sequelize').Op

const getNewsList=async (req,next)=>{

  let query=rep.request(req)

  const res=News.validate(query,'page_num')



  if(!res||!res.result){
    req.response.body=rep.response(null,'0601',res.msg)
    return
  }

  //限制需要分页

  const params={
    //attributes:{exclude:['id','version','status','updateAt','createAt']},  //去除某些输出列
    limit:query.limit||pageConfig.limit,
    offset:(query.limit||pageConfig.limit)*(query.page_num||pageConfig.page_num),
  }
  
  //筛选条件
  params.where={
    title:query.title?{[Op.like]:`%${query.title}%`}:{[Op.ne]:null},
  }

  
  const re=await News.findAllCount(params)

  rep.reply(req,re)

}

const getNewsDetail=async (req,next)=>{

    let query=rep.request(req)

    const res=News.validate(query,'uid')

    if(!res||!res.result){
        req.response.body=rep.response(null,'0601',res.msg)
        return
    }

    query.where={
      uid:query.uid,
    }

    let re=await NewsDetail.find(query)
    if(re&&re.length) re=re[0]

    rep.reply(req,re)


}



module.exports={
    getNewsList,
    getNewsDetail,
}