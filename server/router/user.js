const router=require('koa-router')()
const proxy=require('../proxy/user')

router.all('/user/list',proxy.signIn)
router.all('/user/login',proxy.signIn)
router.all('/user/info',proxy.getUser)
router.all('/user/update',proxy.update)

module.exports=router