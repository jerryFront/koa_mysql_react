const router=require('koa-router')()
const {getResult}=require('../proxy/music')



const apis=[
    'playlist/hot',
]

apis.forEach(url=>{
    router.all(`/music-api/${url}`,getResult)
})


module.exports=router
