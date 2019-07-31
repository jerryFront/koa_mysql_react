const router=require('koa-router')()
const proxy=require('../proxy/news')

router.all('/news/list',proxy.getNewsList)


module.exports=router