const router=require('koa-router')()
const proxy=require('../proxy/news')

router.all('/news/list',proxy.getNewsList)
router.all('/news/getDetail',proxy.getNewsDetail)


module.exports=router