const router=require('koa-router')()
const proxy=require('../proxy/user')

router.all('/user/list',proxy.signIn)
router.all('/user/get',proxy.signIn)

module.exports=router