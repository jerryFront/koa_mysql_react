
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


const compose=(...args)=>{
    let init=args.shift()
    return (...arg)=>{
        return args.reduce((a,b)=>{
           return a.then(res=>b.apply(nul,res))
        },Promise.resolve(init.apply(null,arg)))
    }
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
       
    return async(callback,id)=>{
             let url1=url
            if(id) url1=url1.replace('${id}',id)
            let res=await superagent.get(url1)
            if(res&&res.text&&res.status==200){
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