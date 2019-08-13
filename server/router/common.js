const router=require('koa-router')()
const proxy=require('../proxy/upload')

router.post('/upload/image',proxy.fileUpload)


module.exports=router