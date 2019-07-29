const router=require('koa-router')()
const router=require('koa-router')()
const controller=require('../controller/user')

router.get('/user/list',controller)
router.get('/user/get',controller)

module.exports=router