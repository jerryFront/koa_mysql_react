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


module.exports={
    uuid:guid,
    query
}