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
    'artist/album', //获取歌手专辑(id，limit)
    'toplist/detail', //排行榜相关
    'top/playlist', //歌单 ( 网友精选碟 cat 华语/流行/摇滚)
    'discover/playlist', //歌单类型(404)
    'playlist/catlist', //歌单分类名 
    'top/playlist/highquality', //获取精品歌单
    'lyric', //获取歌词(id)
    'related/playlist', //相关歌单的推荐歌曲(id)
    'album', //获取专辑内容(id)
    'album/detail/dynamic', //专辑动态信息(id)
    'simi/playlist', //获取相似歌单(id)
    'simi/song', //获取相似音乐(id)
    'album/newest', //最新专辑，新碟上架
]

apis.forEach(url=>{
    router.all(`/music-api/${url}`,getResult(url))
})


module.exports=router
