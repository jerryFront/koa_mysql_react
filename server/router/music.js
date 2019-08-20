const router=require('koa-router')()
const {getResult}=require('../proxy/music')


/**
 * 第三方接口相关列表
 * 目前转发的一个代理网易云的接口列表
 *  */
const apis=[
    'playlist/hot', 
    'banner', //首页banner
    'personalized', //推荐歌单
    'playlist/detail', //推荐歌单的详情
    'top/artists', //歌手列表(默认分页)
    'artist/list', //字母选择歌手
    'toplist/detail', //排行榜相关
]

apis.forEach(url=>{
    router.all(`/music-api/${url}`,getResult(url))
})


module.exports=router
