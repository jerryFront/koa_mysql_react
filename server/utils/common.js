
const superagent=require('superagent')
const cheerio=require('cheerio')

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")

/**
 * uuid生成方法
 */
const guid=()=>{
   var chars = CHARS,
   uuid = new Array(36),
   rnd = 0,
   r;
 for (var i = 0; i < 36; i++) {
   if (i == 8 || i == 13 || i == 18 || i == 23) {
     uuid[i] = "-";
   } else if (i == 14) {
     uuid[i] = "4";
   } else {
     if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
     r = rnd & 0xf;
     rnd = rnd >> 4;
     uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
   }
 }
 return uuid.join("");
}


const connection=require('../config/connect')

/**
 * 将connection query promise和compose化
 */
const query=(sql,params,callback)=>{
     
    return new Promise((resolved,rejected)=>{
       connection.query(sql,params,(error,data)=>{
           if(error){
               console.error(`${sql}执行失败`)
               rejected(error)
           }else{
               callback&&callback(data)
               resolved(data)
           }
       })
    })
}

/**
 * 
 * @param {string} url  //出去id变化的其他不变部分，可用占位符${id}来暂时替代 ，需要爬虫的目标网页
 * @param {number} id  //自增规律性id
 * @param {function} callback 拉取数据后自定义回调函数 
 * 
 * 实际中基本只有id总会变化自增
 */
function fork(url,callback,id){

    /**设置superagent的headers伪装 */
    const headers={   //根据爬虫的不同网站要求，具体更改
      // 'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      // 'Accept-Encoding':'gzip, deflate, sdch',
      // 'Accept-Language':'zh-CN,zh;q=0.8',
      // 'Cache-Control':'max-age=0',
      // 'Connection':'keep-alive',
      // //'Cookie:':'', //此需要每次目标网站返回来更新，开始不设置
      // 'Host':url,
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
    }

    const superAgents=url=>{
       const su=superagent.get(url)
       Object.keys(headers).forEach(i=>{
       su.set(i,headers[i])
       })
       return su
    }


       
    return async(callback,id)=>{
             let url1=url
            if(id) url1=url1.replace('${id}',id)
            let res=await superAgents(url1)

            if(res&&res.text&&res.status==200){
                /**每次重新更新cookie，如果response返回了cookie的话 */
                headers['Cookie']=(res.headers&&res.headers.Cookie)?res.headers.Cookie:'' 
                var $=cheerio.load(res.text,{decodeEntities:false}) //所有的dom结构
                await callback&&callback($)
            }else{
                console.error('拉取数据失败')
                console.log(`目前拉取:${id}页`) 
            }
       
    }
   

}


module.exports={
    uuid:guid,
    query,
    fork,
}